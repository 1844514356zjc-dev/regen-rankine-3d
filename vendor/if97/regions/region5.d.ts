/**
 * IAPWS-IF97 Region 5: High-Temperature Steam
 *
 * Basic equation for the specific Gibbs free energy γ(π,τ) = γ°(π,τ) + γʳ(π,τ)
 * Valid for: 1073.15 K < T ≤ 2273.15 K, P ≤ 50 MPa
 *
 * Reference: IAPWS-IF97, Section 9 (Equations for Region 5)
 */
import type { BasicProperties } from '../types.js';
/**
 * Compute Region 5 thermodynamic properties from pressure and temperature.
 *
 * @param p - Pressure [MPa]
 * @param T - Temperature [K]
 * @returns Basic thermodynamic properties
 */
export declare function region5(p: number, T: number): BasicProperties;
//# sourceMappingURL=region5.d.ts.map