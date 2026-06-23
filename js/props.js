// 水蒸气物性封装 (基于 vendored IAPWS-IF97)
// 单位约定: P[MPa]  T[K]  h[kJ/kg]  s[kJ/(kg·K)]  v[m³/kg]
import { solvePT, solvePS, solvePH, solvePx } from '../vendor/if97/index.js';

export { solvePT, solvePS, solvePH, solvePx };

// 临界点 / 三相点 (IF97)
export const CRIT = { T: 647.096, P: 22.064, Tt: 273.16, Pt: 0.000611 };

// 饱和性质 (给定压力)
export function satProps(P) {
  const f = solvePx(P, 0);
  const g = solvePx(P, 1);
  return {
    Tsat: f.temperature,
    hf: f.enthalpy, hg: g.enthalpy,
    sf: f.entropy, sg: g.entropy,
    vf: f.specificVolume, vg: g.specificVolume,
  };
}

// 状态点相态标签
export function phaseLabel(st) {
  const x = st.x;
  if (x !== null && x !== undefined) {
    if (x >= 0.999) return '饱和蒸汽';
    if (x <= 0.001) return '饱和液体';
    return `湿蒸汽 x=${x.toFixed(3)}`;
  }
  let Tsat;
  try { Tsat = solvePx(st.P, 0).temperature; } catch { return '—'; }
  return st.T > Tsat + 0.05 ? '过热蒸汽' : '过冷水';
}

// 按温度返回流动颜色 (T 单位 K), 用于 3D 管道着色
// 冷(蓝) -> 青 -> 绿 -> 黄 -> 红(热)
export function tempColorRGB(T, Tlo = 300, Thi = 840) {
  const t = Math.max(0, Math.min(1, (T - Tlo) / (Thi - Tlo)));
  const hue = (1 - t) * 0.60;        // 0.60(蓝) -> 0(红)
  return hslToRgb(hue, 0.85, 0.55);
}
function hslToRgb(h, s, l) {
  let r, g, b;
  if (s === 0) { r = g = b = l; }
  else {
    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;
    [r, g, b] = [h + 1 / 3, h, h - 1 / 3].map(t => {
      if (t < 0) t += 1; if (t > 1) t -= 1;
      if (t < 1 / 6) return p + (q - p) * 6 * t;
      if (t < 0.5) return q;
      if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
      return p;
    });
  }
  return [r, g, b];
}
