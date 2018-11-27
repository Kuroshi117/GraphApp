var camera, scene, renderer;
var geometry, material, mesh;
var ambientLight, pointLight, shadowMaterial;
var controls, playMesh;
var wingMesh, propellerMesh, tailMesh, propellerMesh;
var playBound, sphereBound;

var torusKnot, torusKnotBound;
var torusRing, torusRingBound;

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
        var cubemesh = new THREE.Mesh(new THREE.CubeGeometry(1, 1, 7), new THREE.MeshBasicMaterial({ color: 0x0000ff }));
        playBound = new THREE.Box3(new THREE.Vector3(), new THREE.Vector3());
        playMesh.receiveShadow = true;
        scene.add(playMesh);
    });*/

    createAirPlane();
    addObjects();

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
        shading: THREE.SmoothShading,//change to SmoothShading
        metalness: 0,
        roughness: 0.0,
        side: THREE.BackSide
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
    torusRing.rotation.y += 0.01;

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
        torusRing.material.wireframe = true;
    }
    else {
        torusRing.material.wireframe = false;
    }
}

function addObjects(){
    torusKnot = new THREE.Mesh(new THREE.TorusKnotGeometry(100, 25, 100), new THREE.MeshNormalMaterial({}));
    torusKnot.position.set(0, 0, -200);
    torusKnot.geometry.computeBoundingBox();
    torusKnotBound = new THREE.Box3(new THREE.Vector3(), new THREE.Vector3());
    scene.add(torusKnot);

    torusRing = new THREE.Mesh(new THREE.TorusGeometry(60, 20, 50, 50), new THREE.MeshStandardMaterial({
        color: 0x8e6c,
        shading: THREE.SmoothShading
    }));
    torusRing.position.set(0, -200, 200);
    torusRing.receiveShadow = true;
    torusRing.geometry.computeBoundingBox();
    torusRingBound = new THREE.Box3(new THREE.Vector3(), new THREE.Vector3());
    scene.add(torusRing);
}

function createAirPlane() {
    playMesh = new THREE.Mesh(new THREE.CubeGeometry(2, 2, 8, 1, 1, 1), new THREE.MeshBasicMaterial({ color: 0xff0000, shading: THREE.FlatShading }));
    playMesh.position.set(0, 0, 0);

    wingMesh = new THREE.Mesh(new THREE.CubeGeometry(16, 0.5, 3, 1, 1, 1), new THREE.MeshBasicMaterial({ color: 0xff0000, shading: THREE.FlatShading }));
    wingMesh.position.z = -2;
    wingMesh.position.y = 0.2;
    wingMesh.receiveShadow = true;
    playMesh.add(wingMesh);

    engineMesh = new THREE.Mesh(new THREE.CubeGeometry(2, 2, 1, 1, 1, 1), new THREE.MeshBasicMaterial({ color: 0xffffff, shading: THREE.FlatShading }));
    engineMesh.position.z = -4.5;
    engineMesh.receiveShadow = true;
    playMesh.add(engineMesh);

    propellerMesh = new THREE.Mesh(new THREE.CubeGeometry(6, 0.80, 0.2, 1, 1, 1), new THREE.MeshBasicMaterial({ color: 0x00000, shading: THREE.FlatShading }));
    propellerMesh.position.z = -5.2;
    propellerMesh.receiveShadow = true;
    playMesh.add(propellerMesh);

    flipperMesh = new THREE.Mesh(new THREE.CubeGeometry(6, 0.5, 1.5, 1, 1, 1), new THREE.MeshBasicMaterial({ color: 0xff0000, shading: THREE.FlatShading }));
    flipperMesh.position.z = 3;
    flipperMesh.position.y = 0.2;
    flipperMesh.receiveShadow = true;
    playMesh.add(flipperMesh);

    tailMesh = new THREE.Mesh(new THREE.CubeGeometry(0.5, 3, 1.5, 1, 1, 1), new THREE.MeshBasicMaterial({ color: 0xff0000, shading: THREE.FlatShading }));
    tailMesh.position.z = 3;
    tailMesh.position.y = 1;
    tailMesh.receiveShadow = true;
    playMesh.add(tailMesh);

    playMesh.add(camera);
    playBound = new THREE.Box3(new THREE.Vector3(), new THREE.Vector3());
    playMesh.receiveShadow = true;
    scene.add(playMesh);
}

