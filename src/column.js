import THREE from 'three';
import OBJLoader from 'three-obj-loader';

OBJLoader(THREE);
const loader = new THREE.OBJLoader();

const manager = new THREE.LoadingManager();
manager.onProgress = (item, loaded, total) => {
  console.log(item, loaded, total);
};

let loaded = false;
let columnObject;

export default function() {

  return new Promise((resolve, reject) => {

    loader.load('textures/column.obj', (object) => {
    const mat = new THREE.MeshLambertMaterial( { color: 0xffffff } );
      object.traverse( (child) => {
        if ( child instanceof THREE.Mesh) {
          child.material = mat;
        }

      });
      resolve({
        columnObject: object
      })
      loaded = true;
    })

  })
}

