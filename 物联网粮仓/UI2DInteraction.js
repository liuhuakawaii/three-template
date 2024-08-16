import { CSS2DRenderer, CSS2DObject } from 'three/addons/renderers/CSS2DRenderer.js';

export default class UI2DInteraction {
  constructor(baseScene) {
    this.baseScene = baseScene;
    this.labelRenderer = null;
    this.labels = [];

    this.init();
  }

  init() {
    this.createLabelRenderer();
    this.addEventListeners();
  }

  createLabelRenderer() {
    this.labelRenderer = new CSS2DRenderer();
    this.labelRenderer.setSize(this.baseScene.container.clientWidth, this.baseScene.container.clientHeight);
    this.labelRenderer.domElement.style.position = 'absolute';
    this.labelRenderer.domElement.style.top = '0px';
    this.labelRenderer.domElement.style.pointerEvents = 'none';
    this.baseScene.container.appendChild(this.labelRenderer.domElement);
  }

  addEventListeners() {
    window.addEventListener('resize', this.onWindowResize.bind(this), false);
  }

  onWindowResize() {
    this.labelRenderer.setSize(this.baseScene.container.clientWidth, this.baseScene.container.clientHeight);
  }

  createLabel(text, position) {
    const div = document.createElement('div');
    div.className = 'label';
    div.textContent = text;
    div.style.backgroundColor = 'rgba(255, 255, 255, 0.7)';
    div.style.padding = '2px 5px';
    div.style.borderRadius = '3px';

    const label = new CSS2DObject(div);
    label.position.copy(position);

    this.labels.push(label);
    this.baseScene.scene.add(label);
  }

  update() {
    this.labelRenderer.render(this.baseScene.scene, this.baseScene.camera);
  }
}

