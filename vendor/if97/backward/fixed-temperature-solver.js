import { IF97Error } from '../types.js';
import { bracketedNewton } from '../solvers/bracketed-newton.js';
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
export function solveFixedTemperaturePressure(evaluator, T, target, lower, upper, extract, solverName) {
    const lowerState = evaluator(lower, T);
    const upperState = evaluator(upper, T);
    if (Math.abs(extract(lowerState) - target) <= 1e-9)
        return lowerState;
    if (Math.abs(extract(upperState) - target) <= 1e-9)
        return upperState;
    const pressure = bracketedNewton((p) => extract(evaluator(p, T)) - target, lower, upper, (lower + upper) / 2);
    const state = evaluator(pressure, T);
    if (!Number.isFinite(state.pressure)) {
        throw new IF97Error(`${solverName} failed to recover a valid pressure`);
    }
    return state;
}
//# sourceMappingURL=fixed-temperature-solver.js.map