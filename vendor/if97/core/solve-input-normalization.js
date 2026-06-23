import { IF97Error } from '../types.js';
import { assertFiniteNumber } from './input-validation.js';
function pickNumericAlias(input, shortKey, longKey, label) {
    const shortValue = input[shortKey];
    const longValue = input[longKey];
    if (shortValue === undefined && longValue === undefined) {
        throw new IF97Error(`solve input requires '${shortKey}' or '${longKey}' for ${label}`);
    }
    if (shortValue !== undefined &&
        longValue !== undefined &&
        !Object.is(shortValue, longValue)) {
        throw new IF97Error(`solve input received conflicting values for '${shortKey}' and '${longKey}'`);
    }
    const value = shortValue ?? longValue;
    assertFiniteNumber(label, value);
    return value;
}
// Normalize public solve() aliases to the canonical short-key form used internally.
export function normalizeSolveInput(input) {
    const raw = input;
    switch (input.mode) {
        case 'PT':
            return {
                mode: 'PT',
                p: pickNumericAlias(raw, 'p', 'pressure', 'pressure'),
                T: pickNumericAlias(raw, 'T', 'temperature', 'temperature'),
            };
        case 'PH':
            return {
                mode: 'PH',
                p: pickNumericAlias(raw, 'p', 'pressure', 'pressure'),
                h: pickNumericAlias(raw, 'h', 'enthalpy', 'enthalpy'),
            };
        case 'PS':
            return {
                mode: 'PS',
                p: pickNumericAlias(raw, 'p', 'pressure', 'pressure'),
                s: pickNumericAlias(raw, 's', 'entropy', 'entropy'),
            };
        case 'HS':
            return {
                mode: 'HS',
                h: pickNumericAlias(raw, 'h', 'enthalpy', 'enthalpy'),
                s: pickNumericAlias(raw, 's', 'entropy', 'entropy'),
            };
        case 'Px':
            return {
                mode: 'Px',
                p: pickNumericAlias(raw, 'p', 'pressure', 'pressure'),
                x: pickNumericAlias(raw, 'x', 'quality', 'quality'),
            };
        case 'Tx':
            return {
                mode: 'Tx',
                T: pickNumericAlias(raw, 'T', 'temperature', 'temperature'),
                x: pickNumericAlias(raw, 'x', 'quality', 'quality'),
            };
        case 'TH':
            return {
                mode: 'TH',
                T: pickNumericAlias(raw, 'T', 'temperature', 'temperature'),
                h: pickNumericAlias(raw, 'h', 'enthalpy', 'enthalpy'),
            };
        case 'TS':
            return {
                mode: 'TS',
                T: pickNumericAlias(raw, 'T', 'temperature', 'temperature'),
                s: pickNumericAlias(raw, 's', 'entropy', 'entropy'),
            };
        default:
            throw new IF97Error(`Unsupported solve mode: ${input.mode ?? 'undefined'}`);
    }
}
//# sourceMappingURL=solve-input-normalization.js.map