import { IF97Error } from '../types.js';
export function assertFiniteNumber(parameter, value) {
    if (typeof value !== 'number' || !Number.isFinite(value)) {
        throw new IF97Error(`${parameter} must be a finite number`);
    }
}
//# sourceMappingURL=input-validation.js.map