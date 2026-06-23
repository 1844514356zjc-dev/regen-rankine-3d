/**
 * IAPWS-IF97 Region 1: Subcooled Liquid
 *
 * Basic equation for the specific Gibbs free energy γ(π,τ)
 * Valid for: 273.15 K ≤ T ≤ 623.15 K, Psat(T) ≤ P ≤ 100 MPa
 *
 * Reference: IAPWS-IF97, Section 5 (Equations for Region 1)
 */
import type { BasicProperties } from '../types.js';
/**
 * Compute Region 1 thermodynamic properties from pressure and temperature.
 *
 * @param p - Pressure [MPa]
 * @param T - Temperature [K]
 * @returns Basic thermodynamic properties
 */
export declare function region1(p: number, T: number): BasicProperties;
//# sourceMappingURL=region1.d.ts.map