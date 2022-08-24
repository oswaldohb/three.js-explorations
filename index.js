import {
    BoxGeometry,
    Mesh,
    MeshBasicMaterial,
    PerspectiveCamera,
    Scene,
    Vector2,
    WebGLRenderer,
	Vector3,
	Vector4,
	Quaternion,
	Matrix4,
	Spherical,
	Box3,
	Sphere,
	Raycaster,
	MathUtils,
    Clock,
    MeshLambertMaterial,
    DirectionalLight,
    MeshPhongMaterial,
    TextureLoader,
    AmbientLight,
    SphereGeometry,
    AxesHelper,
    GridHelper,
    EdgesGeometry,
    LineBasicMaterial,
    LineSegments
} from 'three';


import CameraControls from 'camera-controls';

import GUI from "three/examples/jsm/libs/lil-gui.module.min.js";
import gsap from 'gsap';

import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

import {CSS2DRenderer, CSS2DObject} from 'three/examples/jsm/renderers/CSS2DRenderer.js';

// import Stats from 'stats.js/src/Stats';

const canvas = document.getElementById('three-canvas');


// 1 the Scene
const scene = new Scene();

const axes = new AxesHelper();
axes.material.depthTest = false;
axes.renderOrder = 2;
scene.add(axes);

const grid = new GridHelper();
grid.renderOrder = 1;
scene.add(grid);

// 2 the object

// const label = document.createElement('h1');
// label.textContent = "Hello world";
// label.classList.add('red');
// const labelObject = new CSS2DObject(label);
// scene.add(labelObject);


// const material = new MeshLambertMaterial({color: 'orange'});
// const geometry = new BoxGeometry();
// const cubeMesh = new Mesh(geometry, material)
// scene.add(cubeMesh);

const loader = new GLTFLoader();

const LoadingScreen = document.getElementById('loader-container');
const progressText = document.getElementById('progress-text');
let policeStation;

loader.load('./police_station.glb',

(gltf) => {
    policeStation = gltf.scene;
    scene.add(policeStation);
    LoadingScreen.classList.add('hidden');
},

(progress) => {
    const progressPercent = progress.loaded / progress.total *100;
    const formated = Math.trunc(progressPercent);
    progressText.textContent = `Loading: ${formated}%`;
},

(error) => {
    console.log(error);
});

// 3 The camera

const camera = new PerspectiveCamera(75, canvas.clientWidth / canvas.clientHeight);
camera.position.z = 5;
camera.position.x = 6;
camera.position.y = 4;
camera.lookAt(axes.position);
scene.add(camera);


// 4 the render

const renderer = new WebGLRenderer({canvas});
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2)); 
renderer.setSize(canvas.clientWidth, canvas.clientHeight, false);
renderer.setClearColor('gray', 1);

const LabelRenderer = new CSS2DRenderer();
LabelRenderer.setSize(canvas.clientWidth, canvas.clientHeight);
LabelRenderer.domElement.style.position = 'absolute';
LabelRenderer.domElement.style.pointerEvents = 'none';
LabelRenderer.domElement.style.top = '0';
document.body.appendChild(LabelRenderer.domElement);

// 5 lights

const light1 = new DirectionalLight();
light1.position.set(3, 2, 1).normalize();
scene.add(light1);

const ambientLight = new AmbientLight('white', 0.3);
scene.add(ambientLight);

// 6 responsivity

window.addEventListener('resize', () => {
    camera.aspect = canvas.clientWidth / canvas.clientHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(canvas.clientWidth, canvas.clientHeight, false);
    LabelRenderer.setSize(canvas.clientWidth, canvas.clientHeight);
});

// 7 Controls

const subsetOfTHREE = {
	Vector2   : Vector2,
	Vector3   : Vector3,
	Vector4   : Vector4,
	Quaternion: Quaternion,
	Matrix4   : Matrix4,
	Spherical : Spherical,
	Box3      : Box3,
	Sphere    : Sphere,
	Raycaster : Raycaster,
	MathUtils : {
		DEG2RAD: MathUtils.DEG2RAD,
		clamp: MathUtils.clamp,
	},
};


