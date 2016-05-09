import THREE from 'three';
import OrbitControls from './OrbitControls';
import VideoTexture from './video_texture';
import Floor from './floor';
import SC from 'soundcloud';

OrbitControls(THREE);

const AMOUNT = 100;
let container;
let camera;
let renderer;
let scene;
let floor;
let controls;
let audioPlayer;
let playing = false;

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

  alex_video = VideoTexture('alex-video', 1000);
  jaq_video = VideoTexture('jaq-video', 2500);

  jaq_video.rotate(0, -Math.PI, 0);
  jaq_video.position(0, 0, 2);

  scene.add(alex_video.videoObject);
  scene.add(jaq_video.videoObject);

  SC.initialize({
    client_id: '9debd6785a41ff5950a3d6b1abad583f'
  })

  SC.stream('/tracks/245260659', 's-swNZq')
    .then((player) => {
      audioPlayer = player;
    });

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

  //document.addEventListener('mousemove', onDocumentMouseMove, false);
  window.addEventListener('resize', onWindowResize, false);
  document.body.addEventListener('click', onClick, false);
}

function onWindowResize() {

  windowHalfX = window.innerWidth / 2;
  windowHalfY = window.innerHeight / 2;

  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();

  renderer.setSize( window.innerWidth, window.innerHeight );

}

function onClick() {
  if (!playing) {
    audioPlayer.play();
    alex_video.play();
    jaq_video.play();
    playing = true;
  }
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
