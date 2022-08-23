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

import Stats from 'stats.js/src/Stats';

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

const material = new MeshLambertMaterial({color: 'orange'});
const geometry = new BoxGeometry();
const cubeMesh = new Mesh(geometry, material)
scene.add(cubeMesh);

// const loader = new GLTFLoader();

// const LoadingScreen = document.getElementById('loader-container');
// const progressText = document.getElementById('progress-text');

// loader.load('./police_station.glb',

// (gltf) => {
//     scene.add(gltf.scene);
//     LoadingScreen.classList.add('hidden');
// },

// (progress) => {
//     console.log(progress);
//     const progressPercent = progress.loaded / progress.total *100;
//     const formated = Math.trunc(progressPercent);
//     progressText.textContent = `Loading: ${formated}%`;
// },

// (error) => {
//     console.log(error);
// });

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

cameraControls.setLookAt(3, 4, 2, 0, 0, 0)

// 8 picking

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
const stats = new Stats();
stats.showPanel(1);
document.body.appendChild(stats.dom);

function animate() {

    stats.begin();

    const delta = clock.getDelta();
    cameraControls.update(delta);

    renderer.render(scene, camera)

    stats.end();

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