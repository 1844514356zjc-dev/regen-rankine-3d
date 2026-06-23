/**
 * IAPWS-IF97 Backward Equations: P-S → T, v
 *
 * Reference: IAPWS-IF97 Supplementary Release on Backward Equations
 */
import type { BasicProperties } from '../types.js';
/**
 * Solve for thermodynamic state given P and S.
 * @param p - Pressure [MPa]
 * @param s - Specific entropy [kJ/(kg·K)]
 */
export declare function solvePS(p: number, s: number): BasicProperties;
//# sourceMappingURL=ps.d.ts.map