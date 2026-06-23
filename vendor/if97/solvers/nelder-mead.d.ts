export interface NelderMeadOptions {
    maxIterations?: number;
    nonZeroDelta?: number;
    zeroDelta?: number;
    minErrorDelta?: number;
    minTolerance?: number;
    rho?: number;
    chi?: number;
    psi?: number;
    sigma?: number;
}
export interface NelderMeadResult {
    x: number[];
    fx: number;
}
export declare function nelderMead(f: (x: number[]) => number, x0: number[], opts?: NelderMeadOptions): NelderMeadResult;
//# sourceMappingURL=nelder-mead.d.ts.map