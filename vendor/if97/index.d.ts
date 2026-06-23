/**
 * iapws-if97 — IAPWS-IF97 Steam/Water Properties Library
 *
 * Public API exports.
 */
import type { SteamState, SolveInput } from './types.js';
export declare function solvePT(p: number, T: number): SteamState;
export declare function solve(input: SolveInput): SteamState;
export declare function solvePH(p: number, h: number): SteamState;
export declare function solvePS(p: number, s: number): SteamState;
export declare function solveHS(h: number, s: number): SteamState;
export declare function solveTH(T: number, h: number): SteamState;
export declare function solveTS(T: number, s: number): SteamState;
export declare function solvePx(p: number, x: number): SteamState;
export declare function solveTx(T: number, x: number): SteamState;
export type { SteamState, SolveInput } from './types.js';
export { Region, IF97Error, OutOfRangeError, ConvergenceError } from './types.js';
//# sourceMappingURL=index.d.ts.map