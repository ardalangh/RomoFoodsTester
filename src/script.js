import './style.css';
import * as THREE from 'three';
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls.js';
import gsap from 'gsap';
import * as dat from 'lil-gui';
import {GLTFLoader} from 'three/examples/jsm/loaders/GLTFLoader';


/**
 * Base
 */
const parameters = {
	directionalLightColor1: 0x404040,
	directionalLightIntensity1: 1,

	directionalLightColor2: 0x404040,
	directionalLightIntensity2: 1,

	directionalLightColor3: 0x404040,
	directionalLightIntensity3: 1,

	ambientLightColor: 0x404040,
	ambientLightIntensity: 3,

	directionalLight1PosX: 0,
	directionalLight1AngleX: 0,
	directionalLight1AngleY: 0,
	directionalLight1AngleZ: 0,
	directionalLight1PosY: 0,
	directionalLight1PosZ: 0,

	directionalLight2PosX: 0,
	directionalLight2PosY: 0,
	directionalLight2PosZ: 0,
	directionalLight2AngleX: 0,
	directionalLight2AngleY: 0,
	directionalLight2AngleZ: 0,

	jarPosX: 0,
	jarPosY: 0,
	jarPosZ: 0,

	// directionalLight2PosY : 0,
	// directionalLight3PosZ : 0,

	cameraPositionX: 0,
	cameraPositionY: 1,
	cameraPositionZ: 3,

	// spin: () =>
	// {
	//     gsap.to(mesh.rotation, 1, { y: mesh.rotation.y + Math.PI * 2 })
	// }
};

// Canvas
const canvas = document.querySelector('canvas.webgl');

// Scene
const scene = new THREE.Scene();

/**
 * Object
 */
const loader = new GLTFLoader();
let jar;
loader.load('./jar.glb', function (gltf) {
	jar = gltf.scene;
	jar.scale.set(12, 12, 12);
	scene.add(jar);

});

/**
 * Lights
 */


const directionalLight1 = new THREE.DirectionalLight(parameters.directionalLightColor1, 2);
const helper1 = new THREE.DirectionalLightHelper(directionalLight1, 1);
directionalLight1.position.set(parameters.directionalLight1PosX, parameters.directionalLight1PosY, parameters.directionalLight1PosZ);
directionalLight1.rotation.set(parameters.directionalLight1AngleX, parameters.directionalLight1AngleY, parameters.directionalLight1AngleZ);
scene.add(directionalLight1, helper1);

const directionalLight2 = new THREE.DirectionalLight(parameters.directionalLightColor2, 2);
directionalLight2.position.set(parameters.directionalLight2PosX, parameters.directionalLight2PosY, parameters.directionalLight2PosZ);
directionalLight2.rotation.set(parameters.directionalLight2AngleX, parameters.directionalLight2AngleY, parameters.directionalLight2AngleZ);

const helper2 = new THREE.DirectionalLightHelper(directionalLight2, 1);
scene.add(directionalLight2, helper2);

// const directionalLight3 = new THREE.DirectionalLight( parameters.directionalLightColor3, 2 );
// directionalLight3.position.set(1,1,parameters.directionalLight3PosZ)
// scene.add( directionalLight3 );

// const light = new THREE.AmbientLight( parameters.ambientLightColor, 4 ); // soft white light
// scene.add( light );

const light = new THREE.AmbientLight(parameters.ambientLightColor, parameters.ambientLightIntensity); // soft white light
scene.add(light);

/**
 * Sizes
 */
const sizes = {
	width: window.innerWidth,
	height: window.innerHeight,
};

