/**
 * Main IF97 solve dispatcher.
 * Computes full thermodynamic state including transport properties.
 */
import type { SteamState, SolveInput } from '../types.js';
/**
 * Solve for full thermodynamic state given pressure and temperature.
 *
 * @param p - Pressure [MPa]
 * @param T - Temperature [K]
 * @returns Complete steam state with transport properties
 */
export declare function solvePT(p: number, T: number): SteamState;
/**
 * Unified solver: compute full thermodynamic state from any supported input pair.
 * Routes to the correct solver based on input mode, enriches with transport properties,
 * and accepts either shorthand or long-form input field names.
 */
export declare function solve(input: SolveInput): SteamState;
//# sourceMappingURL=solver.d.ts.map