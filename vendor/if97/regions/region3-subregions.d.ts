/** Compute specific volume for Region 3 saturation boundary. x=0 liquid, x=1 vapor
 *  Pressure thresholds from IAPWS Supplementary Release on Backward
 *  Equations v(P,T) for Region 3, Table 1 (saturation subregion limits). */
export declare function region3SatVolume(p: number, T: number, x: number): number;
/** Compute specific volume for Region 3 from P and T using subregion equations.
 *  Pressure thresholds from IAPWS Supplementary Release on Backward
 *  Equations v(P,T) for Region 3, Figures 2–5. */
export declare function region3Volume(p: number, T: number): number;
//# sourceMappingURL=region3-subregions.d.ts.map