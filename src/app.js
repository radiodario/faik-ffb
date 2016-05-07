import THREE from 'three';
import OrbitControls from './OrbitControls';
import VideoTexture from './video_texture';
import Floor from './floor';

OrbitControls(THREE);

const AMOUNT = 100;
let container;
let camera;
let renderer;
let scene;
let floor;
let controls;

let alex_video;
let jaq_video;

let mouseX = 0;
let mouseY = 0;

let windowHalfX = window.innerWidth / 2;
let windowHalfY = window.innerHeight / 2;

function init() {
  container = document.createElement('div');
  document.body.appendChild(container);

  camera = new THREE.PerspectiveCamera(45, window.innerWidth/window.innerHeight,
  1, 10000);

  camera.position.z = 2000;

  scene = new THREE.Scene();
  scene.fog = new THREE.FogExp2( 0xfcccfc, 0.0002);

  alex_video = VideoTexture('alex-video');
  jaq_video = VideoTexture('jaq-video');

  alex_video.rotate(0, -Math.PI, 0);
  alex_video.position(0, 0, 2);

  scene.add(alex_video.mesh);
  scene.add(jaq_video.mesh);
  scene.add(alex_video.reflectionMesh);
  scene.add(jaq_video.reflectionMesh);


  floor = Floor(scene);

  renderer = new THREE.WebGLRenderer(); // why not webgl??
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setClearColor(scene.fog.color);
  renderer.setPixelRatio(window.devicePixelRatio);

  container.appendChild(renderer.domElement);

  controls = new THREE.OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.dampingFactor = 0.25;
  controls.enableZoom = true;

  alex_video.play();
  jaq_video.play();
  //document.addEventListener('mousemove', onDocumentMouseMove, false);
  window.addEventListener('resize', onWindowResize, false);

}

function onWindowResize() {

  windowHalfX = window.innerWidth / 2;
  windowHalfY = window.innerHeight / 2;

  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();

  renderer.setSize( window.innerWidth, window.innerHeight );

}

function onDocumentMouseMove( event ) {

  mouseX = ( event.clientX - windowHalfX );
  mouseY = ( event.clientY - windowHalfY ) * 0.2;

}

function render() {

  alex_video.update();
  jaq_video.update();

  renderer.render( scene, camera );
}

function animate() {

  requestAnimationFrame( animate );
  controls.update();
  render();
  //stats.update();

}

init();
animate();
