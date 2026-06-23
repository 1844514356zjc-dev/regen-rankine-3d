/**
 * Backward equation T,S → state.
 *
 * Given temperature and specific entropy, determines the IAPWS-IF97 region
 * and solves for pressure using a bracketed Newton method, then returns
 * the full set of basic thermodynamic properties.
 */
import type { BasicProperties } from '../types.js';
/**
 * Solve for full basic thermodynamic state from temperature and entropy.
 *
 * Detects the IAPWS-IF97 region, then inverts s(p, T) to recover pressure
 * within the appropriate bracket for that region.
 *
 * Temperatures within ±CRITICAL_T_EXCLUSION_BAND of Tc are rejected because
 * the entropy surface is nearly flat there, making pressure recovery unreliable.
 *
 * @param T - Temperature [K]
 * @param s - Specific entropy [kJ/(kg·K)]
 * @returns Basic thermodynamic properties (without transport)
 * @throws {OutOfRangeError} if T is outside [T_MIN, T_MAX]
 * @throws {IF97Error} if T is within the critical exclusion band
 */
export declare function solveTS(T: number, s: number): BasicProperties;
//# sourceMappingURL=ts.d.ts.map