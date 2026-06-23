/**
 * IAPWS-IF97 Region 3: Supercritical Fluid
 *
 * Basic equation for the specific Helmholtz free energy φ(δ,τ)
 * Valid for: 623.15 K ≤ T ≤ T_B23(P), P_B23(T) ≤ P ≤ 100 MPa
 *
 * Reference: IAPWS-IF97, Section 7 (Equations for Region 3)
 */
import type { BasicProperties } from '../types.js';
/**
 * Compute Region 3 thermodynamic properties from density and temperature.
 *
 * Low-level Region 3 equation entry point. Callers must provide a finite,
 * strictly positive density because the Helmholtz formulation contains ln(ρ).
 *
 * @param rho - Density [kg/m³], must be > 0
 * @param T   - Temperature [K]
 * @returns Basic thermodynamic properties
 * @throws {IF97Error} if rho is non-finite or not strictly positive
 */
export declare function region3ByRhoT(rho: number, T: number): BasicProperties;
//# sourceMappingURL=region3.d.ts.map