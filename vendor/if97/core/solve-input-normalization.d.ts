import type { SolveInput } from '../types.js';
export type CanonicalSolveInput = {
    mode: 'PT';
    p: number;
    T: number;
} | {
    mode: 'PH';
    p: number;
    h: number;
} | {
    mode: 'PS';
    p: number;
    s: number;
} | {
    mode: 'HS';
    h: number;
    s: number;
} | {
    mode: 'Px';
    p: number;
    x: number;
} | {
    mode: 'Tx';
    T: number;
    x: number;
} | {
    mode: 'TH';
    T: number;
    h: number;
} | {
    mode: 'TS';
    T: number;
    s: number;
};
export declare function normalizeSolveInput(input: SolveInput): CanonicalSolveInput;
//# sourceMappingURL=solve-input-normalization.d.ts.map