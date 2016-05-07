import THREE from 'three';

const separation = 150;
const amountx = 10;
const amounty = 10;

const PI2 = Math.PI * 2;
let material, particle;

export default function(scene) {

  material = new THREE.SpriteMaterial( {
    color: 0x0808080,

  });


  for ( var ix = 0; ix < amountx; ix++ ) {

    for ( var iy = 0; iy < amounty; iy++ ) {

      particle = new THREE.Sprite( material );
      particle.position.x = ix * separation - ( ( amountx * separation ) / 2 );
      particle.position.y = -480 * 0.75
      particle.position.z = iy * separation - ( ( amounty * separation ) / 2 );
      particle.scale.x = particle.scale.y = 2;
      scene.add( particle );

    }

  }

  return {

    update: function() {

    }

  }

}
