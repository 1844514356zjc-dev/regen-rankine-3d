/**
 * Region 3 P,T → BasicProperties solver.
 *
 * Region 3 is formulated as f(ρ, T), so a pressure target requires
 * iterating on density. This module provides that inversion.
 */
import type { BasicProperties } from '../types.js';
/**
 * Compute Region 3 basic properties from pressure and temperature.
 *
 * Uses the IAPWS-IF97 sub-region volume correlations for an initial density
 * guess, then refines with Newton-Raphson on p(ρ, T) − p_target = 0.
 *
 * @param p - Pressure [MPa]
 * @param T - Temperature [K]
 * @returns Basic thermodynamic properties for the Region 3 state
 * @throws {IF97Error} if the density solve does not converge
 */
export declare function solveRegion3PTBasic(p: number, T: number): BasicProperties;
//# sourceMappingURL=region3-pt.d.ts.map