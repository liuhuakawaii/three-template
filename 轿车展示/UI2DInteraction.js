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
    this.labelRenderer.domElement.style = `
      position: absolute;
      left: 0;
      top: 0;
      pointer-events: none;
    `
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
    div.style = `
      background-color: rgba(0, 0, 0, 0.35);
      color: #fff;
      font-size: 12px;
      padding: 3px 5px;
      border-radius: 8px;
    `
    const label = new CSS2DObject(div);
    label.position.copy(position);
    label.position.y += 20
    this.labels.push(label);
    this.baseScene.scene.add(label);
  }

  createLabelById(domId, position) {
    const dom = document.getElementById(domId);
    if (dom) {
      const label = new CSS2DObject(dom);
      dom.style.pointerEvents = 'none';
      label.position.copy(position);
      return label
    }

  }

  update() {
    this.labelRenderer.render(this.baseScene.scene, this.baseScene.camera);
  }
}

