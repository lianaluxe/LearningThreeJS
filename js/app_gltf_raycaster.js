// these need to be accessed inside more than one function so we'll declare them first
let container;
let camera;
let controls;
let renderer;
let scene;

//add material name here first
let newMaterial, Standard, newStandard, pointsMaterial;

let SkyboxTexture, SkyboxMaterial, refractorySkybox;

let raycaster;
let mouse;

const mixers = [];
const clock = new THREE.Clock();

function init() {

  container = document.querySelector('#scene-container');

  scene = new THREE.Scene();
  scene.background = new THREE.Color(0x8FBCD4);

  createSkybox();
  createCamera();
  createControls();
  createLights();
  createMaterials();
  loadModels();
  createRenderer();

  renderer.setAnimationLoop(() => {

    update();
    render();

  });

}

function createSkybox() {

  scene.background = new THREE.CubeTextureLoader()
    .setPath('js/three.js-master/examples/textures/cube/MilkyWay/')
    .load([
      'dark-s_px.jpg',
      'dark-s_nx.jpg',
      'dark-s_py.jpg',
      'dark-s_ny.jpg',
      'dark-s_pz.jpg',
      'dark-s_nz.jpg'
    ]);

}

function createCamera() {

  camera = new THREE.PerspectiveCamera(35, container.clientWidth / container.clientHeight, 0.1, 10000);
  camera.position.set(0, 0, 5);

}

function createControls() {

  controls = new THREE.OrbitControls(camera, container);

}


function createLights() {

  const ambientLight = new THREE.HemisphereLight(0xddeeff, 0x0f0e0d, 2);

  const mainLight = new THREE.DirectionalLight(0xffffff, 4);
  mainLight.position.set(10, 10, 10);

  scene.add(ambientLight, mainLight);

}

function createMaterials() {

  function createMaterials(){

       let diffuseColor = "#9E4300";
       newMaterial = new THREE.MeshBasicMaterial( { color: "#9E4300", skinning: true} );
       Standard = new THREE.MeshStandardMaterial( { color: "#9E4300", skinning: true} );

       const loadTexture = new THREE.TextureLoader();
       const RainbowTexture = loadTexture.load("textures/SupernumeraryRainbows_Entwistle_1362.jpg");

       // set the "color space" of the texture
       RainbowTexture.encoding = THREE.sRGBEncoding;

         // reduce blurring at glancing angles
       RainbowTexture.anisotropy = 16;
       RainbowTexture.wrapS = RainbowTexture.wrapT = THREE.RepeatWrapping;

       const imgTexture = new THREE.TextureLoader().load( "textures/water.JPG" );
       				imgTexture.wrapS = imgTexture.wrapT = THREE.RepeatWrapping;
       				imgTexture.anisotropy = 16;


     SkyboxMaterial = new THREE.MeshBasicMaterial( {
                    color: 0xffffff,
                    envMap: scene.background,
                    refractionRatio: 0.8 } );


     newStandard = new THREE.MeshPhongMaterial( {
  										map: RainbowTexture,
  										//bumpMap: imgTexture,
  										//bumpScale: 1,
  										//color: diffuseColor,
  										//metalness: 0.5,
  										//roughness: 0.1,
  										envMap: SkyboxTexture,
                      //displacementMap: imgTexture,
                      //displacementScale: 1,
                      refractionRatio: 0.98,
                      reflectivity: 0.9,
                      specular: 0x222222,
  					          //shininess: 100,
                      skinning: true
  									} );



     refractorySkybox = new THREE.MeshPhongMaterial( {
  										//map: imgTexture,
  										//bumpMap: imgTexture,
  										//bumpScale: 1,
  										//color: diffuseColor,
  										//metalness: 0.5,
  										//roughness: 0.1,
  										envMap: SkyboxTexture,
                      //displacementMap: imgTexture,
                      //displacementScale: 1,
                      refractionRatio: 0.98,
                      reflectivity: 0.9,
                      //specular: 0x222222,
  					          //shininess: 100,
                      skinning: true
  									} );

      pointsMaterial = new THREE.PointsMaterial( {
        color: diffuseColor,
        sizeAttenuation: true,
        size: 0.1
      } );



  }

}

function loadModels() {

  const loader = new THREE.GLTFLoader();

  // A reusable function to set up the models. We're passing in a position parameter
  // so that they can be individually placed around the scene
  const onLoad = (gltf, position, material) => {

    const model = gltf.scene.children[0];
    model.position.copy(position);

    /* const animation = gltf.animations[ 0 ];

      const mixer = new THREE.AnimationMixer( model );
      mixers.push( mixer );

      const action = mixer.clipAction( animation );
      action.play();
      */
    //var newMesh = new THREE.MESH()

    let object = gltf.scene;

    object.traverse((child) => {
      if (child.isMesh) {
        child.material = material; // a material created above
      }
    });
    scene.add(object);

    //scene.add( model );

  };

  // the loader will report the loading progress to this function
  const onProgress = () => {};

  // the loader will send any error messages to this function, and we'll log
  // them to to console
  const onError = (errorMessage) => {
    console.log(errorMessage);
  };

  // load the first model. Each model is loaded asynchronously,
  // so don't make any assumption about which one will finish loading first
  const parrotPosition = new THREE.Vector3(0, 0, 0);
  loader.load('models/skull2.glb', gltf => onLoad(gltf, parrotPosition, newStandard), onProgress, onError);

  //const flamingoPosition = new THREE.Vector3( 7.5, 0, -10 );
  //loader.load( 'models/Flamingo.glb', gltf => onLoad( gltf, flamingoPosition ), onProgress, onError );

  //const storkPosition = new THREE.Vector3( 0, -2.5, -10 );
  //loader.load( 'models/Stork.glb', gltf => onLoad( gltf, storkPosition ), onProgress, onError );

}

function createRenderer() {

  // create a WebGLRenderer and set its width and height
  renderer = new THREE.WebGLRenderer({
    antialias: true
  });
  renderer.setSize(container.clientWidth, container.clientHeight);

  renderer.setPixelRatio(window.devicePixelRatio);

  renderer.gammaFactor = 2.2;
  renderer.gammaOutput = true;

  renderer.physicallyCorrectLights = true;



  container.appendChild(renderer.domElement);

}

function update() {

  const delta = clock.getDelta();

  // /*for ( const mixer of mixers ) {
  //
  //   mixer.update( delta );
  // }
  // */

}

function doStuffwithRaycaster() {

    // update the picking ray with the camera and mouse position
  	raycaster.setFromCamera( mouse, camera );

  	// calculate objects intersecting the picking ray
  	var intersects = raycaster.intersectObjects( scene.children );

  	for ( var i = 0; i < intersects.length; i++ ) {

      //change the object that was intersected with
  		intersects[ i ].object.material.color.set( 0xff0000 );

  	}

}

function render() {

  //console.log(camera.position);
  //doStuffwithRaycaster();

  renderer.render(scene, camera);

}

function onWindowResize() {

  camera.aspect = container.clientWidth / container.clientHeight;

  // update the camera's frustum
  camera.updateProjectionMatrix();

  renderer.setSize(container.clientWidth, container.clientHeight);

}

window.addEventListener('resize', onWindowResize);

init();
