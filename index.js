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
} from 'three';

import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import CameraControls from 'camera-controls';

const canvas = document.getElementById('three-canvas');

// 1 the Scene
const scene = new Scene();

// 2 the object
const geometry = new BoxGeometry(0.5, 0.5, 0.5);
const orangeMaterial = new MeshBasicMaterial({color: 'orange'});
const blueMaterial = new MeshBasicMaterial({color: 'blue'});

const orangeCube = new Mesh(geometry, orangeMaterial);
scene.add(orangeCube);


const bigBlueCube = new Mesh(geometry, blueMaterial);
bigBlueCube.position.x += 2;
bigBlueCube.scale.set(2, 2,2);
scene.add(bigBlueCube);


// 3 The camera

const camera = new PerspectiveCamera(75, canvas.clientWidth / canvas.clientHeight);
camera.position.z = 3;
scene.add(camera);


// 4 the render

const renderer = new WebGLRenderer({canvas});
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.setSize(canvas.clientWidth, canvas.clientHeight, false);

// 5 responsivity

window.addEventListener('resize', () => {
    camera.aspect = canvas.clientWidth / canvas.clientHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(canvas.clientWidth, canvas.clientHeight, false);
});

// 6 Controls

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

// 7 animation

function animate() {
    const delta = clock.getDelta();
    cameraControls.update(delta);

    renderer.render(scene, camera)
    requestAnimationFrame(animate);
}

animate();