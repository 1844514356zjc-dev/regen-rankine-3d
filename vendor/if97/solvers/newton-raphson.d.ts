export interface NewtonRaphsonOptions {
    /** Convergence tolerance (default 1e-7) */
    tolerance?: number;
    /** Maximum iterations (default 50) */
    maxIterations?: number;
    /** Step size for numerical derivative (default 1e-4) */
    h?: number;
    /** Machine epsilon (default 2.22e-16) */
    epsilon?: number;
}
/**
 * Solve f(x) = 0 using Newton-Raphson method.
 *
 * @param f  - Function to find root of
 * @param x0 - Initial guess
 * @param fp - Optional analytical derivative f'(x)
 * @param options - Solver options
 * @returns x such that f(x) ≈ 0
 * @throws {ConvergenceError} if the iteration diverges or does not converge
 */
export declare function newtonRaphson(f: (x: number) => number, x0: number, fp?: ((x: number) => number) | null, options?: NewtonRaphsonOptions): number;
//# sourceMappingURL=newton-raphson.d.ts.map