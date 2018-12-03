var camera, scene, renderer;
var geometry, material, mesh;
var ambientLight, pointLight, shadowMaterial, hemiLight;
var controls, playMesh;
var wingMesh, noseMesh, propellerMesh, tailMesh, flipperMesh, engineMesh;
var playBound, sphereBound;

var torusKnot, torusKnotBound;
var torusRing, torusRingBound;
var icoMesh, icoBound;
var cylMesh1, cylMesh2, cylMesh3, cylBound1, cylBound2, cylBound3;
var parentOrbit, planetOrbit1, planetOrbit2, planetOrbit3;

var particleKnot;
var starGeo, starMat, starField;

var listener, sound, audioLoader ;

var clock = new THREE.Clock();

init();

function init() {
    scene = new THREE.Scene();

    camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.01, 1000);
    camera.position.set(0, 7, 20);

   

    createSphere();
    createLights();
    createAirPlane();
    createObjects();
    createAudio();
    //createParticles();

    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    document.body.appendChild(renderer.domElement);


    if (playMesh != null) {
        controls = new THREE.FlyControls(playMesh);
        controls.movementSpeed = 2;
        controls.domElement = renderer.domElement;
        controls.rollSpeed = Math.PI / 150;
        controls.autoForward = false;
        controls.dragToLook = false;

        update();
    }

    window.addEventListener('resize', onWindowResize, false);
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize(window.innerWidth, window.innerHeight);
}

function update() {
    controls.update(1);
    setTimeout(update, 16);
    renderer.render(scene, camera);

    playBound.setFromObject(playMesh);
    torusKnotBound.setFromObject(torusKnot);
    torusRingBound.setFromObject(torusRing);


    propellerMesh.rotation.z += 0.1;

    objectInteraction();
    animateSea();
}

function objectInteraction() {
    torusKnot.rotation.x += 0.01;
    torusKnot.rotation.y += 0.01;

    torusRing.rotation.y += 0.01;

    icoMesh.rotation.x += 0.01;
    icoMesh.rotation.y -= 0.01;

    parent.rotation.x -= 0.02;
    planetOrbit1.rotation.x += 0.03;
    planetOrbit2.rotation.x += 0.03;
    planetOrbit3.rotation.x += 0.03;

    if (playBound.intersectsSphere(sphereBound)) {
        mesh.material.color.setHex(0xe56baf8);

    }
    else {
        mesh.material.color.setHex(0x9540E4);
        playMesh.position.set(0, 0, 0);
    }

    if (playBound.intersectsBox(torusKnotBound)) {
        torusKnot.material.wireframe = true;
    }
    else { torusKnot.material.wireframe = false; }

    if (playBound.intersectsBox(torusRingBound)) {
        if (torusRing.scale.x < 2 && torusRing.scale.y < 2 && torusRing.scale.z<2) {
            torusRing.scale.x = torusRing.scale.y = torusRing.scale.z += 0.1;
        }
    }
    else {
        if (torusRing.scale.x > 1 && torusRing.scale.y > 1 && torusRing.scale.z > 1) {
            torusRing.scale.x = torusRing.scale.y = torusRing.scale.z -= 0.1;
        }
    }

    if (playBound.intersectsSphere(icoBound)) {
        icoMesh.material.color.setHex(0xffffff);
        icoMesh.material.side = THREE.BackSide;
    }
    else {
        icoMesh.material.color.setHex(0xe73445);
        icoMesh.material.side = THREE.FrontSide;
    }

    if (playBound.intersectsBox(cylBound1)) {
        if (cylMesh1.position.y < 450) {
            cylMesh1.position.y += 2;
        }
    }
    else {
        if (cylMesh1.position.y > 400) {
            cylMesh1.position.y -= 2;
        }
    }

    if (playBound.intersectsBox(cylBound2)) {
        if (cylMesh2.position.y < 416) {
            cylMesh2.position.y += 1.84;
        }
        if (cylMesh2.position.x <172) {
            cylMesh2.position.x += .76;
        }
    }
    else {
        if (cylMesh2.position.y > 370) {

            cylMesh2.position.y -= 1.84;
        }
        if (cylMesh2.position.x > 153) {
            cylMesh2.position.x -= 0.76;
        }
    }

    if (playBound.intersectsBox(cylBound3)) {
        if (cylMesh3.position.y < 318) {
            cylMesh3.position.y += 1.4;
            cylMesh3.position.x += 1.4;
        }
    }
    else {
        if (cylMesh3.position.y > 283) {
            cylMesh3.position.y -= 1.4;
            cylMesh3.position.x -= 1.4;
        }
        
    }
}

