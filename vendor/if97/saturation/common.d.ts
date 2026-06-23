/**
 * Saturation-line utilities.
 *
 * Computes saturated liquid / vapour endpoint properties along the
 * two-phase boundary, and provides helpers for quality interpolation
 * and two-phase mixing.
 */
import type { BasicProperties } from '../types.js';
/** Saturated liquid and vapour properties at a given saturation state. */
export interface SaturationEndpoints {
    pressure: number;
    temperature: number;
    liquid: BasicProperties;
    vapor: BasicProperties;
}
export declare function rawQualityFromSaturationProperty(liquidValue: number, vaporValue: number, mixtureValue: number): number;
/**
 * Compute saturated liquid and vapour properties at a given pressure.
 *
 * Below 623.15 K the saturation line lies in Regions 1/2; above it,
 * both phases are in Region 3 and require density iteration.
 *
 * @param p - Saturation pressure [MPa]
 */
export declare function saturationEndpointsAtPressure(p: number): SaturationEndpoints;
/**
 * Compute saturated liquid and vapour properties at a given temperature.
 * @param T - Saturation temperature [K]
 */
export declare function saturationEndpointsAtTemperature(T: number): SaturationEndpoints;
/**
 * Compute vapour quality from any extensive saturation property.
 *
 * x = (mixture − liquid) / (vapour − liquid)
 *
 * @param liquidValue  - Property value at saturated liquid
 * @param vaporValue   - Property value at saturated vapour
 * @param mixtureValue - Property value of the two-phase mixture
 */
export declare function qualityFromSaturationProperty(liquidValue: number, vaporValue: number, mixtureValue: number): number;
/**
 * Linearly mix saturated liquid and vapour properties at a given quality.
 *
 * At x = 0 or x = 1 the pure endpoint is returned directly (preserving
 * cp, cv, etc.). For 0 < x < 1, single-phase-only properties are set to null.
 *
 * @param endpoints    - Saturated liquid/vapour properties
 * @param qualityInput - Vapour quality (0–1)
 */
export declare function mixSaturationState(endpoints: SaturationEndpoints, qualityInput: number): BasicProperties;
//# sourceMappingURL=common.d.ts.map