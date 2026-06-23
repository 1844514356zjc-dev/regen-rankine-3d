// Three.js 动力装置 3D 模型 (一级回热朗肯循环)
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { CSS2DRenderer, CSS2DObject } from 'three/addons/renderers/CSS2DRenderer.js';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';
import { OutputPass } from 'three/addons/postprocessing/OutputPass.js';
import { tempColorRGB } from './props.js';

const COL = {
  metal: 0x8090ae, metalDark: 0x52617c, metalLight: 0xb6c4d6,
  steel: 0x8896b3, fire: 0xff8a3c, cool: 0x49d8ee, accent: 0x6ad0ff,
};
const tempColor = T => { const [r, g, b] = tempColorRGB(T); return new THREE.Color(r, g, b); };

// 组件位置
const POS = {
  boiler: [-5.6, 0, -2.4], boilerTop: [-5.6, 3.45, -2.4], boilerIn: [-5.6, 0.55, -1.35],
  hp: [-2.35, 1.75, -2.4], hpIn: [-3.05, 1.95, -2.4], hpOut: [-1.6, 1.7, -2.4], hpExt: [-2.05, 2.35, -2.4],
  lp: [0.75, 1.5, -2.4], lpIn: [-0.2, 1.6, -2.4], lpOut: [1.75, 1.15, -2.4],
  gen: [3.35, 1.65, -2.4],
  cond: [1.85, 0.6, 0.3], condIn: [1.85, 1.05, -0.5], condOut: [1.85, 0.25, 1.05],
  pump1: [0.25, 0.42, 1.55],
  fwh: [-1.65, 1.0, 1.95], fwhIn1: [-0.85, 1.0, 1.95], fwhIn2: [-1.65, 1.55, 1.55], fwhOut: [-2.45, 1.0, 1.95],
  pump2: [-3.95, 0.62, 1.4],
};

// 管道定义: 路径点 + 取色状态点
const PIPES = [
  { id: 'boiler->hp', key: 5, pts: [POS.boilerTop, [-5.6, 3.8, -2.4], [-3.05, 3.8, -2.4], POS.hpIn] },
  { id: 'hp->fwh(ext)', key: 6, pts: [POS.hpExt, [-2.05, 2.7, 0.2], [-1.65, 2.1, 1.4], POS.fwhIn2] },
  { id: 'hp->lp', key: 6, pts: [POS.hpOut, POS.lpIn] },
  { id: 'lp->cond', key: 7, pts: [POS.lpOut, [1.85, 1.15, -1.3], POS.condIn] },
  { id: 'cond->pump1->fwh', key: 2, pts: [POS.condOut, [1.1, 0.3, 1.45], POS.pump1, [-0.3, 0.85, 1.85], POS.fwhIn1] },
  { id: 'fwh->pump2->boiler', key: 4, pts: [POS.fwhOut, [-3.2, 0.8, 1.65], POS.pump2, [-4.85, 0.6, -0.1], POS.boilerIn] },
];

export class PlantScene {
  constructor(container, labelContainer) {
    this.container = container;
    this.labelContainer = labelContainer;
    this.pipes = [];
    this.spinners = [];   // {group, base}
    this.glowMats = [];   // emissive materials to pulse
    this.flowScale = 1;
    this.autoRotate = true;
    this._raf = null;
    this._t = 0;
    this._build();
  }

  _build() {
    const w = this.container.clientWidth || 800;
    const h = this.container.clientHeight || 600;

    this.scene = new THREE.Scene();

    this.camera = new THREE.PerspectiveCamera(45, w / h, 0.1, 300);
    this.camera.position.set(9, 6, 10);

    this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.setSize(w, h);
    this.renderer.outputColorSpace = THREE.SRGBColorSpace;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.35;
    this.container.appendChild(this.renderer.domElement);

    this.labelRenderer = new CSS2DRenderer();
    this.labelRenderer.setSize(w, h);
    this.labelRenderer.domElement.style.position = 'absolute';
    this.labelRenderer.domElement.style.top = '0';
    this.labelRenderer.domElement.style.pointerEvents = 'none';
    this.labelContainer.appendChild(this.labelRenderer.domElement);

    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.target.set(-0.3, 1.4, -0.4);
    this.controls.enableDamping = true;
    this.controls.dampingFactor = 0.08;
    this.controls.minDistance = 6;
    this.controls.maxDistance = 30;
    this.controls.maxPolarAngle = Math.PI * 0.495;
    this.controls.autoRotate = this.autoRotate;
    this.controls.autoRotateSpeed = 0.45;

    this._setupEnv();
    this._setupComposer();
    this._lights();
    this._environment();
    this._buildPlant();
    this._buildPipes();

    this._loop = this._loop.bind(this);
    this._raf = requestAnimationFrame(this._loop);
  }

