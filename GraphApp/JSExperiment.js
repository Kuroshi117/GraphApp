﻿//ref https://www.august.com.au/blog/animating-scenes-with-webgl-three-js/
var camera, scene, renderer;
var geometry, material, mesh;
var ambientLight, pointLight, shadowMaterial;
var controls;
var clock = new THREE.Clock();

init();
animate();

function init() {

    camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.01, 1000);
    camera.position.set(0, 30, 50);
    camera.lookAt(new THREE.Vector3(0, 0, 0));

    scene = new THREE.Scene();

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
        shading: THREE.SmoothShading,
        metalness: 0,
        roughness: 0.0,
        side: THREE.BackSide
    });
    mesh = new THREE.Mesh(geometry, material);
    mesh.receiveShadow = true;
    scene.add(mesh);

    

    controls = new THREE.FlyControls(camera);
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
}
function draw() {
    renderer.render(scene, camera);
}

function animate() {

    requestAnimationFrame(animate);

    //mesh.rotation.x += 0.01;
    //mesh.rotation.y += 0.02;

    renderer.render(scene, camera);
 

}


