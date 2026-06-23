import { solve as solveAny, solvePT as solvePTInternal } from './core/solver.js';
import { normalizePublicState } from './core/public-normalization.js';
function normalizeSteamState(state) {
    return normalizePublicState(state);
}
// Core solvers
// Normalize only at the public package boundary so internal solver math
// keeps full raw precision during iteration and region transitions.
export function solvePT(p, T) {
    return normalizeSteamState(solvePTInternal(p, T));
}
export function solve(input) {
    return normalizeSteamState(solveAny(input));
}
export function solvePH(p, h) {
    return normalizeSteamState(solveAny({ mode: 'PH', p, h }));
}
export function solvePS(p, s) {
    return normalizeSteamState(solveAny({ mode: 'PS', p, s }));
}
export function solveHS(h, s) {
    return normalizeSteamState(solveAny({ mode: 'HS', h, s }));
}
export function solveTH(T, h) {
    return normalizeSteamState(solveAny({ mode: 'TH', T, h }));
}
export function solveTS(T, s) {
    return normalizeSteamState(solveAny({ mode: 'TS', T, s }));
}
export function solvePx(p, x) {
    return normalizeSteamState(solveAny({ mode: 'Px', p, x }));
}
export function solveTx(T, x) {
    return normalizeSteamState(solveAny({ mode: 'Tx', T, x }));
}
export { Region, IF97Error, OutOfRangeError, ConvergenceError } from './types.js';
//# sourceMappingURL=index.js.map