window.addEventListener('resize', () => {
	// Update sizes
	sizes.width = window.innerWidth;
	sizes.height = window.innerHeight;

	// Update camera
	camera.aspect = sizes.width / sizes.height;
	camera.updateProjectionMatrix();

	// Update renderer
	renderer.setSize(sizes.width, sizes.height);
	renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100);
camera.position.set(parameters.cameraPositionX, parameters.cameraPositionY, parameters.cameraPositionZ);
scene.add(camera);

// Controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
	canvas: canvas,
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

/**
 * Debug
 */
const gui = new dat.GUI({
	// closed: true,
	width: 400,
});
// gui.hide()
// gui.add(mesh.position, 'y').min(- 3).max(3).step(0.01).name('elevation')
// gui.add(mesh, 'visible')
// gui.add(material, 'wireframe')

window.addEventListener('keydown', (event) => {
	if (event.key === 'h') {
		if (gui._hidden)
			gui.show();
		else
			gui.hide();
	}
});

const Jar = gui.addFolder('Jar');
Jar
	.add(parameters, 'jarPosX', -5, 5, 0.01)
	.onChange(() => {
		jar.position.x = parameters.jarPosX;

	});

Jar
	.add(parameters, 'jarPosZ', -5, 5, 0.01)
	.onChange(() => {
		jar.position.z = parameters.jarPosZ;

	});

Jar
	.add(parameters, 'jarPosY', -5, 5, 0.01)
	.onChange(() => {
		jar.position.y = parameters.jarPosY;

	});

////////////////////////////Directional Light 1/////////////////////////////////////////
const DirectionalLight1 = gui.addFolder('DirectionalLight 1 ');

DirectionalLight1
	.add(parameters, 'directionalLight1AngleX', 0, Math.PI * 2, Math.PI * 2/ 360).onChange(() => {
		directionalLight1.rotation.x = parameters.directionalLight1AngleX;
	});

DirectionalLight1
	.add(parameters, 'directionalLight1AngleZ', 0, Math.PI * 2, Math.PI * 2/ 360).onChange(() => {
	directionalLight1.rotation.z = parameters.directionalLight1AngleZ;
});

DirectionalLight1
	.add(parameters, 'directionalLight1AngleY', 0, Math.PI * 2, Math.PI * 2/ 360).onChange(() => {
	directionalLight1.rotation.y = parameters.directionalLight1AngleY;
});

DirectionalLight1
	.addColor(parameters, 'directionalLightColor1')
	.onChange(() => {
		directionalLight1.color = new THREE.Color(parameters.directionalLightColor1);

	});

DirectionalLight1
	.add(parameters, 'directionalLightIntensity1', 0, 15, 0.01)
	.onChange(() => {
		directionalLight1.intensity = parameters.directionalLightIntensity1;
	});

DirectionalLight1
	.add(parameters, 'directionalLight1PosX', -5, 5, 0.01)
	.onChange(() => {
		directionalLight1.position.set(parameters.directionalLight1PosX, parameters.directionalLight1PosY, parameters.directionalLight1PosZ);
	});
DirectionalLight1
	.add(parameters, 'directionalLight1PosY', -5, 5, 0.01)
	.onChange(() => {
		directionalLight1.position.set(parameters.directionalLight1PosX, parameters.directionalLight1PosY, parameters.directionalLight1PosZ);
	});
DirectionalLight1
	.add(parameters, 'directionalLight1PosZ', -5, 5, 0.01)
	.onChange(() => {
		directionalLight1.position.set(parameters.directionalLight1PosX, parameters.directionalLight1PosY, parameters.directionalLight1PosZ);
	});

/////////////////////////////////DirectionalnLight 2/////////////////////////////////////////

const DirectionalLight2 = gui.addFolder('DirectionalLight 2 ');
DirectionalLight2.add(parameters, 'directionalLight1AngleX', 0, Math.PI * 2, Math.PI * 2/ 360).onChange(() => {
	directionalLight1.rotation.x = parameters.directionalLight1AngleX;
});

DirectionalLight2
	.add(parameters, 'directionalLight1AngleZ', 0, Math.PI * 2, Math.PI * 2/ 360).onChange(() => {
	directionalLight1.rotation.z = parameters.directionalLight1AngleZ;
});

DirectionalLight2
	.add(parameters, 'directionalLight1AngleY', 0, Math.PI * 2, Math.PI * 2/ 360).onChange(() => {
	directionalLight1.rotation.y = parameters.directionalLight1AngleY;
});



DirectionalLight2
	.addColor(parameters, 'directionalLightColor1')
	.onChange(() => {
		directionalLight2.color = new THREE.Color(parameters.directionalLightColor2);

	});

DirectionalLight2
	.add(parameters, 'directionalLightIntensity2', 0, 15, 0.01)
	.onChange(() => {
		directionalLight2.intensity = parameters.directionalLightIntensity2;
	});

DirectionalLight2
	.add(parameters, 'directionalLight2PosX', -5, 5, 0.01)
	.onChange(() => {
		directionalLight2.position.set(parameters.directionalLight2PosX, parameters.directionalLight2PosY, parameters.directionalLight2PosZ);
	});
DirectionalLight2
	.add(parameters, 'directionalLight2PosY', -5, 5, 0.01)
	.onChange(() => {
		directionalLight2.position.set(parameters.directionalLight2PosX, parameters.directionalLight2PosY, parameters.directionalLight2PosZ);
	});
DirectionalLight2
	.add(parameters, 'directionalLight2PosZ', -5, 5, 0.01)
	.onChange(() => {
		directionalLight2.position.set(parameters.directionalLight2PosX, parameters.directionalLight2PosY, parameters.directionalLight2PosZ);
	});

/////////////////////////////////Directional Light 3/////////////////////////////////////////

// const DirectionalLight3 = gui.addFolder("Directional Light 3 (Z)")
// DirectionalLight3
//     .addColor(parameters, 'directionalLightColor3')
//     .onChange(() =>
//     {
//         directionalLight2.color = new THREE.Color(parameters.directionalLightColor3)
//
//
//     })
//
// DirectionalLight3
//     .add(parameters, 'directionalLightIntensity3')
//     .onChange(() => {
//         directionalLight3.intensity = parameters.directionalLightIntensity3
//     })
//
// DirectionalLight3
//     .add(parameters, 'directionalLight3PosZ')
//     .onChange(() => {
//         directionalLight1.position.set(1, 1, parameters.directionalLight3PosZ)
//     })

////////////////////////////////Ambient Light///////////////////////////////////
const ambientLight = gui.addFolder('Ambient Light');
ambientLight
	.addColor(parameters, 'ambientLightColor')
	.onChange(() => {
		light.color = new THREE.Color(parameters.ambientLightColor);

	});

ambientLight
	.add(parameters, 'ambientLightIntensity', 0, 15, 0.01)
	.onChange(() => {
		light.intensity = parameters.ambientLightIntensity;
	});

//////////////////////////////////// Camera ////////////////////////////////////////
const cameraAngle = gui.addFolder('Camera Angle');
cameraAngle
	.add(parameters, 'cameraPositionX', -5, 5, 0.01)
	.onChange(() => {
		camera.position.x = parameters.cameraPositionX;
	});

cameraAngle
	.add(parameters, 'cameraPositionY', -5, 5, 0.01)
	.onChange(() => {
		camera.position.y = parameters.cameraPositionY;
	});

cameraAngle
	.add(parameters, 'cameraPositionZ', -5, 5, 0.01)
	.onChange(() => {
		camera.position.z = parameters.cameraPositionZ;
	});

////////////////////////////////////////////////////////////////////////////////////
// gui
//     .add(parameters, 'directionalLightPosX')
//     .onChange(() => {
//         directionalLight.position = (parameters.directionalLightPosX)
//     })
// gui.add(options, "LightPositionX", -10, 10, 0.01).onChange((val) => {
//     parameters.directionalLightPosX = val;
// });

// gui.add(parameters, 'spin')

/**
 * Animate
 */
const clock = new THREE.Clock();

const tick = () => {
	const elapsedTime = clock.getElapsedTime();

	// Update controls
	controls.update();

	// Render
	renderer.render(scene, camera);

	// Call tick again on the next frame
	window.requestAnimationFrame(tick);
};

tick();