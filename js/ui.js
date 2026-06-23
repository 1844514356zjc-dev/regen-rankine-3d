// 控制器: 参数滑块 -> 循环求解 -> 更新右栏 / 图表 / 3D
import { solveCycle } from './cycle.js';
import { solvePx, phaseLabel, tempColorRGB } from './props.js';
import { TsDiagram, PvDiagram } from './diagrams.js';
import { PlantScene } from './scene3d.js';

const $ = id => document.getElementById(id);
const K = T => T - 273.15;
const clamp = (v, a, b) => Math.max(a, Math.min(b, v));

const state = { Pboil: 15, TinC: 540, Pcond_kPa: 8, Pext: 1.0, etaT: 1, etaP: 1, mflow: 120 };
let scene, ts, pv, pending = false;

/* ---------- 工具 ---------- */
function toast(msg) {
  const t = $('toast'); if (!t) return;
  t.textContent = msg; t.classList.add('show');
  clearTimeout(toast._t); toast._t = setTimeout(() => t.classList.remove('show'), 1900);
}
function setVal(id, txt, unit) {
  const el = $('v_' + id); if (el) el.innerHTML = txt + (unit ? `<span class="u">${unit}</span>` : '');
}
function fill(id) {
  const s = $('s_' + id); if (!s) return;
  const pct = (s.value - s.min) / (s.max - s.min) * 100;
  s.style.setProperty('--p', pct + '%');
}
function setMetric(id, val, unit, frac) {
  const v = $('v_' + id); if (v) v.innerHTML = val + (unit ? `<span class="u">${unit}</span>` : '');
  const bar = $('m_' + id)?.querySelector('.bar');
  if (bar && frac != null) bar.style.width = clamp(frac * 100, 3, 100) + '%';
}

/* ---------- 参数夹紧 ---------- */
function clampParams() {
  let note = '';
  state.Pboil = clamp(state.Pboil, 1, 21);
  const pextMin = (state.Pcond_kPa / 1000) * 2 + 0.03;
  const pextMax = state.Pboil * 0.72;
  if (state.Pext < pextMin) { state.Pext = +pextMin.toFixed(3); note = '抽汽压力已自动调高(须高于冷凝压力)'; }
  if (state.Pext > pextMax) { state.Pext = +pextMax.toFixed(3); note = '抽汽压力已自动调低(须低于锅炉压力)'; }
  const TsatC = K(solvePx(state.Pboil, 0).temperature);
  if (state.TinC < TsatC + 25) { state.TinC = Math.round(TsatC + 25); note = '汽轮机入口须为过热蒸汽,温度已上调'; }
  if (note) toast(note);
  return TsatC;
}

function readSliders() {
  state.Pboil = +$('s_pboil').value;
  state.TinC = +$('s_tin').value;
  state.Pcond_kPa = +$('s_pcond').value;
  state.Pext = +$('s_pext').value;
  state.etaT = +$('s_etat').value;
  state.etaP = +$('s_etap').value;
  state.mflow = +$('s_mflow').value;
}
function syncDisplays(TsatC) {
  setVal('pboil', state.Pboil.toFixed(2), 'MPa');
  setVal('tin', state.TinC.toFixed(0), '°C');
  setVal('pcond', state.Pcond_kPa.toFixed(1), 'kPa');
  setVal('pext', state.Pext.toFixed(2), 'MPa');
  setVal('etat', (state.etaT * 100).toFixed(0), '%');
  setVal('etap', (state.etaP * 100).toFixed(0), '%');
  setVal('mflow', state.mflow.toFixed(0), 'kg/s');
  $('s_pext').value = state.Pext; $('s_tin').value = state.TinC;
  ['pboil', 'tin', 'pcond', 'pext', 'etat', 'etap', 'mflow'].forEach(fill);
  $('tin_sat').textContent = `当前饱和温度 ${TsatC.toFixed(0)} °C`;
}

