import type { BasicProperties } from '../types.js';
import { Region } from '../types.js';
export interface BackwardConstraint {
    label: 'pressure' | 'temperature' | 'enthalpy' | 'entropy';
    expected: number;
    tolerance?: number;
}
export interface BackwardValidationOptions {
    solverName: string;
    expectedRegion?: Region;
}
export declare function validateBackwardState(state: BasicProperties, constraints: readonly BackwardConstraint[], options: BackwardValidationOptions): BasicProperties;
//# sourceMappingURL=solution-validation.d.ts.map