CameraControls.install( { THREE: subsetOfTHREE } );
const clock = new Clock();
const cameraControls = new CameraControls(camera, canvas);
cameraControls.dollyToCursor = true;

cameraControls.setLookAt(18, 20, 18, 0, 10, 0);

// 8 picking

const raycaster = new Raycaster();
const mouse = new Vector2();

window.addEventListener('dblclick', (event) => {
 mouse.x = event.clientX / canvas.clientWidth * 2 - 1;
 mouse.y = - (event.clientY / canvas.clientHeight) * 2 + 1;

 raycaster.setFromCamera(mouse, camera);
 const intersects = raycaster.intersectObject(policeStation);

 if(!intersects.length) return;

 const collisionLocation = intersects[0].point;

 const message = window.prompt('Descrite the issue:');

 const container = document.createElement('div');
 container.className = 'label-container';

 const deleteButton = document.createElement('button');
 deleteButton.textContent = 'X';
 deleteButton.className = 'delete-button hidden';
 container.appendChild(deleteButton);

 const label = document.createElement('p');
 label.textContent = message;
 label.classList.add('label');
 container.appendChild(label);

 const labelObject = new CSS2DObject(container);
 labelObject.position.copy(collisionLocation);
 scene.add(labelObject);

 deleteButton.onclick = () => {
    labelObject.removeFromParent();
    labelObject.element = null
    container.remove();
 }

 container.onmouseenter = () => deleteButton.classList.remove('hidden');
 container.onmouseleave = () => deleteButton.classList.add('hidden');

} )

// const raycaster = new Raycaster();
// const mouse = new Vector2();
// const previousSelection = {
//     geometry: null,
//     material: null
// }

// const highlightMat = new MeshBasicMaterial({color: 'red'})

// window.addEventListener('dblclick', (event) => {
//     mouse.x = event.clientX / canvas.clientWidth * 2 - 1;
// 	mouse.y = - (event.clientY / canvas.clientHeight) * 2 + 1;

//     raycaster.setFromCamera(mouse, camera);
//     const intersection = raycaster.intersectObject(cubeMesh);

//     const hasCollided = intersection.length !== 0;

//     if(!hasCollided) {
//         if (previousSelection.mesh) {
//         previousSelection.mesh.material = previousSelection.material;  
//         previousSelection.mesh = null;
//         previousSelection.material = null;
//         }
//         return;
//     };
        
        
//     const first = intersection[0]
//     const isPreviousSelection = previousSelection.mesh == first.object;

//     if(isPreviousSelection) return;

//     if (previousSelection.mesh) {
//         previousSelection.mesh.material = previousSelection.material;  
//         previousSelection.mesh = null;
//         previousSelection.material = null;
//         }

//         previousSelection.mesh = cubeMesh;
//         previousSelection.material = cubeMesh.material; 
        
//         cubeMesh.material = highlightMat;
//     })

// 9 animation
// const stats = new Stats();
// stats.showPanel(1);
// document.body.appendChild(stats.dom);

function animate() {

    // stats.begin();

    const delta = clock.getDelta();
    cameraControls.update(delta);

    renderer.render(scene, camera);
    LabelRenderer.render(scene, camera);

    // stats.end();

    requestAnimationFrame(animate);
}

animate();

// 10 Debugging

// const gui = new GUI();

// const min = -3;
// const max = 3;
// const step = 0.01;

// const transformationFolder = gui.addFolder('transformation');

// transformationFolder.add(box.position, 'y', min, max, step).name("Position Y");
// transformationFolder.add(box.position, 'x', min, max, step).name("Position X");
// transformationFolder.add(box.position, 'z', min, max, step).name("Position Z");

// gui.addFolder('Visibility').add(box, 'visible');

// const colorParam = {
//     value: 'white'
// }

// gui.addColor(colorParam, 'value').name("Color").onChange(() => {
//     box.material.color.set(colorParam.value);
// })

// const functionParam = {
//     spin: () => {
//       gsap.to(box.rotation, { y: box.rotation.y + 10, duration: 1 } )
//     }
// }

// gui.add(functionParam, 'spin');