/* ---------- 渲染右栏 ---------- */
function render(r) {
  const power = r.wnet * state.mflow / 1000; // MW
  setMetric('eta', (r.eta * 100).toFixed(2), '%', r.eta / 0.62);
  setMetric('qin', r.qin.toFixed(0), 'kJ/kg', r.qin / 3600);
  setMetric('qout', r.qout.toFixed(0), 'kJ/kg', r.qout / 3600);
  setMetric('wt', r.wt.toFixed(0), 'kJ/kg', r.wt / 1500);
  setMetric('wp', r.wp.toFixed(1), 'kJ/kg', r.wp / 30);
  setMetric('wnet', r.wnet.toFixed(0), 'kJ/kg', r.wnet / 1500);
  setMetric('y', (r.y * 100).toFixed(1), '%', r.y / 0.4);
  setMetric('power', power.toFixed(1), 'MW', power / 300);

  // 对比条
  const max = r.carnot || r.eta;
  const setBar = (id, n, v) => {
    $(id).style.width = (v / max * 100) + '%';
    $(n).textContent = (v * 100).toFixed(2) + '%';
  };
  setBar('cmp_regen', 'n_regen', r.eta);
  setBar('cmp_basic', 'n_basic', r.etaBasic);
  $('cmp_carnot').style.width = '100%';
  $('n_carnot').textContent = (r.carnot * 100).toFixed(2) + '%';
  const imp = (r.eta - r.etaBasic) * 100;
  $('cmp_note').textContent = `回热使热效率提升 ${imp.toFixed(2)} 个百分点`;

  // 状态点表
  const tb = $('stateTable');
  tb.innerHTML = r.states.map(s => {
    const x = s.x == null ? '—' : (s.x <= 0.001 ? '0 (饱液)' : s.x >= 0.999 ? '1 (饱汽)' : `<span class="x-wet">${s.x.toFixed(3)}</span>`);
    const P = s.P < 0.1 ? (s.P * 1000).toFixed(1) + ' kPa' : s.P.toFixed(3) + ' MPa';
    const ptColor = '#' + pointHex(s.T);
    return `<tr>
      <td><span class="pt" style="background:${ptColor}">${s.i}</span></td>
      <td>${P}</td>
      <td>${K(s.T).toFixed(1)}</td>
      <td>${s.h.toFixed(1)}</td>
      <td>${s.s.toFixed(3)}</td>
      <td>${x}</td></tr>`;
  }).join('');
}

function pointHex(T) {
  const [r, g, b] = tempColorRGB(T);
  const to = x => Math.round(clamp(x, 0, 1) * 255).toString(16).padStart(2, '0');
  return to(r) + to(g) + to(b);
}

/* ---------- 主刷新 ---------- */
function refresh() {
  pending = false;
  readSliders();
  const TsatC = clampParams();
  syncDisplays(TsatC);
  const r = solveCycle({
    Pboil: state.Pboil, Tin: state.TinC + 273.15,
    Pext: state.Pext, Pcond: state.Pcond_kPa / 1000,
    etaT: state.etaT, etaP: state.etaP,
  });
  render(r);
  ts.draw(r); pv.draw(r);
  scene.update(r);
  scene.setFlowScale(clamp(state.mflow / 120, 0.15, 4));
}
function schedule() { if (!pending) { pending = true; requestAnimationFrame(refresh); } }

/* ---------- 预设 ---------- */
const PRESETS = {
  classic: { Pboil: 6, TinC: 480, Pcond_kPa: 8, Pext: 0.5, etaT: 1, etaP: 1 },
  high: { Pboil: 15, TinC: 540, Pcond_kPa: 8, Pext: 1.0, etaT: 1, etaP: 1 },
  ultra: { Pboil: 16.5, TinC: 555, Pcond_kPa: 5, Pext: 2.0, etaT: 1, etaP: 1 },
  real: { Pboil: 16, TinC: 535, Pcond_kPa: 7, Pext: 1.2, etaT: 0.88, etaP: 0.85 },
};
function applyPreset(key) {
  const p = PRESETS[key]; if (!p) return;
  Object.assign(state, p);
  $('s_pboil').value = p.Pboil; $('s_tin').value = p.TinC; $('s_pcond').value = p.Pcond_kPa;
  $('s_pext').value = p.Pext; $('s_etat').value = p.etaT; $('s_etap').value = p.etaP;
  document.querySelectorAll('.preset').forEach(b => b.classList.toggle('active', b.dataset.preset === key));
  refresh();
}

/* ---------- 初始化 ---------- */
export function init() {
  scene = new PlantScene($('scene3d'), $('labels3d'));
  ts = new TsDiagram($('tsCanvas'));
  pv = new PvDiagram($('pvCanvas'));

  ['pboil', 'tin', 'pcond', 'pext', 'etat', 'etap', 'mflow'].forEach(id => {
    $('s_' + id).addEventListener('input', schedule);
  });
  document.querySelectorAll('.preset').forEach(b => b.addEventListener('click', () => applyPreset(b.dataset.preset)));
  $('cb_rotate')?.addEventListener('change', e => scene.setAutoRotate(e.target.checked));
  $('btn_reset')?.addEventListener('click', () => scene.resetView());
  $('btn_def')?.addEventListener('click', () => applyPreset('high'));

  let rt;
  window.addEventListener('resize', () => {
    clearTimeout(rt); rt = setTimeout(() => { scene.resize(); ts.resize(); pv.resize(); refresh(); }, 120);
  });

  applyPreset('high');
}

// 状态点相态 (表格用) —— 备用导出
export { phaseLabel };
