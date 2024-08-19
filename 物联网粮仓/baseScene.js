
import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { FBXLoader } from 'three/addons/loaders/FBXLoader.js';
import { ColladaLoader } from 'three/addons/loaders/ColladaLoader.js';
import { OBJLoader } from 'three/addons/loaders/OBJLoader.js';
import { PLYLoader } from 'three/addons/loaders/PLYLoader.js';
import { STLLoader } from 'three/addons/loaders/STLLoader.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { createFlame } from './flame.js';
export default class BaseScene {
  constructor(container) {
    this.container = container;
    this.scene = new THREE.Scene();
    this.camera = null;
    this.renderer = null;
    this.controls = null;
    this.fileLoaderMap = {
      'glb': new GLTFLoader(),
      'fbx': new FBXLoader(),
      'gltf': new GLTFLoader(),
      'obj': new OBJLoader(),
      'dae': new ColladaLoader(),
      'stl': new STLLoader(),
      'ply': new PLYLoader(),
    }
    this.animation = null
    this.textureLoader = new THREE.TextureLoader();
    this.sequenceAnimations = [];

    this.init();
  }

  init() {
    this.createCamera();
    // this.createOrthographicCamera()
    this.createRenderer();
    this.createControls();
    this.createLights();
    this.addEventListeners();
    this.createFog(0x005577, -100, 1000);
  }

  createCamera() {
    this.camera = new THREE.PerspectiveCamera(
      75,
      this.container.clientWidth / this.container.clientHeight,
      0.1,
      3000);
    this.camera.position.set(292, 223, 185);
  }

  createOrthographicCamera() {
    this.camera = new THREE.OrthographicCamera(this.container.clientWidth / - 2, this.container.clientWidth / 2, this.container.clientHeight / 2, this.container.clientHeight / - 2, 0.1, 3000);
    this.camera.position.set(292, 223, 185);
  }

  createRenderer() {
    this.renderer = new THREE.WebGLRenderer({ antialias: true });
    this.renderer.setSize(this.container.clientWidth, this.container.clientHeight);
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.setClearColor(0x005577, 1);
    this.container.appendChild(this.renderer.domElement);

    this.renderer.outputEncoding = THREE.sRGBEncoding; //解决模型颜色变暗的问题
  }

  createControls() {
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.enableDamping = true;
  }

  createLights() {
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
    this.scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(10, 10, 10);
    this.scene.add(directionalLight);
  }

  createFog(color, near, far) {
    this.scene.fog = new THREE.Fog(color, near, far);
  }

  addFlame(pos) {
    console.log(pos, 'pos');
    const flame = createFlame()
    this.scene.add(flame)
    flame.position.copy(pos)
    flame.position.y += 10;
  }

  addEventListeners() {
    window.addEventListener('resize', this.onWindowResize.bind(this), false);
  }

  onWindowResize() {
    this.camera.aspect = this.container.clientWidth / this.container.clientHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(this.container.clientWidth, this.container.clientHeight);
  }

  render() {
    requestAnimationFrame(this.render.bind(this));
    this.controls.update();
    this.updateSequenceAnimations();
    // this.animation.UpdateLoop()
    this.renderer.render(this.scene, this.camera);
  }

  addMesh(mesh) {
    this.scene.add(mesh);
  }

  loadModelByUpload(file) {
    const reader = new FileReader();
    reader.onload = (event) => {
      const extension = file.name.split('.').pop().toLowerCase();
      if (this.fileLoaderMap[extension]) {
        this.fileLoaderMap[extension].load(event.target.result, (model) => {
          this.clearModel()
          let tempScene
          if (extension === 'glb') {
            tempScene = model.scene;
          } else {
            tempScene = model;
          }
          // const boundingBox = new THREE.Box3().setFromObject(tempScene);
          // const center = new THREE.Vector3();
          // boundingBox.getCenter(center); // 计算 mesh 的中心点并将其移动到原点
          // const meshGroup = new THREE.Group();
          // // 遍历 this.originMesh 的子对象，将所有子对象的位置调整以使中心点在原点

          // tempScene.traverse((object) => {
          //   if (object.isMesh) {
          //     object.position.sub(center);
          //     meshGroup.add(object.clone());
          //   }
          // });
          this.originMesh = tempScene

          this.scene.add(this.originMesh);
        });
      } else {
        console.log('不支持该文件类型')
      }
    }
    reader.readAsDataURL(file);
  }

  loadModelByPath(url, cb) {
    const extension = url.split('.').pop().toLowerCase();
    if (this.fileLoaderMap[extension]) {
      fetch(url)
        .then(response => response.blob())
        .then(blob => {
          const reader = new FileReader();
          reader.onload = (event) => {
            this.fileLoaderMap[extension].load(event.target.result, (model) => {

              let tempScene;
              if (extension === 'glb') {
                tempScene = model.scene;
              } else {
                tempScene = model;
              }
              // 以下是你原有的逻辑
              // ...
              this.originMesh = tempScene;
              this.scene.add(this.originMesh);
              cb && cb()
            });
          };
          reader.readAsDataURL(blob);
        })
        .catch(error => {
          console.error('加载模型失败:', error);
        });
    } else {
      console.log('不支持该文件类型');
    }
  }

  traverseScene(ui2D) {
    const group = this.scene.getObjectByName('粮仓')
    group.traverse((object) => {
      if (object.isMesh) {
        const pos = object.getWorldPosition(new THREE.Vector3())
        ui2D.createLabel(object.name, pos)
      }
    });
  }

}
