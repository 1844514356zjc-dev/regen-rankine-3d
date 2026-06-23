/**
 * B23 boundary: Temperature → Pressure
 * Equation 5 (pp. 5), IAPWS-IF97
 *
 * @param T - Temperature [K]
 * @returns Pressure [MPa] on the B23 boundary
 */
export declare function boundary23_T_to_P(T: number): number;
/**
 * B23 boundary: Pressure → Temperature
 * Equation 6 (pp. 6), IAPWS-IF97
 *
 * @param p - Pressure [MPa]
 * @returns Temperature [K] on the B23 boundary
 */
export declare function boundary23_P_to_T(p: number): number;
/** B3ab boundary: P → T */
export declare function b3ab(p: number): number;
/** B3cd boundary: P → T */
export declare function b3cd(p: number): number;
/** B3ef boundary: P → T */
export declare function b3ef(p: number): number;
/** B3gh boundary: P → T */
export declare function b3gh(p: number): number;
/** B3ij boundary: P → T */
export declare function b3ij(p: number): number;
/** B3jk boundary: P → T */
export declare function b3jk(p: number): number;
/** B3mn boundary: P → T */
export declare function b3mn(p: number): number;
/** B3op boundary: P → T */
export declare function b3op(p: number): number;
/** B3qu boundary: P → T */
export declare function b3qu(p: number): number;
/** B3rx boundary: P → T */
export declare function b3rx(p: number): number;
/** B3uv boundary: P → T */
export declare function b3uv(p: number): number;
/** B3wx boundary: P → T */
export declare function b3wx(p: number): number;
//# sourceMappingURL=boundaries.d.ts.map