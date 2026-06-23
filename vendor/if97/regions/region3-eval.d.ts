/**
 * Generic evaluator for Region 3 subregion v(P,T) backward equations.
 * All 26 subregions (a–z) share the same polynomial form but differ in
 * coefficients, reduction factors, and final transformation.
 */
export interface SubregionConfig {
    /** Pressure reduction [MPa] */
    pStar: number;
    /** Temperature reduction [K] */
    tStar: number;
    /** Volume reduction [m³/kg] */
    vStar: number;
    /** Pressure shift */
    piShift: number;
    /** Temperature shift */
    sigShift: number;
    /** Exponent multiplier for pi (default 1) */
    piExp?: number;
    /** Exponent multiplier for sigma (default 1) */
    sigExp?: number;
    /** Final transform: 'linear' | 'pow4' | 'exp' (default linear) */
    transform?: 'linear' | 'pow4' | 'exp';
    /** Coefficients [I, J, N][] */
    IJN: readonly (readonly [number, number, number])[];
}
/**
 * Evaluate a Region 3 subregion backward equation v(P,T).
 */
export declare function evalSubregion(cfg: SubregionConfig, p: number, T: number): number;
//# sourceMappingURL=region3-eval.d.ts.map