function createSphere() {
    geometry = new THREE.SphereGeometry(400, 32, 32);
    geometry.applyMatrix(new THREE.Matrix4().makeRotationX(-Math.PI / 2));
    geometry.mergeVertices();
    var l = geometry.vertices.length;
    this.waves = [];
    for (var i = 0; i < l; i++) {
        var v = geometry.vertices[i];
        this.waves.push({
            y: v.y,
            x: v.x,
            z: v.z,
            ang: Math.random() * Math.PI * 2,
            amp: 3 + Math.random() * 5,
            speed: 0.016 + Math.random() * 0.032
        });
    };
    material = new THREE.MeshStandardMaterial({
        color: 0xe56baf8,
        shading: THREE.FlatShading,
        metalness: 0,
        roughness: 0.5,
        side: THREE.BackSide
        //,wireframe: true
    });
    mesh = new THREE.Mesh(geometry, material);
    mesh.receiveShadow = true;
    mesh.geometry.computeBoundingSphere();
    sphereBound = new THREE.Sphere(mesh.position, mesh.geometry.boundingSphere.radius);
    scene.add(mesh);

}

function animateSea() {
    var verts = mesh.geometry.vertices;
    var l = verts.length;

    for (var i = 0; i < l; i++) {
        var v = verts[i];

        var vprops = this.waves[i];

        v.x = vprops.x + Math.cos(vprops.ang) * vprops.amp;
        v.y = vprops.y + Math.sin(vprops.ang) * vprops.amp;


        vprops.ang += vprops.speed;

    }
    mesh.geometry.verticesNeedUpdate = true;
    mesh.rotation.z += .005;
}

function createLights() {
    ambientLight = new THREE.AmbientLight(0xe56baf8, 0.2);
    scene.add(ambientLight);

    pointLight = new THREE.PointLight(0xffffff, 1);
    pointLight.position.set(0, 0, 0);
    pointLight.castShadow = true;
    pointLight.shadowDarkness = 0.2;
    pointLight.shadow.mapSize.width = 1024;
    pointLight.shadow.mapSize.height = 1024;
    scene.add(pointLight);

    /*shadowMaterial = new THREE.ShadowMaterial({ color: 0x003366 });
    shadowMaterial.opacity = 0.5;*/

    hemiLight = new THREE.HemisphereLight(0x00BFFF, 0x00008B, 0.3);
    scene.add(hemiLight);
}

