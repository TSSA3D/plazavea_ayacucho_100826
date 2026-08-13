import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { DRACOLoader } from "three/addons/loaders/DRACOLoader.js";

// ----------------------
// Escena
// ----------------------

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x202020);

// ----------------------
// Cámara
// ----------------------

const camera = new THREE.PerspectiveCamera(
45,
window.innerWidth/window.innerHeight,
0.1,
5000
);

camera.position.set(4,3,6);

// ----------------------
// Render
// ----------------------

const renderer = new THREE.WebGLRenderer({

antialias:true,

powerPreference:"high-performance"

});

renderer.setSize(window.innerWidth,window.innerHeight);

renderer.setPixelRatio(
Math.min(window.devicePixelRatio,2)
);

document.body.appendChild(renderer.domElement);

// ----------------------
// Controles
// ----------------------

const controls = new OrbitControls(camera,renderer.domElement);

controls.enableDamping = true;
controls.dampingFactor = 0.05;

controls.target.set(0,0,0);

controls.minDistance = 20;
controls.maxDistance = 400;
controls.maxPolarAngle = Math.PI / 2;

// ----------------------
// Luces
// ----------------------

const ambient=new THREE.AmbientLight(0xffffff,2);

scene.add(ambient);

const directional=new THREE.DirectionalLight(0xffffff,4);

directional.position.set(10,10,10);

scene.add(directional);

/// ----------------------
// Cubo de prueba
// ----------------------

const dracoLoader = new DRACOLoader();

dracoLoader.setDecoderPath(
'https://www.gstatic.com/draco/versioned/decoders/1.5.7/'
);

const loader = new GLTFLoader();

loader.setDRACOLoader(dracoLoader);

loader.load(

'modelo/plazavea_ayacucho_100826.glb',

function(gltf){

const modelo = gltf.scene;

scene.add(modelo);

const box = new THREE.Box3().setFromObject(modelo);

const center = box.getCenter(new THREE.Vector3());

const size = box.getSize(new THREE.Vector3());

modelo.position.sub(center);

const maxDim = Math.max(size.x,size.y,size.z);

const distancia = maxDim * 1.0;

camera.position.set(
    distancia,
    distancia * 0.8,
    distancia
);

camera.near = 0.1;
camera.far = maxDim * 50;

camera.updateProjectionMatrix();

controls.target.set(0,0,0);

controls.update();

},

undefined,

function(error){

console.error(error);

}

);

// ----------------------
// Red de referencia
// ----------------------

const grid=new THREE.GridHelper(

10,

10,

0xffffff,

0x666666

);

grid.position.y = -1;   // Baja la grilla

scene.add(grid);

// ----------------------
// Ejes XYZ
// ----------------------

const axes=new THREE.AxesHelper(3);

axes.position.y = -1;   // Baja los ejes la misma cantidad

scene.add(axes);

// ----------------------
// Resize
// ----------------------

window.addEventListener("resize",()=>{

camera.aspect=window.innerWidth/window.innerHeight;

camera.updateProjectionMatrix();

renderer.setSize(window.innerWidth,window.innerHeight);

});

// ----------------------
// Animación
// ----------------------

function animate(){

    requestAnimationFrame(animate);

    controls.update();

    renderer.render(scene,camera);

}

animate();
