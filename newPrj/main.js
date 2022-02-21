import './style.css'

import * as THREE from 'three';

import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

import { AmbientLightProbe } from 'three';


const scene = new THREE.Scene();

//serve per dare tutte le ionformazioni necessarie per la view della camera
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000); 

const render = new THREE.WebGL1Renderer({
    canvas: document.querySelector('#bg'),
});



render.setPixelRatio( window.devicePixelRatio );
render.setSize( window.innerWidth, window.innerHeight );
camera.position.setZ(30);

render.render(scene,camera);

const geometry = new THREE.TorusGeometry(10,3,16,100);
const material = new THREE.MeshStandardMaterial({ color: 0xFF6347 }); //specifiche del materiale con cui verrà creato l'oggetto
const torus = new THREE.Mesh(geometry, material);

scene.add(torus)

const pointLight = new THREE.PointLight( 0xffffff );
pointLight.position.set( 5, 5, 5 );

const ambientLight = new THREE.AmbientLight( 0xffffff ); // sostanzialmente da il colore all'oggetto  tramite luce
scene.add( pointLight, ambientLight);

const lightHelper = new THREE.PointLightHelper(pointLight);
const gridHelper = new THREE.GridHelper(200,50);
scene.add(lightHelper, gridHelper);

//serve per poter prendere input tramite dei comandi inseriti dal client
// gli arrgomenti nella funzione vanno a dirgli di ascoltare tutti i movimenti del mouse sulla pagine e come modificare la camera
const controls = new OrbitControls(camera, render.domElement);

function addStar(){
  const geometry = new THREE.SphereGeometry(0.25,24,24);
  const material = new THREE.MeshStandardMaterial({ color: 0xffffff }); 
  const star = new THREE.Mesh(geometry, material);
//randFloatSpread genera un valora casuale tra -var a +var
  const [x,y,z] = Array(3).fill().map(() => THREE.MathUtils.randFloatSpread(100));
  star.position.set(x,y,z);
  scene.add(star);
}

Array(200).fill().forEach(addStar);

const spaceTexture = new THREE.TextureLoader().load('space.jpg');
scene.background = spaceTexture;



//-----------Loop animazione-------------------\\
function animate(){
  requestAnimationFrame(animate);
  torus.rotation.x += 0.01;
  torus.rotation.y += 0.005;
  torus.rotation.z += 0.01;

  controls.update();

  render.render(scene ,camera);

}
animate();
//------------------------------\\

document.querySelector('#app').innerHTML = `
  <h1>Hello Vite!</h1>
  <a href="https://vitejs.dev/guide/features.html" target="_blank">Documentation</a>
`
//jupiter
const juTexture = new THREE.TextureLoader().load('giove.jpg');
const normalTexture = new THREE.TextureLoader().load('normal.jpg')
const jMat = new THREE.MeshStandardMaterial( 
  { 
    map: juTexture,
    normalMap: normalTexture
  }
)
const jGeo = new THREE.SphereGeometry(3 , 32 , 32);
const jupiter = new THREE.Mesh(jGeo, jMat);

scene.add(jupiter)