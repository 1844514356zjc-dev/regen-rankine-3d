// T-s 图与 P-v 图绘制 (Canvas 2D)
import { solvePT, solvePx, CRIT } from './props.js';

const K2C = T => T - 273.15;
const clamp = (v, a, b) => Math.max(a, Math.min(b, v));

/* ---------- 饱和曲线 (缓存) ---------- */
let _dome = null;
export function getDome() {
  if (_dome) return _dome;
  const N = 64;
  const lpMin = Math.log10(CRIT.Pt), lpMax = Math.log10(0.9994 * CRIT.P);
  const liq = [], vap = [];
  for (let i = 0; i <= N; i++) {
    const P = Math.pow(10, lpMin + (lpMax - lpMin) * i / N);
    try {
      const f = solvePx(P, 0), g = solvePx(P, 1);
      liq.push({ P, T: f.temperature, s: f.entropy, v: f.specificVolume });
      vap.push({ P, T: g.temperature, s: g.entropy, v: g.specificVolume });
    } catch (e) { /* skip */ }
  }
  _dome = { liq, vap };
  return _dome;
}

/* ---------- 画布基类 ---------- */
class CanvasBase {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.pad = { l: 42, r: 12, t: 12, b: 30 };
    this.resize();
  }
  resize() {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const rect = this.canvas.getBoundingClientRect();
    const w = Math.max(rect.width, 220), h = Math.max(rect.height, 150);
    this.canvas.width = w * dpr; this.canvas.height = h * dpr;
    this.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    this.W = w; this.H = h;
    this.plot = { x: this.pad.l, y: this.pad.t, w: w - this.pad.l - this.pad.r, h: h - this.pad.t - this.pad.b };
  }
  clear() { this.ctx.clearRect(0, 0, this.W, this.H); }
  font(s, w = 400) { this.ctx.font = `${w} ${s}px 'SF Mono',ui-monospace,Menlo,Consolas,monospace`; }
  text(str, x, y, c, s = 10, w = 400, align = 'center') {
    this.ctx.fillStyle = c; this.font(s, w); this.ctx.textAlign = align; this.ctx.textBaseline = 'middle';
    this.ctx.fillText(str, x, y);
  }
  frame() {
    const c = this.ctx, p = this.plot;
    c.fillStyle = '#0a1120'; c.fillRect(p.x, p.y, p.w, p.h);
    c.strokeStyle = '#283860'; c.lineWidth = 1;
    c.strokeRect(p.x + 0.5, p.y + 0.5, p.w, p.h);
  }
}

/* ---------- 等压线采样 (T-s 用) ---------- */
function isobarTs(P, TminK, TmaxK) {
  const pts = [];
  let Tsat;
  try { Tsat = solvePx(P, 0).temperature; } catch { return pts; }
  const Tlo = Math.max(TminK, CRIT.Tt), Thi = Math.min(TmaxK, Tsat);
  // 液体段
  for (let T = Tlo; T <= Thi + 1e-6; T += (Thi - Tlo) / 14) {
    try { const s = solvePT(P, T).entropy; pts.push({ s, T }); } catch { }
  }
  // 饱和点
  try {
    const f = solvePx(P, 0), g = solvePx(P, 1);
    pts.push({ s: f.entropy, T: f.temperature });
    pts.push({ s: g.entropy, T: g.temperature });
  } catch { }
  // 过热段
  const Ts2 = Math.max(Tsat + 0.02, Tsat), Te = TmaxK;
  for (let T = Ts2; T <= Te + 1e-6; T += (Te - Ts2) / 18) {
    try { const s = solvePT(P, T).entropy; pts.push({ s, T }); } catch { }
  }
  return pts;
}

