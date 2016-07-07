import THREE from 'three';
import materials from './materials';

const loader = new THREE.TextureLoader();

export default function (physijs, scene) {
  const textureNumber = (Math.random() * 4 | 0 ) + 1;
  const filename = `textures/fuckboi_${textureNumber}.png`;
  let fuccboi;
  loader.load(filename, (texture) => {
    let fuccboiMaterial = new THREE.MeshBasicMaterial({
      map: texture,
      side: THREE.DoubleSide,
      transparent: true
    });
    let fuccboiGeometry = new THREE.PlaneGeometry(300, 600);
    let fuccboi = new physijs.BoxMesh(
      fuccboiGeometry,
      physijs.createMaterial(fuccboiMaterial, 0, 0.99),
      10
    );
    fuccboi.rotation.x = Math.random();
    fuccboi.position.set(
      -2000 + 4000 * Math.random(),
      3000,
      -2000 + 4000 * Math.random()
    );
    fuccboi.__dirtyPosition = true;
    fuccboi.addEventListener('ready', () => {
    })
    scene.add(fuccboi);

  })

  return fuccboi;

}