function createAirPlane() {
    playMesh = new THREE.Mesh(new THREE.CubeGeometry(2, 2, 8, 1, 1, 1), new THREE.MeshPhongMaterial({ color: 0xff0000, shading: THREE.FlatShading }));
    playMesh.position.set(0, -50, 0);

    wingMesh = new THREE.Mesh(new THREE.CubeGeometry(16, 0.5, 3, 1, 1, 1), new THREE.MeshPhongMaterial({ color: 0xff0000, shading: THREE.FlatShading }));
    wingMesh.position.z = -2;
    wingMesh.position.y = 0.2;
    wingMesh.receiveShadow = true;
    wingMesh.castShadow = true;
    playMesh.add(wingMesh);

    engineMesh = new THREE.Mesh(new THREE.CubeGeometry(2, 2, 1, 1, 1, 1), new THREE.MeshPhongMaterial({ color: 0xffffff, shading: THREE.FlatShading }));
    engineMesh.position.z = -4.5;
    engineMesh.receiveShadow = true;
    engineMesh.castShadow = true;
    playMesh.add(engineMesh);

    propellerMesh = new THREE.Mesh(new THREE.CubeGeometry(6, 0.80, 0.2, 1, 1, 1), new THREE.MeshPhongMaterial({ color: 0x00000, shading: THREE.FlatShading }));
    propellerMesh.position.z = -5.2;
    propellerMesh.receiveShadow = true;
    propellerMesh.castShadow = true;
    playMesh.add(propellerMesh);

    noseMesh = new THREE.Mesh(new THREE.CubeGeometry(0.75, 0.75, 0.75, 1, 1, 1), new THREE.MeshPhongMaterial({ color: 0x00000, shading: THREE.FlatShading }));
    noseMesh.position.z = -5.2;
    noseMesh.receiveShadow = true;
    noseMesh.castShadow = true;
    playMesh.add(noseMesh);

    flipperMesh = new THREE.Mesh(new THREE.CubeGeometry(6, 0.5, 1.5, 1, 1, 1), new THREE.MeshPhongMaterial({ color: 0xff0000, shading: THREE.FlatShading }));
    flipperMesh.position.z = 3;
    flipperMesh.position.y = 0.2;
    flipperMesh.receiveShadow = true;
    flipperMesh.castShadow = true;
    playMesh.add(flipperMesh);

    tailMesh = new THREE.Mesh(new THREE.CubeGeometry(0.5, 3, 1.5, 1, 1, 1), new THREE.MeshPhongMaterial({ color: 0xff0000, shading: THREE.FlatShading }));
    tailMesh.position.z = 3;
    tailMesh.position.y = 1;
    tailMesh.receiveShadow = true;
    tailMesh.castShadow = true;
    playMesh.add(tailMesh);

    playMesh.add(camera);
    playBound = new THREE.Box3(new THREE.Vector3(), new THREE.Vector3());
    playMesh.receiveShadow = true;
    playMesh.castShadow = true;
    scene.add(playMesh);
}