/* ============================================================
   T-s 图
============================================================ */
export class TsDiagram extends CanvasBase {
  constructor(canvas) { super(canvas); }
  draw(r) {
    const c = this.ctx, p = this.plot;
    this.clear();
    this.frame();

    const st = r.states;
    const dome = getDome();
    const sMaxDome = Math.max(...dome.vap.map(d => d.s));
    const sMax = Math.ceil(Math.max(sMaxDome, ...st.map(s => s.s)) + 0.4);
    const sMin = 0;
    const TCmax = Math.ceil(K2C(Math.max(r.params.Tin, CRIT.T) + 40) / 50) * 50;
    const TCmin = 0;
    const sx = s => p.x + (s - sMin) / (sMax - sMin) * p.w;
    const yy = TC => p.y + p.h - (TC - TCmin) / (TCmax - TCmin) * p.h;
    const Py = T => yy(K2C(T));

    // 网格 + 刻度
    c.strokeStyle = 'rgba(40,56,96,.5)'; c.lineWidth = 1; c.fillStyle = '#5e6e96';
    for (let s = 1; s < sMax; s++) {
      c.beginPath(); c.moveTo(sx(s), p.y); c.lineTo(sx(s), p.y + p.h); c.stroke();
      this.text(s, sx(s), p.y + p.h + 14, '#5e6e96', 9.5);
    }
    for (let tc = 0; tc <= TCmax; tc += TCmax >= 600 ? 200 : 100) {
      c.beginPath(); c.moveTo(p.x, yy(tc)); c.lineTo(p.x + p.w, yy(tc)); c.stroke();
      this.text(tc, p.x - 7, yy(tc), '#5e6e96', 9.5, 400, 'right');
    }
    // 轴标题
    this.text('比熵 s  [kJ/(kg·K)]', p.x + p.w / 2, this.H - 9, '#8c9bc4', 10, 600);
    this.ctx.save();
    this.ctx.translate(12, p.y + p.h / 2); this.ctx.rotate(-Math.PI / 2);
    this.text('温度 T  [°C]', 0, 0, '#8c9bc4', 10, 600);
    this.ctx.restore();

    // 饱和曲线
    const drawLine = (arr, color, lw, dash) => {
      c.strokeStyle = color; c.lineWidth = lw; c.setLineDash(dash || []);
      c.beginPath();
      arr.forEach((d, i) => { const X = sx(d.s), Y = Py(d.T); i ? c.lineTo(X, Y) : c.moveTo(X, Y); });
      c.stroke(); c.setLineDash([]);
    };
    drawLine(dome.liq, '#56688f', 1.4);
    drawLine(dome.vap, '#56688f', 1.4);
    // 临界点
    const cr = dome.liq[dome.liq.length - 1];
    if (cr) { c.fillStyle = '#8c9bc4'; c.beginPath(); c.arc(sx(cr.s), Py(cr.T), 2.5, 0, 7); c.fill(); }

    // 等压线 (淡)
    [r.params.Pboil, r.params.Pext, r.params.Pcond].forEach((P, idx) => {
      const iso = isobarTs(P, CRIT.Tt, r.params.Tin + 20);
      c.strokeStyle = idx === 0 ? 'rgba(255,122,60,.32)' : idx === 1 ? 'rgba(140,170,220,.28)' : 'rgba(58,160,255,.32)';
      c.lineWidth = 1; c.setLineDash([4, 3]);
      c.beginPath();
      iso.forEach((d, i) => { const X = sx(d.s), Y = Py(d.T); i ? c.lineTo(X, Y) : c.moveTo(X, Y); });
      c.stroke(); c.setLineDash([]);
    });

    // 过程折线构建
    const line = (a, b) => { c.beginPath(); c.moveTo(sx(a.s), Py(a.T)); c.lineTo(sx(b.s), Py(b.T)); c.stroke(); };
    const path = (arr, color, lw, dash) => {
      c.strokeStyle = color; c.lineWidth = lw; c.setLineDash(dash || []); c.beginPath();
      arr.forEach((d, i) => { const X = sx(d.s), Y = Py(d.T); i ? c.lineTo(X, Y) : c.moveTo(X, Y); });
      c.stroke(); c.setLineDash([]);
    };
    const S = i => st[i - 1];
    const P = r.params;

    // 锅炉加热路径 4->5 (等压), 用于绘制与吸热阴影
    const boilPts = [];
    const T4 = S(4).T, T5 = S(5).T, Tb = r.Tsat.boil;
    for (let T = T4; T <= Tb - 0.01; T += (Tb - T4) / 10) boilPts.push({ s: solvePT(P.Pboil, T).entropy, T });
    const fb = solvePx(P.Pboil, 0), gb = solvePx(P.Pboil, 1);
    boilPts.push({ s: fb.entropy, T: fb.temperature });
    boilPts.push({ s: gb.entropy, T: gb.temperature });
    for (let T = Tb + 0.02; T <= T5; T += (T5 - Tb) / 12) boilPts.push({ s: solvePT(P.Pboil, T).entropy, T });
    boilPts.push({ s: S(5).s, T: S(5).T });

    // 加热器给水加热路径 2->3 (等压 Pext)
    const fwhPts = [];
    const T2 = S(2).T, Te = r.Tsat.ext;
    fwhPts.push({ s: S(2).s, T: S(2).T });
    for (let T = T2 + (Te - T2) / 8; T <= Te - 0.01; T += (Te - T2) / 8) fwhPts.push({ s: solvePT(P.Pext, T).entropy, T });
    fwhPts.push({ s: S(3).s, T: S(3).T });

    // 吸热阴影 (锅炉曲线下方至绘图底边)
    c.fillStyle = 'rgba(255,90,60,.10)';
    c.beginPath();
    boilPts.forEach((d, i) => { const X = sx(d.s), Y = Py(d.T); i ? c.lineTo(X, Y) : c.moveTo(X, Y); });
    c.lineTo(sx(boilPts[boilPts.length - 1].s), p.y + p.h);
    c.lineTo(sx(boilPts[0].s), p.y + p.h);
    c.closePath(); c.fill();

    // 放热阴影 (冷凝器 7->1 下方)
    c.fillStyle = 'rgba(58,160,255,.12)';
    c.beginPath();
    c.moveTo(sx(S(7).s), Py(S(7).T));
    c.lineTo(sx(S(1).s), Py(S(1).T));
    c.lineTo(sx(S(1).s), p.y + p.h);
    c.lineTo(sx(S(7).s), p.y + p.h);
    c.closePath(); c.fill();

    // 过程线
    path(boilPts, '#ff7a3c', 2.3);              // 4->5 锅炉
    line(S(5), S(6));                            // 汽轮机一级
    line(S(6), S(7));                            // 汽轮机二级
    c.strokeStyle = '#3aa0ff'; c.lineWidth = 2.3; line(S(7), S(1)); // 冷凝器
    line(S(1), S(2));                            // 泵①
    path(fwhPts, '#7c8fb6', 1.8);                // 2->3 加热器
    line(S(3), S(4));                            // 泵②
    // 主路径覆盖(汽轮机/泵)统一色
    c.strokeStyle = '#4d9bff'; c.lineWidth = 2;
    line(S(5), S(6)); line(S(6), S(7));
    line(S(1), S(2)); line(S(3), S(4));

    // 状态点
    st.forEach(s => {
      const rgb = tempHex(s.T);
      c.fillStyle = rgb; c.strokeStyle = '#eaf2ff'; c.lineWidth = 1.5;
      c.beginPath(); c.arc(sx(s.s), Py(s.T), 5.5, 0, 7); c.fill(); c.stroke();
      c.fillStyle = '#06101f'; this.font(8.5, 700); c.textAlign = 'center'; c.textBaseline = 'middle';
      c.fillText(s.i, sx(s.s), Py(s.T));
    });

    // 角标
    this.text(`qᵢₙ (吸热) ${(r.qin).toFixed(0)} kJ/kg`, p.x + 8, p.y + 9, '#ff8a6c', 9.5, 600, 'left');
    this.text(`qₒᵤₜ (放热) ${(r.qout).toFixed(0)} kJ/kg`, p.x + 8, p.y + 22, '#6cb2ff', 9.5, 600, 'left');
    this.text('饱和线', sx(cr ? cr.s : 6) + 8, Py(cr ? cr.T : 600) - 6, '#7e8fb6', 9, 400, 'left');
  }
}

