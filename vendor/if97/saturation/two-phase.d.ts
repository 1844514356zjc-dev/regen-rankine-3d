/**
 * IAPWS-IF97 Two-Phase Saturation Solvers
 *
 * Compute thermodynamic state given pressure+quality (solvePx)
 * or temperature+quality (solveTx).
 *
 * Reference: IAPWS-IF97, Region 4 (Saturation Line)
 */
import type { BasicProperties } from '../types.js';
/**
 * Solve for thermodynamic state given pressure and vapour quality.
 * @param p - Pressure [MPa], Pt <= p <= Pc
 * @param x - Vapour quality [0, 1]
 */
export declare function solvePx(p: number, x: number): BasicProperties;
/**
 * Solve for thermodynamic state given temperature and vapour quality.
 * @param T - Temperature [K], T_MIN <= T <= Tc
 * @param x - Vapour quality [0, 1]
 */
export declare function solveTx(T: number, x: number): BasicProperties;
//# sourceMappingURL=two-phase.d.ts.map