  _setupEnv() {
    // 环境贴图: 金属反射 + 图像化基础照明 (大幅提升可读性与高级感)
    const pmrem = new THREE.PMREMGenerator(this.renderer);
    const envRT = pmrem.fromScene(new RoomEnvironment(), 0.04);
    this.scene.environment = envRT.texture;
    this.scene.background = this._bgGrad();
    this.scene.fog = new THREE.FogExp2(0x0c1a30, 0.012);
    this.renderer.toneMappingExposure = 1.35;
  }
  _setupComposer() {
    const w = this.container.clientWidth || 800, h = this.container.clientHeight || 600;
    this.composer = new EffectComposer(this.renderer);
    this.composer.addPass(new RenderPass(this.scene, this.camera));
    this.bloom = new UnrealBloomPass(new THREE.Vector2(w, h), 0.28, 0.4, 0.85);
    this.composer.addPass(this.bloom);
    this.composer.addPass(new OutputPass());
  }
  _bgGrad() {
    const c = document.createElement('canvas'); c.width = 8; c.height = 256;
    const ctx = c.getContext('2d');
    const g = ctx.createLinearGradient(0, 0, 0, 256);
    g.addColorStop(0, '#0a1830'); g.addColorStop(0.5, '#13264a'); g.addColorStop(1, '#08111f');
    ctx.fillStyle = g; ctx.fillRect(0, 0, 8, 256);
    const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; return t;
  }
  _glowTex() {
    const c = document.createElement('canvas'); c.width = c.height = 256;
    const ctx = c.getContext('2d');
    const g = ctx.createRadialGradient(128, 128, 4, 128, 128, 124);
    g.addColorStop(0, 'rgba(120,190,255,0.55)');
    g.addColorStop(0.4, 'rgba(80,150,235,0.18)');
    g.addColorStop(1, 'rgba(80,150,235,0)');
    ctx.fillStyle = g; ctx.fillRect(0, 0, 256, 256);
    return new THREE.CanvasTexture(c);
  }

  _lights() {
    this.scene.add(new THREE.HemisphereLight(0xc3d8ff, 0x1a2336, 0.9));
    const key = new THREE.DirectionalLight(0xffffff, 1.5);
    key.position.set(7, 11, 7); this.scene.add(key);
    const fill = new THREE.DirectionalLight(0x8fb4ff, 0.5);
    fill.position.set(-6, 5, -4); this.scene.add(fill);
    const rim = new THREE.DirectionalLight(0x7fe9ff, 0.6);
    rim.position.set(0, 7, -11); this.scene.add(rim);
    this.boilerLight = new THREE.PointLight(0xff8a3c, 3.0, 16, 1.6);
    this.boilerLight.position.set(POS.boiler[0], POS.boiler[1] + 1.4, POS.boiler[2]);
    this.scene.add(this.boilerLight);
    this.condLight = new THREE.PointLight(0x49d8ee, 1.9, 10, 1.8);
    this.condLight.position.set(POS.cond[0], POS.cond[1] + 0.8, POS.cond[2]);
    this.scene.add(this.condLight);
  }

