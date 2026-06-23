/**
 * IAPWS-IF97 Backward Equations: P-H → T, v
 *
 * Given pressure and specific enthalpy, compute temperature (and volume for R3).
 * Uses backward equations for initial guess + Newton-Raphson refinement.
 *
 * Reference: IAPWS-IF97 Supplementary Release on Backward Equations
 */
import type { BasicProperties } from '../types.js';
export declare function b2bc_H_P(h: number): number;
/** B3ab boundary: P → H */
export declare function b3ab_P_to_H(p: number): number;
/** R4: enthalpy → saturation pressure for PH boundary detection */
export declare function r4EnthalpyToPsat(h: number): number;
/**
 * Solve for thermodynamic state given P and H.
 * @param p - Pressure [MPa]
 * @param h - Specific enthalpy [kJ/kg]
 */
export declare function solvePH(p: number, h: number): BasicProperties;
//# sourceMappingURL=ph.d.ts.map