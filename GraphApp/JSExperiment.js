var camera, scene, renderer;
var geometry, material, mesh;
var ambientLight, pointLight, shadowMaterial;
var controls, playMesh;
var wingMesh, propellerMesh, tailMesh, flipperMesh, engineMesh;
var playBound, sphereBound;

var torusKnot, torusKnotBound;
var torusRing, torusRingBound;
var icoMesh, icoBound;

var particleKnot;
var starGeo, starMat, starField;
var clock = new THREE.Clock();

init();

function init() {
    scene = new THREE.Scene();

    camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.01, 1000);
    camera.position.set(0, 7, 20);

    var loader = new THREE.ColladaLoader();

    /*loader.load('http://localhost:4173/airplane.dae', function (result) {
        playMesh = result.scene;
        playMesh.position.set(0, 0, 0);
        playMesh.add(camera);
        playBound = new THREE.Box3(new THREE.Vector3(), new THREE.Vector3());
        playMesh.receiveShadow = true;
        scene.add(playMesh);
    });*/

    createAirPlane();
    createObjects();
    //createParticles();

    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    document.body.appendChild(renderer.domElement);

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

    geometry = new THREE.SphereGeometry(400, 32, 32);
    material = new THREE.MeshStandardMaterial({
        color: 0xe56baf8,
        shading: THREE.SmoothShading,
        metalness: 0,
        roughness: 0.0,
        side: THREE.BackSide
        //,wireframe: true
    });
    mesh = new THREE.Mesh(geometry, material);
    mesh.receiveShadow = true;
    mesh.geometry.computeBoundingSphere();
    sphereBound = new THREE.Sphere(mesh.position, mesh.geometry.boundingSphere.radius);
    scene.add(mesh);

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
}

function objectInteraction() {
    torusKnot.rotation.x += 0.01;
    torusKnot.rotation.y += 0.01;

    torusRing.rotation.y += 0.01;

    icoMesh.rotation.x += 0.01;


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
        if (torusRing.scale.x < 2) {
            torusRing.scale.x += 0.1;
        }
        if (torusRing.scale.y < 2) {
            torusRing.scale.y += 0.1;
        }
        if (torusRing.scale.y < 2) {
            torusRing.scale.y += 0.1;
        }
    }
    else {
        if (torusRing.scale.x > 1) {
            torusRing.scale.x -= 0.1;
        }
        if (torusRing.scale.y > 1) {
            torusRing.scale.y -= 0.1;
        }
        if (torusRing.scale.y > 1) {
            torusRing.scale.y -= 0.1;
        }
    }

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
    torusKnot = new THREE.Mesh(new THREE.TorusKnotGeometry(100, 25, 100), new THREE.MeshNormalMaterial({/*transparent:true,opacity:0.8*/}));
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

    
    icoMesh = new THREE.Mesh(new THREE.IcosahedronGeometry(50, 1), icomat = new THREE.MeshPhongMaterial({
        color: 0xe73445,
        shading: THREE.FlatShading,
        emmissive: 0xe73445,
        shininess: 100
    }));
    icoMesh.position.set(50, 0, -200);
    icoMesh.receiveShadow = true;
    icoMesh.castShadow = true;
    icoMesh.geometry.computeBoundingSphere();
    icoBound = new THREE.Sphere(icoMesh.position, icoMesh.geometry.boundingSphere.radius);
    scene.add(icoMesh);
}

function createParticles() {
    starGeo = new THREE.Geometry();
    for (var i = 0; i < 10000; i++) {
        var star = new THREE.Vector3();
        star.x = THREE.Math.randFloatSpread(2000);
        star.y = THREE.Math.randFloatSpread(2000);
        star.z = THREE.Math.randFloatSpread(2000);

        starGeo.vertices.push(star);

    }
    starMat = new THREE.PointsMaterial({ color: 0xfdfd96 });
    starField = new THREE.Points(starGeo, starMat);
    scene.add(starField);

    particleKnot = new THREE.Points(new THREE.TorusKnotGeometry(200, 50, 100), new THREE.PointsMaterial({ color: 0x9540E4 }));
    scene.add(particleKnot);
    
}