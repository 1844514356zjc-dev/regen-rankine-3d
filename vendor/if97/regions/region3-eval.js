/**
 * Generic evaluator for Region 3 subregion v(P,T) backward equations.
 * All 26 subregions (a–z) share the same polynomial form but differ in
 * coefficients, reduction factors, and final transformation.
 */
/**
 * Evaluate a Region 3 subregion backward equation v(P,T).
 */
export function evalSubregion(cfg, p, T) {
    const pi = p / cfg.pStar;
    const sig = T / cfg.tStar;
    const piE = cfg.piExp ?? 1;
    const sigE = cfg.sigExp ?? 1;
    let v = 0;
    for (const [I, J, N] of cfg.IJN) {
        v += N * Math.pow(pi - cfg.piShift, piE * I) * Math.pow(sig - cfg.sigShift, sigE * J);
    }
    const t = cfg.transform ?? 'linear';
    if (t === 'pow4')
        return cfg.vStar * Math.pow(v, 4);
    if (t === 'exp')
        return cfg.vStar * Math.exp(v);
    return cfg.vStar * v;
}
//# sourceMappingURL=region3-eval.js.map