  _environment() {
    // 地面圆盘 (浅钢蓝, 带反射)
    const gGround = new THREE.CircleGeometry(26, 72);
    const mGround = new THREE.MeshStandardMaterial({ color: 0x1a2a44, roughness: 0.55, metalness: 0.55 });
    const ground = new THREE.Mesh(gGround, mGround);
    ground.rotation.x = -Math.PI / 2; ground.position.y = -0.02;
    this.scene.add(ground);
    // 网格
    const grid = new THREE.GridHelper(44, 44, 0x2c4068, 0x1a2840);
    grid.material.transparent = true; grid.material.opacity = 0.4; grid.position.y = 0;
    this.scene.add(grid);
    // 径向氛围光晕 (背景柔光)
    const glow = new THREE.Mesh(new THREE.PlaneGeometry(36, 24),
      new THREE.MeshBasicMaterial({ map: this._glowTex(), transparent: true, depthWrite: false, blending: THREE.AdditiveBlending }));
    glow.position.set(-1.5, 4.8, -10); this.scene.add(glow);
    // 星点 (稀疏、弱)
    const starN = 320;
    const pos = new Float32Array(starN * 3);
    for (let i = 0; i < starN; i++) {
      const r = 60 + Math.random() * 40, th = Math.random() * Math.PI * 2, ph = Math.acos(2 * Math.random() - 1);
      pos[i * 3] = r * Math.sin(ph) * Math.cos(th);
      pos[i * 3 + 1] = Math.abs(r * Math.cos(ph)) * 0.7 + 6;
      pos[i * 3 + 2] = r * Math.sin(ph) * Math.sin(th);
    }
    const gStar = new THREE.BufferGeometry();
    gStar.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    const mStar = new THREE.PointsMaterial({ color: 0xbcd0f5, size: 0.3, sizeAttenuation: true, transparent: true, opacity: 0.5 });
    this.scene.add(new THREE.Points(gStar, mStar));
  }

  // ---- 通用 ----
  _metal(color = COL.metal, rough = 0.3, metal = 0.95) {
    return new THREE.MeshPhysicalMaterial({ color, roughness: rough, metalness: metal, clearcoat: 0.45, clearcoatRoughness: 0.25, envMapIntensity: 1.15 });
  }
  _shadow(x, z, r) {
    const tex = this._shadowTex || (this._shadowTex = (() => {
      const c = document.createElement('canvas'); c.width = c.height = 128;
      const g = c.getContext('2d').createRadialGradient(64, 64, 4, 64, 64, 62);
      g.addColorStop(0, 'rgba(0,0,0,0.55)'); g.addColorStop(1, 'rgba(0,0,0,0)');
      const ctx = c.getContext('2d'); ctx.fillStyle = g; ctx.fillRect(0, 0, 128, 128);
      return new THREE.CanvasTexture(c);
    })());
    const m = new THREE.Mesh(new THREE.PlaneGeometry(r * 2, r * 2), new THREE.MeshBasicMaterial({ map: tex, transparent: true, depthWrite: false }));
    m.rotation.x = -Math.PI / 2; m.position.set(x, 0.01, z);
    this.scene.add(m);
  }
  _label(text, en, pos, dy = 0) {
    const div = document.createElement('div');
    div.className = 'label3d';
    div.innerHTML = `${text}<span class="en">${en}</span>`;
    const obj = new CSS2DObject(div);
    obj.position.set(pos[0], pos[1] + dy, pos[2]);
    this.scene.add(obj);
    return obj;
  }

