/**
 * IAPWS-IF97 Core Types & Interfaces
 *
 * Type definitions for the IAPWS Industrial Formulation 1997
 * for the Thermodynamic Properties of Water and Steam.
 */
// ─── Region Enum ────────────────────────────────────────────────────────────
/** IAPWS-IF97 thermodynamic regions */
export var Region;
(function (Region) {
    /** Subcooled liquid (compressed water) */
    Region[Region["Region1"] = 1] = "Region1";
    /** Superheated steam */
    Region[Region["Region2"] = 2] = "Region2";
    /** Supercritical fluid */
    Region[Region["Region3"] = 3] = "Region3";
    /** Two-phase (wet steam / saturation line, excluding the exact critical point) */
    Region[Region["Region4"] = 4] = "Region4";
    /** High-temperature steam (T > 1073.15 K) */
    Region[Region["Region5"] = 5] = "Region5";
})(Region || (Region = {}));
// ─── Errors ─────────────────────────────────────────────────────────────────
/** Base error class for all IF97 calculation errors */
export class IF97Error extends Error {
    constructor(message) {
        super(message);
        this.name = 'IF97Error';
    }
}
/** Thrown when input values are outside IAPWS-IF97 valid ranges */
export class OutOfRangeError extends IF97Error {
    parameter;
    value;
    min;
    max;
    constructor(parameter, value, min, max) {
        super(`${parameter} = ${value} is out of range [${min}, ${max}]`);
        this.parameter = parameter;
        this.value = value;
        this.min = min;
        this.max = max;
        this.name = 'OutOfRangeError';
    }
}
/** Thrown when a numerical solver fails to converge */
export class ConvergenceError extends IF97Error {
    solver;
    iterations;
    constructor(solver, iterations) {
        super(`${solver} failed to converge after ${iterations} iterations`);
        this.solver = solver;
        this.iterations = iterations;
        this.name = 'ConvergenceError';
    }
}
//# sourceMappingURL=types.js.map