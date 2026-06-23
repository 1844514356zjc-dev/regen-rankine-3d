// 一级回热朗肯循环求解 (开式/混合式给水加热器, 单级抽汽)
// 状态点:
//   1 冷凝器出口(饱和液体)  2 给水泵①出口  3 加热器出口(饱和液体)
//   4 给水泵②出口           5 锅炉出口/汽轮机入口(过热)  6 抽汽口  7 汽轮机排汽
import { solvePT, solvePS, solvePH, solvePx } from '../vendor/if97/index.js';

const NAMES = [
  '冷凝器出口', '给水泵①出口', '加热器出口', '给水泵②出口',
  '锅炉出口 / 汽轮机入口', '抽汽口(一级后)', '汽轮机排汽',
];

export function solveCycle(p) {
  const { Pboil, Tin, Pext, Pcond } = p;
  const etaT = p.etaT ?? 1, etaP = p.etaP ?? 1;

  // —— 主回热循环 ——
  const s1 = solvePx(Pcond, 0);                                  // 1
  const s2s = solvePS(Pext, s1.entropy);
  const h2 = s1.enthalpy + (s2s.enthalpy - s1.enthalpy) / etaP;  // 泵①(实际)
  const s2 = solvePH(Pext, h2);                                  // 2
  const s3 = solvePx(Pext, 0);                                   // 3
  const s4s = solvePS(Pboil, s3.entropy);
  const h4 = s3.enthalpy + (s4s.enthalpy - s3.enthalpy) / etaP;  // 泵②(实际)
  const s4 = solvePH(Pboil, h4);                                 // 4
  const s5 = solvePT(Pboil, Tin);                                // 5
  const s6s = solvePS(Pext, s5.entropy);
  const h6 = s5.enthalpy - etaT * (s5.enthalpy - s6s.enthalpy);  // 汽轮机一级(实际)
  const s6 = solvePH(Pext, h6);                                  // 6
  const s7s = solvePS(Pcond, s6.entropy);
  const h7 = s6.enthalpy - etaT * (s6.enthalpy - s7s.enthalpy);  // 汽轮机二级(实际)
  const s7 = solvePH(Pcond, h7);                                 // 7

  const states = [s1, s2, s3, s4, s5, s6, s7].map((st, i) => ({
    i: i + 1, name: NAMES[i],
    P: st.pressure, T: st.temperature,
    h: st.enthalpy, s: st.entropy, v: st.specificVolume,
    x: st.quality,
  }));

  const h1 = s1.enthalpy, h3 = s3.enthalpy, h5 = s5.enthalpy;
  const y = (h3 - h2) / (h6 - h2);                 // 抽汽率
  const wt = (h5 - h6) + (1 - y) * (h6 - h7);      // 汽轮机做功
  const wp = (1 - y) * (h2 - h1) + (h4 - h3);      // 泵耗功
  const qin = h5 - h4;                             // 锅炉吸热
  const qout = (1 - y) * (h7 - h1);                // 冷凝器放热
  const wnet = wt - wp;
  const eta = wnet / qin;

  // —— 无回热(基本朗肯)对比 ——
  const sB2s = solvePS(Pboil, s1.entropy);
  const hB2 = s1.enthalpy + (sB2s.enthalpy - s1.enthalpy) / etaP;
  const sB7s = solvePS(Pcond, s5.entropy);
  const hB7 = s5.enthalpy - etaT * (s5.enthalpy - sB7s.enthalpy);
  const etaBasic = ((s5.enthalpy - hB7) - (hB2 - s1.enthalpy)) / (s5.enthalpy - hB2);

  const carnot = 1 - s1.temperature / Tin;

  return {
    params: { Pboil, Tin, Pext, Pcond, etaT, etaP },
    states, y, wt, wp, wnet, qin, qout, eta, etaBasic, carnot,
    Tsat: {
      boil: solvePx(Pboil, 0).temperature,
      ext: solvePx(Pext, 0).temperature,
      cond: solvePx(Pcond, 0).temperature,
    },
  };
}