function createObjects() {
    torusKnot = new THREE.Mesh(new THREE.TorusKnotGeometry(100, 25, 100), new THREE.MeshNormalMaterial({}));
    torusKnot.position.set(0, 0, 0);
    torusKnot.geometry.computeBoundingBox();
    torusKnotBound = new THREE.Box3(new THREE.Vector3(), new THREE.Vector3());
    //torusKnot.castShadow=true;
    scene.add(torusKnot);

    torusRing = new THREE.Mesh(new THREE.TorusGeometry(40, 15, 40, 50), new THREE.MeshStandardMaterial({
        color: 0x8e6c,
        shading: THREE.SmoothShading
    }));
    torusRing.position.set(0, -200, 200);
    torusRing.receiveShadow = true;
    torusRing.geometry.computeBoundingBox();
    torusRingBound = new THREE.Box3(new THREE.Vector3(), new THREE.Vector3());
    torusRing.castShadow = true;
    scene.add(torusRing);

    
    icoMesh = new THREE.Mesh(new THREE.IcosahedronGeometry(50, 1), new THREE.MeshPhongMaterial({
        color: 0xe73445,
        shading: THREE.FlatShading,
        emmissive: 0xe73445,
        shininess: 100
    }));
    icoMesh.position.set(75, 0, -225);
    icoMesh.receiveShadow = true;
    icoMesh.castShadow = true;
    icoMesh.geometry.computeBoundingSphere();
    icoBound = new THREE.Sphere(icoMesh.position, icoMesh.geometry.boundingSphere.radius);
    scene.add(icoMesh);

    cylMesh1 = new THREE.Mesh(new THREE.CylinderGeometry(15, 15, 96, 10), new THREE.MeshPhongMaterial({ color: 0x2194ce, shininess: 100 }));
    cylMesh1.position.set(0, 400, 0);
    cylMesh1.receiveShadow = true;
    cylMesh1.castShadow = true;
    cylMesh1.geometry.computeBoundingBox();
    cylBound1 = new THREE.Box3(new THREE.Vector3(), new THREE.Vector3());
    cylBound1.setFromObject(cylMesh1);
    scene.add(cylMesh1);

    cylMesh2 = new THREE.Mesh(new THREE.CylinderGeometry(15, 15, 96, 10), new THREE.MeshPhongMaterial({ color: 0x2194ce, shininess: 100 }));
    cylMesh2.position.set(153, 370, 0);
    cylMesh2.rotation.z = -Math.PI / 8;
    cylMesh2.receiveShadow = true;
    cylMesh2.castShadow = true;
    cylMesh2.geometry.computeBoundingBox();
    cylBound2 = new THREE.Box3(new THREE.Vector3(), new THREE.Vector3());
    cylBound2.setFromObject(cylMesh2);
    scene.add(cylMesh2);

    cylMesh3 = new THREE.Mesh(new THREE.CylinderGeometry(15, 15, 96, 10), new THREE.MeshPhongMaterial({ color: 0x2194ce, shininess: 100 }));
    cylMesh3.position.set(283, 283, 0);
    cylMesh3.rotation.z = -Math.PI/4;
    cylMesh3.receiveShadow = true;
    cylMesh3.castShadow = true;
    cylMesh3.geometry.computeBoundingBox();
    cylBound3 = new THREE.Box3(new THREE.Vector3(), new THREE.Vector3());
    cylBound3.setFromObject(cylMesh3);
    scene.add(cylMesh3);

    parent = new THREE.Object3D();
    planetOrbit1 = new THREE.Mesh(new THREE.DodecahedronGeometry(20), new THREE.MeshPhongMaterial({ color: 0xe73445, emissive: 0xe73445 }));
    planetOrbit2 = new THREE.Mesh(new THREE.OctahedronGeometry(20), new THREE.MeshPhongMaterial({ color: 0xffcc33, emissive: 0xffcc33}));
    planetOrbit3 = new THREE.Mesh(new THREE.TetrahedronGeometry(20), new THREE.MeshPhongMaterial({ color: 0x7cfc00, emissive: 0x7cfc00}));
    planetOrbit1.receiveShadow = true;
    planetOrbit2.receiveShadow = true;
    planetOrbit3.receiveShadow = true;
    planetOrbit1.castShadow = true;
    planetOrbit2.castShadow = true;
    planetOrbit3.castShadow = true;
    planetOrbit1.position.set(0, 150, 0);
    planetOrbit2.position.set(0, 106, 106);
    planetOrbit3.position.set(0, 0, 150);
    parent.add(planetOrbit1);
    parent.add(planetOrbit2);
    parent.add(planetOrbit3);
    scene.add(parent);

}

function createParticles() {
    starGeo = new THREE.TorusKnotGeometry(200, 50, 200, 15, 1, 4);
    for (var i = 0; i < starGeo.vertices.count; i++) {
        var star = new THREE.Vector3();
        star.x = THREE.Math.randFloatSpread(100);
        star.y = THREE.Math.randFloatSpread(100);
        star.z = THREE.Math.randFloatSpread(100);

        starGeo.vertices.push(star);

    }
    starMat = new THREE.PointsMaterial({ color: 0xfdfd96 });
    starField = new THREE.Points(starGeo, starMat);
    scene.add(starField);

    //particleKnot = new THREE.Points(new THREE.TorusKnotGeometry(200, 50, 200, 15,1,4), new THREE.PointsMaterial({ color: 0x9540E4 }));
    //scene.add(particleKnot);


    
}

function createAudio() {
    listener = new THREE.AudioListener();
    camera.add(listener);

    sound = new THREE.Audio(listener);

    audioLoader = new THREE.AudioLoader();
    audioLoader.load('Gymnopedie No 1.mp3', function (buffer) {
        sound.setBuffer(buffer);
        sound.setLoop(true);
        sound.setVolume(1);
        sound.play();
    })
}
