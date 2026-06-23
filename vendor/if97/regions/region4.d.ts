/**
 * IAPWS-IF97 Region 4: Saturation Line
 *
 * Saturation-pressure equation (Eq. 30) and saturation-temperature equation (Eq. 31)
 * Valid for: 273.15 K ≤ T ≤ 647.096 K
 *
 * Reference: IAPWS-IF97, Section 8 (Equations for Region 4)
 */
/**
 * Saturation pressure for a given temperature.
 * Equation 30 (pp. 33) of IAPWS-IF97.
 *
 * @param T - Temperature [K], 273.15 ≤ T ≤ 647.096
 * @returns Saturation pressure [MPa]
 * @throws {OutOfRangeError} if T is outside valid range
 */
export declare function saturationPressure(T: number): number;
/**
 * Saturation temperature for a given pressure.
 * Equation 31 (pp. 34) of IAPWS-IF97.
 *
 * @param p - Pressure [MPa], P_MIN ≤ P ≤ Pc
 *            (P_MIN = Psat(273.15 K), the lower pressure bound matching
 *            saturationPressure's lower temperature bound per IAPWS-IF97 §8)
 * @returns Saturation temperature [K]
 * @throws {OutOfRangeError} if P is outside valid range
 */
export declare function saturationTemperature(p: number): number;
//# sourceMappingURL=region4.d.ts.map