/* ============================================================
   P-v 图 (log-log)
============================================================ */
export class PvDiagram extends CanvasBase {
  constructor(canvas) { super(canvas); }
  draw(r) {
    const c = this.ctx, p = this.plot;
    this.clear(); this.frame();

    const st = r.states;
    const dome = getDome();
    const lvMin = Math.log10(0.0008);
    const lvMax = Math.ceil(Math.max(...dome.vap.map(d => Math.log10(d.v)), ...st.map(s => Math.log10(Math.max(s.v, 1e-5)))) + 0.2);
    const lpMin = Math.floor(Math.log10(r.params.Pcond * 0.6) - 0.1);
    const lpMax = Math.ceil(Math.log10(r.params.Pboil * 1.4) + 0.1);
    const xv = lv => p.x + (lv - lvMin) / (lvMax - lvMin) * p.w;
    const yp = lp => p.y + p.h - (lp - lpMin) / (lpMax - lpMin) * p.h;
    const X = v => xv(Math.log10(Math.max(v, 1e-6)));
    const Y = P => yp(Math.log10(P));

    // 网格 + 刻度
    c.strokeStyle = 'rgba(40,56,96,.5)'; c.fillStyle = '#5e6e96';
    for (let k = Math.ceil(lvMin); k <= lvMax; k++) {
      c.beginPath(); c.moveTo(xv(k), p.y); c.lineTo(xv(k), p.y + p.h); c.stroke();
      this.text(`10${sup(k)}`, xv(k), p.y + p.h + 14, '#5e6e96', 9);
    }
    for (let k = lpMin; k <= lpMax; k++) {
      c.beginPath(); c.moveTo(p.x, yp(k)); c.lineTo(p.x + p.w, yp(k)); c.stroke();
      this.text(`${Math.pow(10, k)}`, p.x - 7, yp(k), '#5e6e96', 9, 400, 'right');
    }
    this.text('比容 v  [m³/kg] (log)', p.x + p.w / 2, this.H - 9, '#8c9bc4', 10, 600);
    this.ctx.save(); this.ctx.translate(12, p.y + p.h / 2); this.ctx.rotate(-Math.PI / 2);
    this.text('压力 P  [MPa] (log)', 0, 0, '#8c9bc4', 10, 600); this.ctx.restore();

    // 等压线 (水平参考)
    [r.params.Pboil, r.params.Pext, r.params.Pcond].forEach((P, idx) => {
      c.strokeStyle = idx === 0 ? 'rgba(255,122,60,.30)' : idx === 1 ? 'rgba(140,170,220,.26)' : 'rgba(58,160,255,.30)';
      c.lineWidth = 1; c.setLineDash([4, 3]);
      c.beginPath(); c.moveTo(p.x, Y(P)); c.lineTo(p.x + p.w, Y(P)); c.stroke(); c.setLineDash([]);
      this.text(`P=${P < 0.1 ? (P * 1000).toFixed(0) + 'kPa' : P.toFixed(2) + 'MPa'}`, p.x + p.w - 4, Y(P) - 6,
        idx === 0 ? '#ff8a6c' : idx === 2 ? '#6cb2ff' : '#8c9bc4', 8.5, 600, 'right');
    });

    // 饱和曲线 (P-v)
    const drawDome = (arr) => {
      c.strokeStyle = '#56688f'; c.lineWidth = 1.4; c.beginPath();
      arr.forEach((d, i) => { const px = X(d.v), py = Y(d.P); i ? c.lineTo(px, py) : c.moveTo(px, py); });
      c.stroke();
    };
    drawDome(dome.liq); drawDome(dome.vap);

    const S = i => st[i - 1];
    const line = (a, b, color, lw) => {
      c.strokeStyle = color; c.lineWidth = lw; c.beginPath();
      c.moveTo(X(a.v), Y(a.P)); c.lineTo(X(b.v), Y(b.P)); c.stroke();
    };
    // 4->5 锅炉 (等压水平)
    line(S(4), S(5), '#ff7a3c', 2.3);
    // 汽轮机
    line(S(5), S(6), '#4d9bff', 2); line(S(6), S(7), '#4d9bff', 2);
    // 冷凝器
    line(S(7), S(1), '#3aa0ff', 2.3);
    // 泵
    line(S(1), S(2), '#7c8fb6', 1.8); line(S(3), S(4), '#7c8fb6', 1.8);
    // 加热器混合 2->3
    line(S(2), S(3), '#7c8fb6', 1.8);

    // 状态点
    st.forEach(s => {
      const rgb = tempHex(s.T);
      c.fillStyle = rgb; c.strokeStyle = '#eaf2ff'; c.lineWidth = 1.5;
      c.beginPath(); c.arc(X(s.v), Y(s.P), 5.5, 0, 7); c.fill(); c.stroke();
      c.fillStyle = '#06101f'; this.font(8.5, 700); c.textAlign = 'center'; c.textBaseline = 'middle';
      c.fillText(s.i, X(s.v), Y(s.P));
    });
  }
}

/* ---------- 工具 ---------- */
function sup(k) { return k < 0 ? '⁻' + String(Math.abs(k)).split('').map(d => '⁰¹²³⁴⁵⁶⁷⁸⁹'[d]).join('') : String(k).split('').map(d => '⁰¹²³⁴⁵⁶⁷⁸⁹'[d]).join(''); }
function tempHex(T) {
  const t = clamp((T - 300) / (840 - 300), 0, 1);
  const h = (1 - t) * 0.6;
  return '#' + hsl2hex(h, 0.85, 0.58);
}
function hsl2hex(h, s, l) {
  const q = l < 0.5 ? l * (1 + s) : l + s - l * s, p = 2 * l - q;
  const f = t => { if (t < 0) t += 1; if (t > 1) t -= 1; if (t < 1 / 6) return p + (q - p) * 6 * t; if (t < 0.5) return q; if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6; return p; };
  const to = x => Math.round(clamp(x, 0, 1) * 255).toString(16).padStart(2, '0');
  return to(f(h + 1 / 3)) + to(f(h)) + to(f(h - 1 / 3));
}
