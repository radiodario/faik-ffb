import THREE from 'three';

let loader = new THREE.ImageLoader();

export default function (camera) {

  let object = new THREE.Object();

  let texture = THREE.ImageUtils.loadTexture.load('/textures/texture_01.png');




  return {
    update: function() {

    }

  }

}
