import THREE from 'three';
import materials from './materials';

const separation = 150;
const amountx = 10;
const amounty = 10;

const PI2 = Math.PI * 2;
let material, mirrorSphereCamera, floor;

export default function(scene) {
  mirrorSphereCamera = new THREE.CubeCamera(1, 100000, 1024);
  scene.add(mirrorSphereCamera);
  material = new THREE.MeshBasicMaterial( {
    envMap: mirrorSphereCamera.renderTarget,
    color: 0xff44CC
  } );
  //material = materials.basic();
  const floorGeom = new THREE.PlaneGeometry(20000, 20000, 4, 4);
  floor = new THREE.Mesh(floorGeom, material);
  floor.rotation.x = - Math.PI / 2;
  floor.position.set(100, -350, 0);
  scene.add(floor);
  //mirrorSphereCamera.rotation.set(floor.rotation.x, floor.rotation.y, floor.rotation.z)
  mirrorSphereCamera.position.set(floor.position.x, floor.position.y, floor.position.z);
  return {

    update: function(renderer) {
      floor.visible = false;
      mirrorSphereCamera.updateCubeMap( renderer, scene );
      floor.visible = true;
    }

  }

}
