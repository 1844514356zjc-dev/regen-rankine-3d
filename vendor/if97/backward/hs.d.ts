/**
 * IAPWS-IF97 Backward Equations: H-S -> P, T
 *
 * Given specific enthalpy and entropy, compute pressure and temperature.
 * Uses backward P(h,s) equations for initial guess + Nelder-Mead refinement.
 *
 * Reference: IAPWS-IF97 Supplementary Release on Backward Equations p(h,s)
 */
import type { BasicProperties } from '../types.js';
/**
 * Solve for thermodynamic state given H and S.
 * @param h - Specific enthalpy [kJ/kg]
 * @param s - Specific entropy [kJ/(kg·K)]
 */
export declare function solveHS(h: number, s: number): BasicProperties;
//# sourceMappingURL=hs.d.ts.map