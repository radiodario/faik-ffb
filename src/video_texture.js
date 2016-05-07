import THREE from 'three';
import CanvasVideoPlayer from './CanvasVideoPlayer';
const VIDEO_WIDTH = 854;
const VIDEO_HEIGHT = 480;

const isIphone = navigator.userAgent.indexOf('iPhone') >= 0;
// Other way to detect iOS
// var isIOS = /iPad|iPhone|iPod/.test(navigator.platform);

export default function(videoid) {

  let video;
  let image;
  let imageContext;
  let texture;
  let textureReflection;
  let imageReflection;
  let imageReflectionContext;
  let imageReflectionGradient;
  let mesh;
  let reflectionMesh;
  let material;
  let materialReflection;
  let videoObject;
  let videoPlayer;


  video = document.getElementById(videoid);
  image = document.createElement('canvas');
  image.id = videoid + '-canvas';
  document.body.appendChild(image);
  //video.load();
  image.width = VIDEO_WIDTH;
  image.height = VIDEO_HEIGHT;

  if (isIphone) {
    videoPlayer = new CanvasVideoPlayer({
      videoSelector: '#'+videoid,
      canvasSelector: '#'+videoid+'-canvas'
    });
  }

  imageContext = image.getContext('2d');
  imageContext.fillStyle = '#000000';
  imageContext.fillRect(0, 0, VIDEO_WIDTH, VIDEO_HEIGHT);

  texture = new THREE.Texture(image);
  texture.minFilter = THREE.LinearFilter;
  texture.magFilter = THREE.LinearFilter;

  material = new THREE.MeshBasicMaterial({
    map: texture,
    overdraw: true
  });

  imageReflection = document.createElement('canvas');
  imageReflection.width = VIDEO_WIDTH;
  imageReflection.height = VIDEO_HEIGHT;

  imageReflectionContext = imageReflection.getContext('2d');
  imageReflectionContext.fillStyle = '#000000';
  imageReflectionContext.fillRect(0, 0, VIDEO_WIDTH, VIDEO_HEIGHT);

  imageReflectionGradient = imageReflectionContext.createLinearGradient(0, 0, 0, 204);
  imageReflectionGradient.addColorStop(0.2, 'rgba(240, 240, 240, 1)');
  imageReflectionGradient.addColorStop(1,  'rgba(240, 240, 240, 0.8)');

  textureReflection = new THREE.Texture(imageReflection);
  textureReflection.minFilter = THREE.LinearFilter;
  textureReflection.magFilter = THREE.LinearFilter;

  materialReflection = new THREE.MeshBasicMaterial({
    map: textureReflection,
    side: THREE.BackSide,
    overdraw: true
  });

  const plane = new THREE.PlaneGeometry(VIDEO_WIDTH, VIDEO_HEIGHT, 4, 4);

  mesh = new THREE.Mesh(plane, material);
  mesh.scale.x = mesh.scale.y = mesh.scale.z = 1.5;

  reflectionMesh = new THREE.Mesh(plane, materialReflection);
  reflectionMesh.scale.x = reflectionMesh.scale.y = reflectionMesh.scale.z = 1.5;
  reflectionMesh.position.y = -VIDEO_HEIGHT * 1.5;
  reflectionMesh.rotation.x = - Math.PI;

  videoObject = new THREE.Object3D();
  videoObject.add(mesh);
  videoObject.add(reflectionMesh);

  return {
    mesh: mesh,
    reflectionMesh: reflectionMesh,
    videoObject: videoObject,
    video: video,
    // TODO: make mesh and reflectionMesh its own object
    position: function(x, y, z) {
      videoObject.position.x = x;
      videoObject.position.y = y;
      videoObject.position.z = z;
    },
    rotate: function(x, y, z) {
      videoObject.rotation.x = x;
      videoObject.rotation.y = y;
      videoObject.rotation.z = z;
    },
    play: function() {
      if (isIphone) {
        videoPlayer.play();
      } else {
        video.play();
      }
    },
    stop: function() {
      if (isIphone) {
        videoPlayer.stop();
      } else {
        video.pause();
        video.currentTime = 0;
      }
    },
    update: function() {
      if (video.readyState === video.HAVE_ENOUGH_DATA) {
        // if we are on iphone, canvas player draws to our
        // canvas automagically
        if (!isIphone)
          imageContext.drawImage(video, 0, 0);
        if (texture)
          texture.needsUpdate = true;
        if (textureReflection)
          textureReflection.needsUpdate = true;
      }

      imageReflectionContext.drawImage(image, 0, 0);
      imageReflectionContext.fillStyle = imageReflectionGradient;
      imageReflectionContext.fillRect( 0, 0, VIDEO_WIDTH, VIDEO_HEIGHT);
    }
  }

}
