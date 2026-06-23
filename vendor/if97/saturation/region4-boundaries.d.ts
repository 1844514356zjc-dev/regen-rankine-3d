export declare function normalizeRegion4Pressure(p: number): number;
export declare function normalizeRegion4Temperature(T: number): number;
export declare function clampRegion4TemperatureBelowCritical(T: number): number;
export declare function isRegion4CriticalPressure(p: number): boolean;
export declare function isRegion4CriticalTemperature(T: number): boolean;
export declare function assertRegion4PressureStateInput(p: number, solverName: string): number;
export declare function assertRegion4TemperatureStateInput(T: number, solverName: string): number;
export declare function assertRegion4StateAllowed(pressure: number, temperature: number, solverName: string): void;
export declare function isCriticalRegion4Enthalpy(h: number): boolean;
export declare function isCriticalRegion4Entropy(s: number): boolean;
export declare function assertCriticalRegion4PHInput(p: number, h: number, solverName: string): void;
export declare function assertCriticalRegion4PSInput(p: number, s: number, solverName: string): void;
export declare function assertCriticalRegion4HSInput(h: number, s: number, solverName: string): void;
//# sourceMappingURL=region4-boundaries.d.ts.map