import THREE from 'three';
import materials from './materials';

const separation = 150;
const amountx = 10;
const amounty = 10;

const PI2 = Math.PI * 2;
let material, mirrorSphereCamera, floor;

export default function(physijs, scene) {
  mirrorSphereCamera = new THREE.CubeCamera(1, 100000, 1024);
  scene.add(mirrorSphereCamera);
  const threeMaterial = new THREE.MeshBasicMaterial( {
    envMap: mirrorSphereCamera.renderTarget,
    color: 0xff44CC
  } );

  material = physijs.createMaterial(
    threeMaterial,
    0,
    1
  );

  const wallMaterial = new THREE.MeshBasicMaterial({
    visible: false
  })
  //  const wallMaterial = materials.basic(null, 0xff44cc);
  const wallPhysMaterial = physijs.createMaterial(
    wallMaterial,
    0,
    1
  );
  const wallGeom = new THREE.PlaneGeometry(10000, 10000, 4, 4);

  const northWall = new physijs.BoxMesh(wallGeom, wallPhysMaterial, 0);
  const southWall = new physijs.BoxMesh(wallGeom, wallPhysMaterial, 0);
  const eastWall = new physijs.BoxMesh(wallGeom, wallPhysMaterial, 0);
  const westWall = new physijs.BoxMesh(wallGeom, wallPhysMaterial, 0);

  northWall.position.z = 5000;
  southWall.position.z = -5000;
  eastWall.rotation.y = - Math.PI / 2;
  westWall.rotation.y = Math.PI / 2;
  eastWall.position.x = -5000;
  westWall.position.x = 5000;

  scene.add(northWall);
  scene.add(westWall);
  scene.add(southWall);
  scene.add(eastWall);

  //material = materials.basic();
  const floorGeom = new THREE.PlaneGeometry(20000, 20000, 4, 4);
  floor = new physijs.BoxMesh(floorGeom, material, 0);
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