  _buildPlant() {
    // —— 锅炉 ——
    const boiler = new THREE.Group();
    const body = new THREE.Mesh(new THREE.CylinderGeometry(0.78, 0.85, 3.3, 32), this._metal(COL.steel, 0.4, 0.9));
    body.position.y = 1.75; boiler.add(body);
    // 底座 + 法兰环
    const plinth = new THREE.Mesh(new THREE.CylinderGeometry(0.96, 1.02, 0.32, 32), this._metal(COL.metalDark, 0.5, 0.9));
    plinth.position.y = 0.16; boiler.add(plinth);
    for (const yy of [0.85, 2.65]) {
      const flange = new THREE.Mesh(new THREE.TorusGeometry(0.82, 0.045, 14, 44), this._metal(COL.metalLight, 0.3));
      flange.rotation.x = Math.PI / 2; flange.position.y = yy; boiler.add(flange);
    }
    // 炉膛发光带
    const fireMat = new THREE.MeshStandardMaterial({ color: COL.fire, emissive: COL.fire, emissiveIntensity: 1.2, roughness: 0.5 });
    this.glowMats.push({ mat: fireMat, base: 1.2 });
    const fire = new THREE.Mesh(new THREE.CylinderGeometry(0.86, 0.86, 0.9, 32, 1, true), fireMat);
    fire.position.y = 0.7; boiler.add(fire);
    const fire2 = new THREE.Mesh(new THREE.CylinderGeometry(0.86, 0.86, 0.5, 32, 1, true), fireMat.clone());
    fire2.position.y = 1.35; boiler.add(fire2); this.glowMats.push({ mat: fire2.material, base: 1.3 });
    // 顶部集箱 + 烟囱
    const cap = new THREE.Mesh(new THREE.CylinderGeometry(0.82, 0.78, 0.4, 32), this._metal(COL.metalLight, 0.35));
    cap.position.y = 3.6; boiler.add(cap);
    const stack = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.22, 1.3, 16), this._metal(COL.metalDark, 0.6));
    stack.position.set(0.35, 4.4, 0); boiler.add(stack);
    boiler.position.set(...POS.boiler);
    this.scene.add(boiler);
    this._shadow(POS.boiler[0], POS.boiler[2], 1.6);
    this._label('锅炉', 'Boiler', POS.boiler, 3.0);

    // —— 汽轮机(高/低压) + 发电机 ——
    this._turbine(POS.hp, 0.42, 0.6, 1.5, '高压汽轮机', 'HP Turbine', 1.55, 9);
    this._turbine(POS.lp, 0.55, 0.85, 1.9, '低压汽轮机', 'LP Turbine', 1.6, 6);
    // 发电机
    const gen = new THREE.Group();
    const gBody = new THREE.Mesh(new THREE.CylinderGeometry(0.62, 0.62, 1.7, 32), this._metal(0x46526c, 0.4, 0.85));
    gBody.rotation.z = Math.PI / 2; gBody.position.y = 0; gen.add(gBody);
    const gCap = new THREE.Mesh(new THREE.CylinderGeometry(0.66, 0.66, 0.3, 32), this._metal(COL.metalLight, 0.3));
    gCap.rotation.z = Math.PI / 2; gCap.position.x = 0.9; gen.add(gCap);
    const gRing = new THREE.Mesh(new THREE.TorusGeometry(0.66, 0.05, 12, 32), this._metal(COL.cool, 0.3).clone());
    gRing.position.x = -0.2; gen.add(gRing);
    // 散热筋
    for (let i = 0; i < 10; i++) {
      const fin = new THREE.Mesh(new THREE.BoxGeometry(0.04, 1.2, 0.12), this._metal(COL.metalDark, 0.6));
      fin.rotation.x = i * Math.PI / 5; gen.add(fin);
    }
    gen.position.set(...POS.gen);
    this.scene.add(gen);
    this._shadow(POS.gen[0], POS.gen[2], 1.1);
    this._label('发电机', 'Generator', POS.gen, 1.1);

    // —— 凝汽器 ——
    const cond = new THREE.Group();
    const cBody = new THREE.Mesh(new THREE.CylinderGeometry(0.72, 0.72, 2.2, 32), this._metal(0x3a4660, 0.45, 0.85));
    cBody.rotation.z = Math.PI / 2; cond.add(cBody);
    const coolMat = new THREE.MeshStandardMaterial({ color: COL.cool, emissive: COL.cool, emissiveIntensity: 0.6, roughness: 0.5, transparent: true, opacity: 0.85 });
    const cGlow = new THREE.Mesh(new THREE.CylinderGeometry(0.5, 0.5, 2.0, 24, 1, true), coolMat);
    cGlow.rotation.z = Math.PI / 2; cond.add(cGlow); this.glowMats.push({ mat: coolMat, base: 0.6 });
    // 端盖 + 管束环
    for (const s of [-1, 1]) {
      const cap = new THREE.Mesh(new THREE.CylinderGeometry(0.74, 0.74, 0.18, 32), this._metal(COL.metalLight, 0.35));
      cap.rotation.z = Math.PI / 2; cap.position.x = s * 1.1; cond.add(cap);
    }
    cond.position.set(...POS.cond);
    this.scene.add(cond);
    this._shadow(POS.cond[0], POS.cond[2], 1.5);
    this._label('凝汽器', 'Condenser', POS.cond, 1.0);

    // —— 回热加热器 (FWH) ——
    const fwh = new THREE.Group();
    const fBody = new THREE.Mesh(new THREE.CylinderGeometry(0.5, 0.5, 1.9, 28), this._metal(0x43506b, 0.4, 0.85));
    fBody.rotation.z = Math.PI / 2; fwh.add(fBody);
    for (const s of [-1, 1]) {
      const cap = new THREE.Mesh(new THREE.CylinderGeometry(0.52, 0.52, 0.16, 28), this._metal(COL.metalLight, 0.35));
      cap.rotation.z = Math.PI / 2; cap.position.x = s * 0.95; fwh.add(cap);
    }
    fwh.position.set(...POS.fwh);
    this.scene.add(fwh);
    this._shadow(POS.fwh[0], POS.fwh[2], 1.0);
    this._label('回热加热器', 'Feedwater Heater', POS.fwh, 0.9);

    // —— 泵 ——
    this._pump(POS.pump1, '给水泵①', 'Pump 1');
    this._pump(POS.pump2, '给水泵②', 'Pump 2');

    // —— 工况铭牌基底 ——
  }

  _turbine(pos, rIn, rOut, len, cn, en, dy, fins) {
    const g = new THREE.Group();
    // 轴线沿 X
    const casing = new THREE.Mesh(new THREE.CylinderGeometry(rOut, rOut + 0.06, len, 32, 1, true, 0, Math.PI),
      new THREE.MeshStandardMaterial({ color: COL.metal, roughness: 0.4, metalness: 0.9, side: THREE.DoubleSide }));
    casing.rotation.z = Math.PI / 2; casing.position.y = 0.0; g.add(casing);
    // 发光环带 (科技细节, 会辉光)
    const ringMat = new THREE.MeshStandardMaterial({ color: COL.accent, emissive: COL.accent, emissiveIntensity: 0.5, roughness: 0.4 });
    const ring = new THREE.Mesh(new THREE.TorusGeometry(rOut + 0.04, 0.035, 12, 44), ringMat);
    ring.rotation.y = Math.PI / 2; g.add(ring);
    this.glowMats.push({ mat: ringMat, base: 0.5 });
    // 上下半壳接缝
    const shell = new THREE.Mesh(new THREE.CylinderGeometry(rOut + 0.08, rOut + 0.08, len + 0.2, 32),
      this._metal(COL.metalDark, 0.6, 0.7));
    shell.rotation.z = Math.PI / 2; shell.visible = false;
    // 转子(旋转组)
    const rotor = new THREE.Group();
    const shaft = new THREE.Mesh(new THREE.CylinderGeometry(0.13, 0.13, len + 0.6, 16), this._metal(COL.metalLight, 0.3));
    shaft.rotation.z = Math.PI / 2; rotor.add(shaft);
    const n = fins;
    for (let i = 0; i < n; i++) {
      const x = -len / 2 + 0.2 + i * (len - 0.4) / (n - 1);
      const disk = new THREE.Mesh(new THREE.CylinderGeometry(rIn + 0.05, rIn + 0.05, 0.05, 24), this._metal(0x6a7898, 0.35));
      disk.rotation.z = Math.PI / 2; disk.position.x = x; rotor.add(disk);
      // 叶片
      for (let k = 0; k < 6; k++) {
        const blade = new THREE.Mesh(new THREE.BoxGeometry(0.03, rIn * 1.7, 0.07), this._metal(0x8294b8, 0.4));
        blade.position.set(x, 0, 0); blade.rotation.x = k * Math.PI / 3; blade.translateY(rIn * 0.7);
        rotor.add(blade);
      }
    }
    g.add(rotor);
    g.position.set(...pos);
    this.scene.add(g);
    this.spinners.push({ group: rotor, base: 1.0 });
    this._shadow(pos[0], pos[2], rOut + 0.4);
    this._label(cn, en, pos, dy);
  }

  _pump(pos, cn, en) {
    const g = new THREE.Group();
    const body = new THREE.Mesh(new THREE.CylinderGeometry(0.32, 0.4, 0.6, 24), this._metal(COL.steel, 0.4, 0.85));
    body.position.y = 0.3; g.add(body);
    // 叶轮(旋转)
    const imp = new THREE.Group();
    const hub = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.1, 0.16, 16), this._metal(COL.metalLight, 0.3));
    hub.position.y = 0.62; imp.add(hub);
    for (let k = 0; k < 5; k++) {
      const blade = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.26, 0.04), this._metal(0x8294b8, 0.4));
      blade.position.y = 0.62; blade.rotation.y = k * Math.PI / 2.5; blade.translateX(0.13);
      imp.add(blade);
    }
    g.add(imp);
    g.position.set(...pos);
    this.scene.add(g);
    this.spinners.push({ group: imp, base: 2.2 });
    this._shadow(pos[0], pos[2], 0.55);
    this._label(cn, en, pos, 0.75);
  }

  _buildPipes() {
    const tubeMat = (T) => new THREE.MeshStandardMaterial({ color: tempColor(T), emissive: tempColor(T), emissiveIntensity: 0.32, roughness: 0.4, metalness: 0.55 });
    const pGeo = new THREE.SphereGeometry(0.1, 12, 10);
    for (const def of PIPES) {
      const pts = def.pts.map(p => new THREE.Vector3(...p));
      const curve = new THREE.CatmullRomCurve3(pts, false, 'catmullrom', 0.5);
      const len = Math.max(0.5, curve.getLength());
      const tube = new THREE.Mesh(new THREE.TubeGeometry(curve, Math.max(20, Math.round(len * 6)), 0.085, 12, false), tubeMat(500));
      this.scene.add(tube);
      // 粒子
      const parts = [];
      const matP = new THREE.MeshStandardMaterial({ color: 0xffffff, emissive: 0xfff2e0, emissiveIntensity: 1.2, roughness: 0.3 });
      const n = Math.max(3, Math.round(len / 1.1));
      for (let i = 0; i < n; i++) {
        const m = new THREE.Mesh(pGeo, matP.clone());
        const off = i / n;
        const p = curve.getPoint(off); m.position.copy(p);
        this.scene.add(m); parts.push({ mesh: m, off });
      }
      this.pipes.push({ def, curve, len, tubeMat: tube.material, partsMat: parts.map(p => p.mesh.material), parts, speed: 0.06 });
    }
  }

  update(r) {
    this._r = r;
    for (const pipe of this.pipes) {
      const st = r.states[pipe.def.key - 1];
      const col = tempColor(st.T);
      pipe.tubeMat.color.copy(col);
      pipe.tubeMat.emissive.copy(col);
      for (const m of pipe.partsMat) { m.color.copy(col).lerp(new THREE.Color(1, 1, 1), 0.45); m.emissive.copy(col); }
    }
    // 汽轮机/泵转速 ~ 流量
    for (const s of this.spinners) s.base = (s.group.children.length > 6 ? 1.0 : 2.2);
    // 锅炉辉光 ~ 吸热
    const qfac = Math.min(1, Math.max(0.4, r.qin / 3000));
    for (const g of this.glowMats) g.target = g.base * qfac;
  }

  setFlowScale(s) { this.flowScale = s; }
  setAutoRotate(b) { this.autoRotate = b; this.controls.autoRotate = b; }

  _loop(now) {
    this._raf = requestAnimationFrame(this._loop);
    const dt = Math.min(0.05, (now - (this._last || now)) / 1000); this._last = now;
    this._t += dt;
    // 转子旋转
    for (const s of this.spinners) s.group.rotation.x += s.base * this.flowScale * dt * 3.4;
    // 粒子流动
    for (const pipe of this.pipes) {
      const v = pipe.speed * this.flowScale / Math.max(1, pipe.len * 0.18);
      for (const p of pipe.parts) {
        p.off = (p.off + v * dt) % 1;
        pipe.curve.getPoint(p.off, p.mesh.position);
      }
    }
    // 辉光脉动
    for (const g of this.glowMats) {
      const tgt = g.target ?? g.base;
      g.mat.emissiveIntensity = tgt + Math.sin(this._t * 3 + (g.base)) * 0.25;
    }
    this.controls.autoRotateSpeed = 0.4 + this.flowScale * 0.15;
    this.controls.update();
    this.composer.render();
    this.labelRenderer.render(this.scene, this.camera);
  }

  resize() {
    const w = this.container.clientWidth, h = this.container.clientHeight;
    if (!w || !h) return;
    this.camera.aspect = w / h; this.camera.updateProjectionMatrix();
    this.renderer.setSize(w, h);
    this.composer?.setSize(w, h);
    this.labelRenderer.setSize(w, h);
  }

  resetView() {
    this.camera.position.set(9, 6, 10);
    this.controls.target.set(-0.3, 1.4, -0.4);
    this.controls.update();
  }

  dispose() {
    if (this._raf) cancelAnimationFrame(this._raf);
    this.scene.traverse(o => {
      if (o.geometry) o.geometry.dispose?.();
      if (o.material) { const ms = Array.isArray(o.material) ? o.material : [o.material]; ms.forEach(m => m.dispose?.()); }
    });
    this.renderer.dispose();
    if (this.renderer.domElement.parentNode) this.renderer.domElement.parentNode.removeChild(this.renderer.domElement);
    if (this.labelRenderer.domElement.parentNode) this.labelRenderer.domElement.parentNode.removeChild(this.labelRenderer.domElement);
  }
}
