/**
 * IAPWS-IF97 Constants
 *
 * Physical constants, critical point properties, and range limits
 * for the IAPWS Industrial Formulation 1997.
 */
/** Specific gas constant for water [kJ/(kg·K)].
 *  IAPWS-IF97, §2 (Table 1). Fixed value for IF97 internal consistency.
 *  Do not replace transport correlations with this value; thermal conductivity
 *  critical enhancement intentionally uses `R_IAPWS_2011_THERMAL`. */
export declare const R = 0.461526;
/** Specific gas constant used by the IAPWS 2011 thermal conductivity λ₂ correlation [kJ/(kg·K)].
 *  Intentionally differs from IF97's `R`; keep both constants distinct and named. */
export declare const R_IAPWS_2011_THERMAL = 0.46151805;
/** Critical temperature [K] */
export declare const Tc = 647.096;
/** Temperature exclusion half-band around the critical point [K] */
export declare const CRITICAL_T_EXCLUSION_BAND = 0.001;
/** Region 4 endpoint snap tolerance for temperatures [K] */
export declare const REGION4_TEMPERATURE_TOLERANCE = 1e-9;
/** Safety margin used when clamping Region 4 temperatures below Tc [K] */
export declare const REGION4_SUBCRITICAL_TEMPERATURE_MARGIN = 1e-8;
/** Critical pressure [MPa] */
export declare const Pc = 22.064;
/** Region 4 endpoint snap tolerance for pressures [MPa] */
export declare const REGION4_PRESSURE_TOLERANCE = 1e-9;
/** Tolerance for identifying the critical h-s endpoint in Region 4 */
export declare const REGION4_CRITICAL_HS_TOLERANCE = 0.000001;
/** Residual tolerance for Region 4 h-s temperature inversion */
export declare const REGION4_HS_RESIDUAL_TOLERANCE = 1e-10;
/** Scan resolution used when bracketing Region 4 h-s temperature roots */
export declare const REGION4_HS_BRACKET_SEGMENTS = 256;
/** Critical density [kg/m³] */
export declare const RHOc = 322;
/** Triple point pressure [MPa] */
export declare const Pt = 0.000611657;
/** Triple point temperature [K] */
export declare const Tt = 273.16;
/** Minimum pressure [MPa].
 *  Derived: Psat(T_MIN) = Psat(273.15 K) via Eq. 30. Below the triple-point
 *  pressure Pt because T_MIN (0 °C) < Tt (0.01 °C). */
export declare const P_MIN = 0.000611212677444;
/** Maximum pressure [MPa] */
export declare const P_MAX = 100;
/** Minimum temperature [K] (273.15 K = 0 °C) */
export declare const T_MIN = 273.15;
/** Maximum temperature [K] (2273.15 K = 2000 °C) */
export declare const T_MAX = 2273.15;
/** Minimum specific entropy [kJ/(kg·K)] */
export declare const S_MIN = -0.00015454959194;
/** Maximum specific entropy [kJ/(kg·K)] */
export declare const S_MAX = 13.904956083429227;
/** Minimum specific enthalpy [kJ/kg] */
export declare const H_MIN = -0.041587825987;
/** Maximum specific enthalpy [kJ/kg] */
export declare const H_MAX = 7376.980263598506;
/** Region 2 minimum temperature for high-P subregions [K] (623.15 K = 350 °C) */
export declare const R2_T_MIN = 623.15;
/** Region 2 maximum temperature for backward eqs [K] (1073.15 K = 800 °C) */
export declare const R2_T_MAX = 1073.15;
/** Region 2 subregion boundary entropy [kJ/(kg·K)].
 *  Divides R2a from R2b/R2c in the h-s plane.
 *  Ref: IAPWS Supplementary Release on Backward Equations for Region 2, §6.3 */
export declare const R2_S_CRT = 5.85;
/** Region 2 subregion boundary pressure [MPa].
 *  Divides R2a from R2b/R2c.
 *  Ref: IAPWS Supplementary Release on Backward Equations for Region 2, §6.3 */
export declare const R2_P_CRT = 4;
/** B23 minimum pressure [MPa] */
export declare const B23_P_MIN = 16.5291642526;
/** B23 maximum temperature [K] */
export declare const B23_T_MAX = 863.15;
/** Region 3 minimum temperature [K] */
export declare const R3_T_MIN = 623.15;
/** Region 3 critical entropy [kJ/(kg·K)] */
export declare const R3_S_CRT = 4.41202148223476;
/** Region 3 critical enthalpy [kJ/kg] */
export declare const R3_H_CRT = 2087.5468451171537;
/** Region 5 minimum temperature [K] */
export declare const R5_T_MIN = 1073.15;
/** Region 5 maximum pressure [MPa] */
export declare const R5_P_MAX = 50;
/** Region 5 maximum temperature [K] */
export declare const R5_T_MAX = 2273.15;
/** Minimum entropy along the B23 curve [kJ/(kg·K)], at T ≈ 777 K */
export declare const B23_S_CURVE_MIN = 5.048096828;
/** Maximum entropy along the B23 curve [kJ/(kg·K)], at T ≈ 644 K */
export declare const B23_S_CURVE_MAX = 5.260578707;
/** Minimum enthalpy along the B23 curve [kJ/kg], at T = 623.15 K (currently unused) */
export declare const B23_H_CURVE_MIN = 2563.592004;
/** Maximum enthalpy along the B23 curve [kJ/kg], at T = 863.15 K (currently unused) */
export declare const B23_H_CURVE_MAX = 2812.942061;
//# sourceMappingURL=constants.d.ts.map