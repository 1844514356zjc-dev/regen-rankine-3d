import { Region } from '../types.js';
/**
 * Detect the IAPWS-IF97 region for given P and T.
 * @returns Region number (1–5) or -1 if out of range
 */
export declare function detectRegionPT(p: number, T: number): Region | -1;
/**
 * Detect region for P-H inputs.
 */
export declare function detectRegionPH(p: number, h: number): Region | -1;
/**
 * Detect region for P-S inputs.
 */
export declare function detectRegionPS(p: number, s: number): Region | -1;
/**
 * Detect the IAPWS-IF97 region for given T and H.
 *
 * Uses explicit enthalpy comparisons (including saturation-boundary proximity
 * checks via `isClose`) rather than the generic helper, because enthalpy is
 * not monotonic across regions at some temperatures.
 *
 * @param T - Temperature [K]
 * @param h - Specific enthalpy [kJ/kg]
 * @returns Region number (1–5) or -1 if out of range
 */
export declare function detectRegionTH(T: number, h: number): Region | -1;
/**
 * Detect the IAPWS-IF97 region for given T and S.
 *
 * Delegates to the generic temperature-property detector since entropy
 * is monotonic across regions at fixed temperature.
 *
 * @param T - Temperature [K]
 * @param s - Specific entropy [kJ/(kg·K)]
 * @returns Region number (1–5) or -1 if out of range
 */
export declare function detectRegionTS(T: number, s: number): Region | -1;
/**
 * Detect the IAPWS-IF97 region for given H and S.
 * Implements the zone-based detection from the IAPWS supplementary release.
 *
 * @param h - Specific enthalpy [kJ/kg]
 * @param s - Specific entropy [kJ/(kg·K)]
 * @returns Region number (1–5) or -1 if out of range
 */
export declare function detectRegionHS(h: number, s: number): Region | -1;
//# sourceMappingURL=region-detector.d.ts.map