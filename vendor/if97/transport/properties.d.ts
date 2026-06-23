/**
 * IAPWS Transport Properties
 *
 * - Viscosity (IAPWS 2008)
 * - Thermal Conductivity (IAPWS 2011)
 * - Surface Tension (IAPWS 2014)
 * - Dielectric Constant (IAPWS 1997)
 * - Ionization Constant (IAPWS 2024)
 */
/**
 * Dynamic viscosity of water/steam [Pa·s]
 * @param T   Temperature [K]
 * @param rho Density [kg/m³]
 */
export declare function viscosity(T: number, rho: number): number;
/**
 * Thermal conductivity of water/steam [W/(m·K)]
 *
 * When optional thermodynamic state parameters are provided, the full IAPWS 2011
 * critical enhancement (λ₂) is computed. Otherwise λ₂ = 0 (backward compatible).
 * λ₂ intentionally uses `R_IAPWS_2011_THERMAL`, not the IF97 thermodynamic `R`.
 *
 * @param T   Temperature [K]
 * @param rho Density [kg/m³]
 * @param cp  Isobaric heat capacity [kJ/(kg·K)] (optional)
 * @param cv  Isochoric heat capacity [kJ/(kg·K)] (optional)
 * @param drhodP_T  Isothermal density derivative ∂ρ/∂P|_T [kg/m³/MPa] (optional)
 * @param mu  Dynamic viscosity [Pa·s] (optional)
 */
export declare function thermalConductivity(T: number, rho: number, cp?: number, cv?: number, drhodP_T?: number, mu?: number): number;
/**
 * Surface tension of water [N/m]
 * Returns null outside the IAPWS validity range.
 * @param T Temperature [K], valid for 273.15 ≤ T ≤ 647.096
 */
export declare function surfaceTension(T: number): number | null;
/**
 * Static dielectric constant [dimensionless]
 * @param T   Temperature [K]
 * @param rho Density [kg/m³]
 */
export declare function dielectricConstant(T: number, rho: number): number;
/**
 * Ionization constant pKw [dimensionless]
 * @param T   Temperature [K]
 * @param rho Density [kg/m³]
 */
export declare function ionizationConstant(T: number, rho: number): number | null;
//# sourceMappingURL=properties.d.ts.map