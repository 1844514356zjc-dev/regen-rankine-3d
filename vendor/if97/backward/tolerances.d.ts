export type BackwardToleranceLabel = 'pressure' | 'temperature' | 'enthalpy' | 'entropy';
export declare const BACKWARD_REGION4_QUALITY_TOLERANCE = 0.000001;
export declare function backwardConstraintTolerance(label: BackwardToleranceLabel, expected: number): number;
export declare function region4SaturationPressureTolerance(pressure: number): number;
export declare function backwardSpecificVolumeTolerance(expected: number): number;
//# sourceMappingURL=tolerances.d.ts.map