//ref https://www.august.com.au/blog/animating-scenes-with-webgl-three-js/
var camera, scene, renderer;
var geometry, material, mesh;
var ambientLight, pointLight, shadowMaterial;
var controls, playMesh;
var playBound, sphereBound; 


var clock = new THREE.Clock();



init();
animate();

function init() {

    camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.01, 1000);
    camera.position.set(0, 5, 20);

    playMesh = new THREE.Mesh(new THREE.CubeGeometry(5, 5, 5, 1, 1, 1), new THREE.MeshBasicMaterial({ color: 0xff0000 }));//dummy mesh
    playMesh.position.set(0, 0, 0);
    playMesh.add(camera);
    playBound = new THREE.Box3(playMesh.geometry.min, playMesh.geometry.max);

    scene = new THREE.Scene();

    scene.add(playMesh);

    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    document.body.appendChild(renderer.domElement);

    ambientLight = new THREE.AmbientLight(0xffffff, 0.2);
    scene.add(ambientLight);

    pointLight = new THREE.PointLight(0xffffff, 1);
    pointLight.position.set(25, 50, 25);
    pointLight.castShadow = true;
    pointLight.shadow.mapSize.width = 1024;
    pointLight.shadow.mapSize.height = 1024;
    scene.add(pointLight);

    shadowMaterial = new THREE.ShadowMaterial({ color:0xbbbbbb });
    shadowMaterial.opacity = 0.5;

    geometry = new THREE.SphereGeometry(400, 32, 32);
    material = new THREE.MeshStandardMaterial({
        color: 0xe56baf8,
        shading: THREE.FlatShading,//change to SmoothShading
        metalness: 0,
        roughness: 0.0,
        side: THREE.BackSide
    });
    mesh = new THREE.Mesh(geometry, material);
    mesh.receiveShadow = true;
    sphereBound = new THREE.Sphere(mesh.position, mesh.geometry.radius);

    scene.add(mesh);

    controls = new THREE.FlyControls(playMesh);
    controls.movementSpeed = 2;
    controls.domElement = renderer.domElement;
    controls.rollSpeed = Math.PI / 150;
    controls.autoForward = false;
    controls.dragToLook = false;
    update();
}

function update() {
    controls.update(1);
    setTimeout(update, 16);
    draw();

    //keep player in sphere
    
}
function draw() {
    renderer.render(scene, camera);
}

function animate() {

    requestAnimationFrame(animate);
    renderer.render(scene, camera);
 

}


