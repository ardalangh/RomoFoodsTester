import './style.css';
import * as THREE from 'three';
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls.js';
import {GLTFLoader} from 'three/examples/jsm/loaders/GLTFLoader';
import ProgressBar from 'progressbar.js';


function traverseMaterials(object, callback) {
	object.traverse((node) => {
		if (!node.isMesh) return;
		const materials = Array.isArray(node.material)
			? node.material
			: [node.material];
		materials.forEach(callback);
	});
}

function updateTextureEncoding(content) {
	const encoding = THREE.sRGBEncoding;

	traverseMaterials(content, (material) => {
		if (material.map) material.map.encoding = encoding;
		if (material.emissiveMap) material.emissiveMap.encoding = encoding;
		if (material.map || material.emissiveMap) material.needsUpdate = true;
	});
}



const MAP_NAMES = [
	'map',
	'aoMap',
	'emissiveMap',
	'glossinessMap',
	'metalnessMap',
	'normalMap',
	'roughnessMap',
	'specularMap',
];

// const IS_IOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;

var bar = new ProgressBar.Circle(progressDiv, {
	color: '#aaa',
	// This has to be the same size as the maximum width to
	// prevent clipping
	strokeWidth: 4,
	trailWidth: 1,
	easing: 'easeInOut',
	duration: 1400,
	text: {
		autoStyleContainer: false
	},
	from: { color: '#aaa', width: 1 },
	to: { color: '#333', width: 4 },
	// Set default step function for all animate calls
	step: function(state, circle) {
		circle.path.setAttribute('stroke', state.color);
		circle.path.setAttribute('stroke-width', state.width);

		var value = Math.round(circle.value() * 100);
		if (value === 0) {
			circle.setText('');
		} else {
			circle.setText(value);
		}
		if (value === 100) {
			document.getElementById('progressDiv').style.display =  'none'
		}


	}
});
bar.text.style.fontFamily = '"Raleway", Helvetica, sans-serif';
bar.text.style.fontSize = '1rem';
// Number from 0.0 to 1.0

let scene, camera, renderer, controls, light, jar, mixer;

function init() {
	camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 1, 5000);
	camera.position.set(0, 2.5, 2.5);

	scene = new THREE.Scene();

	// scene.background = new THREE.Color(0xA3907D)

	const path = './env/';
	const format = '.jpeg';

	const cubeMapURLs = [
		path + 'posx' + format, path + 'negx' + format,
		path + 'posy' + format, path + 'negy' + format,
		path + 'posz' + format, path + 'negz' + format,
	];

	const envMap = new THREE.CubeTextureLoader().load(cubeMapURLs);
	envMap.format = THREE.RGBAFormat;

	renderer = new THREE.WebGLRenderer({antialias: true, alpha: true});
	renderer.physicallyCorrectLights = true;

	renderer.outputEncoding = THREE.sRGBEncoding;
	renderer.setClearColor(0x000000, 0);
	renderer.setPixelRatio(window.devicePixelRatio);
	renderer.setSize(window.innerWidth, window.innerHeight);

	document.body.appendChild(renderer.domElement);

	controls = new OrbitControls(camera, renderer.domElement);

	const ambient =  new THREE.AmbientLight(0xffffff, 2)

	camera.add(ambient);
	ambient.exposure = 0.8;
	scene.add(ambient);

	light = new THREE.DirectionalLight(0xffffff, 2)
	light.position.set(0.5, 0, 0.866);
	light.exposure = 0.8;
	camera.add(light)

	scene.add(light);






	const gltfLoader = new GLTFLoader();

	gltfLoader.load('./jar.glb', function (gltf) {
			jar = gltf.scene;

			mixer = new THREE.AnimationMixer( gltf.scene );


			gltf.animations.forEach( ( clip ) => {

				mixer.clipAction( clip ).play();

			} );



			jar.roughness = .2;
			jar.position.set(0, -0.5, 0);
			jar.scale.set(20, 20, 20);
			updateTextureEncoding(jar);

			traverseMaterials(jar, (material) => {
				material.needsUpdate = true;

				// if (!IS_IOS) {
				// 	material.envMap = envMap;
				// }

				MAP_NAMES.forEach((map) => {

					if (material[map]) material[map].dispose();

				});

			});

			scene.add(gltf.scene);
		},
		// called while loading is progressing
		function (xhr) {

			bar.animate(xhr.loaded / 6355260);
			console.log((xhr.loaded) + '% loaded');
		},
		// called when loading has errors
		function (error) {
			console.log(error);
		},
	);

	animate();
}

function animate() {
	renderer.render(scene, camera);

	// console.log(progress);
	light.position.set(
		camera.position.x + 10,
		camera.position.y + 10,
		camera.position.z + 10,
	);


	if ( mixer ) mixer.update( 0.005 );

	requestAnimationFrame(animate);
}

init();
