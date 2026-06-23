/** Configuration for the bracketed Newton solver. */
export interface BracketedNewtonOptions {
    /** Convergence tolerance on |f(x)| (default 1e-9) */
    tolerance?: number;
    /** Maximum number of iterations (default 100) */
    maxIterations?: number;
    /** Relative step size for central-difference derivative (default 1e-6) */
    derivativeStep?: number;
}
/**
 * Find a root of f(x) = 0 within the bracket [lower, upper].
 *
 * Each iteration attempts a Newton step using a central-difference derivative.
 * If the Newton candidate falls outside the current bracket or the derivative
 * is unavailable, a bisection step is used instead.
 *
 * @param f            - Continuous function whose root is sought
 * @param lower        - Lower bound of the bracket
 * @param upper        - Upper bound of the bracket
 * @param initialGuess - Optional starting point (must lie within bracket)
 * @param options      - Solver configuration
 * @returns The root x such that |f(x)| ≤ tolerance
 * @throws {ConvergenceError} if the bracket signs are the same or max iterations exceeded
 */
export declare function bracketedNewton(f: (x: number) => number, lower: number, upper: number, initialGuess?: number, options?: BracketedNewtonOptions): number;
//# sourceMappingURL=bracketed-newton.d.ts.map