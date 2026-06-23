/**
 * Shared helper for T,H and T,S backward solvers.
 *
 * Solves for pressure at fixed temperature by matching a target property
 * (enthalpy or entropy) using a bracketed Newton method.
 */
import type { BasicProperties } from '../types.js';
type PropertyExtractor = (state: BasicProperties) => number;
/**
 * Solve for pressure at fixed temperature by matching a target property value.
 *
 * Evaluates the region equation at the bracket endpoints first (short-circuit
 * if either already matches), then runs a bracketed Newton iteration.
 *
 * @param evaluator  - Region-specific equation returning BasicProperties from (p, T)
 * @param T          - Fixed temperature [K]
 * @param target     - Target property value (enthalpy or entropy)
 * @param lower      - Lower pressure bracket [MPa]
 * @param upper      - Upper pressure bracket [MPa]
 * @param extract    - Function to extract the target property from BasicProperties
 * @param solverName - Label used in error messages
 */
export declare function solveFixedTemperaturePressure(evaluator: (p: number, T: number) => BasicProperties, T: number, target: number, lower: number, upper: number, extract: PropertyExtractor, solverName: string): BasicProperties;
export {};
//# sourceMappingURL=fixed-temperature-solver.d.ts.map