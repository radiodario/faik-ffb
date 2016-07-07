import THREE from 'three';
import OrbitControls from './OrbitControls';
import VideoTexture from './video_texture';
import Floor from './floor';
import SC from 'soundcloud';
import Column from './column';
import PeaceSign from './peacesign';
import Fly from 'three.fly';
import Fuccboi from './fuccboi';

let physijs = require('whitestormjs-physijs');
physijs.scripts.worker = '/src/physijs_worker.js';
physijs.scripts.ammo = '/src/ammo.js';


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
let uniforms = {
  time: { type: "f", value: 1.0 },
  resolution: { type: "v2", value: new THREE.Vector2() }
};

let column;
let peaceSigns = [];
let fuccbois = [];
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

  scene = new physijs.Scene({
    fixedTimeStep: 1/120
  });
  scene.setGravity(new THREE.Vector3( 0, -100, 0 ))
  scene.addEventListener('update', () => {
    scene.simulate(undefined, 0);
  })
  scene.fog = new THREE.FogExp2( 0xfcccfc, 0.0002);

  Column().then((obj) => {
    column = obj.columnObject;
    const startx = -4000;
    const startz = -4000;
    const separation = 2000;
    const cols = 5;
    for (var i = 0; i < 30; i++) {
      let c = column.clone();
      let x = i % cols;
      let z = Math.floor(i/cols);
      c.position.set(startx + x * separation, -100,  startz + z * separation);
      scene.add(c);
    }
  })

  PeaceSign(uniforms).then((obj) => {
    const startx = -4000;
    const startz = -4000;
    const separation = 2000;
    const cols = 5;
    obj.peaceSign.scale.set(200, 200, 200);
    for (var i = 0; i < 30; i++) {
      let c = obj.peaceSign.clone();
      let x = i % cols;
      let z = Math.floor(i/cols);
      c.position.set(startx + x * separation, 350,  startz + z * separation);
      scene.add(c);
      peaceSigns.push(c);
    }
  })

  for (var i = 0; i < 30; i++) {
    const fuccboi = Fuccboi(physijs, scene);
    fuccbois.push(fuccboi);
  }

  const light = new THREE.DirectionalLight( 0xffffff );
  light.position.set(0, 0, 1);
  scene.add( light )

  alex_video = VideoTexture('alex-video', 0);
  jaq_video = VideoTexture('jaq-video', 0);

  alex_video.position(-1000, 1500, 2);

  //jaq_video.rotate(0, -Math.PI, 0);
  jaq_video.position(1000, 1500, 2);


  scene.add(alex_video.videoObject);
  scene.add(jaq_video.videoObject);

  SC.initialize({
    client_id: '9debd6785a41ff5950a3d6b1abad583f'
  })

  SC.stream('/tracks/245260659', 's-swNZq')
    .then((player) => {
      audioPlayer = player;
      document.body.addEventListener('click', onClick, false);
    });

  floor = Floor(physijs, scene);

  renderer = new THREE.WebGLRenderer(); // why not webgl??
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setClearColor(scene.fog.color);
  renderer.setPixelRatio(window.devicePixelRatio);

  container.appendChild(renderer.domElement);

  //controls = new THREE.OrbitControls(camera, renderer.domElement);
  //controls.enableDamping = true;
  //controls.dampingFactor = 0.25;
  //controls.enableZoom = true;

  controls = Fly(camera, renderer.domElement, THREE);
  controls.movementSpeed = 20;
  controls.rotationSpeed = 0.5;

  //document.addEventListener('mousemove', onDocumentMouseMove, false);
  window.addEventListener('resize', onWindowResize, false);
}

function onWindowResize() {

  windowHalfX = window.innerWidth / 2;
  windowHalfY = window.innerHeight / 2;

  uniforms.resolution.value.x = window.innerWidth;
  uniforms.resolution.value.y = window.innerHeight;

  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();

  renderer.setSize( window.innerWidth, window.innerHeight );

}

function onClick() {
  if (!playing) {
    scene.simulate();
    //audioPlayer.play();
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
  floor.update(renderer);
  renderer.render( scene, camera );
}

let angle = 0;
let inc = 0.01;
let t = 0;
let yInc = 0;
let start = null;

function animate(timestamp) {
  const delta = timestamp - start;
  uniforms.time.value += 0.01; //delta / 1000;
  controls.update(1);
  render();
  t++;
  yInc = Math.sin(t*0.01);

  for (var i = 0, l = peaceSigns.length; i < l; i++) {
    peaceSigns[i].rotateY(inc);
    peaceSigns[i].translateY(yInc);
    //peaceSigns
    //peaceSigns[i].lookAt(camera.position);
  }
  //stats.update();
  jaq_video.videoObject.lookAt(camera.position);
  alex_video.videoObject.lookAt(camera.position);
  start = timestamp;
  requestAnimationFrame( animate );
}

init();
animate();
