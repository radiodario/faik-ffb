import THREE from 'three';
import OBJLoader from 'three-obj-loader';
import materials from './materials';

OBJLoader(THREE);
const loader = new THREE.OBJLoader();

const manager = new THREE.LoadingManager();
manager.onProgress = (item, loaded, total) => {
  console.log(item, loaded, total);
};

let loaded = false;
let columnObject;

export default function(uniforms) {

  return new Promise((resolve, reject) => {

    loader.load('textures/peace.obj', (object) => {
    const mat = materials.colourBlender(uniforms);
      object.traverse( (child) => {
        if ( child instanceof THREE.Mesh) {
          child.rotation.set(-Math.PI/2, 0, 0);
          child.material = mat;
        }

      });
      resolve({
        peaceSign: object
      })
      loaded = true;
    })

  })
}

