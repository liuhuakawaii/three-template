import * as THREE from 'three';

export default class MouseInteraction {
  constructor(baseScene) {
    this.baseScene = baseScene;
    this.raycaster = new THREE.Raycaster();
    this.mouse = new THREE.Vector2();
    this.selectedObject = null;
    this.hoverObject = null;
    this.intersects = [];

    this.onClickCallback = null;
    this.onDblClickCallback = null;
    this.onHoverCallback = null;

    this.init();
  }

  init() {
    this.addEventListeners();
  }

  addEventListeners() {
    const canvas = this.baseScene.renderer.domElement;
    canvas.addEventListener('mousemove', this.onMouseMove.bind(this), false);
    canvas.addEventListener('click', this.onClick.bind(this), false);
    canvas.addEventListener('dblclick', this.onDblClick.bind(this), false);
  }

  onMouseMove(event) {
    event.preventDefault();
    const canvas = this.baseScene.renderer.domElement;
    const rect = canvas.getBoundingClientRect();
    this.mouse.x = ((event.clientX - rect.left) / canvas.clientWidth) * 2 - 1;
    this.mouse.y = -((event.clientY - rect.top) / canvas.clientHeight) * 2 + 1;  //坐标系转化

    this.checkIntersection();

    if (this.hoverObject !== this.intersects[0]?.object) {
      if (this.hoverObject) this.onMouseLeave(this.hoverObject);
      this.hoverObject = this.intersects[0]?.object;
      if (this.hoverObject) this.onMouseEnter(this.hoverObject);
    }

    if (this.onHoverCallback) this.onHoverCallback(this.hoverObject);
  }

  onClick(event) {
    event.preventDefault();
    this.checkIntersection();

    if (this.intersects.length > 0) {
      this.selectedObject = this.intersects[0].object;
      if (this.onClickCallback) this.onClickCallback(this.selectedObject);
    } else {
      this.selectedObject = null;
      if (this.onClickCallback) this.onClickCallback(null);
    }
  }

  onDblClick(event) {
    event.preventDefault();
    this.checkIntersection();

    if (this.intersects.length > 0) {
      const dblClickedObject = this.intersects[0].object;
      if (this.onDblClickCallback) this.onDblClickCallback(dblClickedObject);
    } else {
      if (this.onDblClickCallback) this.onDblClickCallback(null);
    }
  }

  checkIntersection() {
    //通过鼠标位置和相机计算射线 设置射线的起点和方向
    this.raycaster.setFromCamera(this.mouse, this.baseScene.camera);
    // 第二个参数为 true 表示递归检查子对象
    this.intersects = this.raycaster.intersectObjects(this.baseScene.scene.children, true);
  }

  onMouseEnter(object) {
    if (object.material) {
      // object.material.emissive = new THREE.Color(0x555555);
    }
  }

  onMouseLeave(object) {
    // 可以在这里添加鼠标离开对象时的效果，比如恢复原来的颜色
    if (object.material) {
      // object.material.emissive = new THREE.Color(0x000000);
    }
  }

  setOnClickCallback(callback) {
    this.onClickCallback = callback;
  }

  setOnDblClickCallback(callback) {
    this.onDblClickCallback = callback;
  }

  setOnHoverCallback(callback) {
    this.onHoverCallback = callback;
  }

  update() {
    // 在这里可以添加需要在每一帧更新的逻辑
  }
}