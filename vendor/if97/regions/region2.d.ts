/**
 * IAPWS-IF97 Region 2: Superheated Steam
 *
 * Basic equation for the specific Gibbs free energy γ(π,τ) = γ°(π,τ) + γʳ(π,τ)
 * Valid for: 273.15 K ≤ T ≤ 623.15 K at Psat(T), and T ≤ 1073.15 K at P ≤ 100 MPa
 *
 * Reference: IAPWS-IF97, Section 6 (Equations for Region 2)
 */
import type { BasicProperties } from '../types.js';
/**
 * Compute Region 2 thermodynamic properties from pressure and temperature.
 *
 * @param p - Pressure [MPa]
 * @param T - Temperature [K]
 * @returns Basic thermodynamic properties
 */
export declare function region2(p: number, T: number): BasicProperties;
//# sourceMappingURL=region2.d.ts.map