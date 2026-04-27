export type PostAuthUserType = "admin" | "empresa" | "influencer";

export type PostAuthSource = "login" | "registro_empresa";

export interface PostAuthContext {
  userType: PostAuthUserType;
  source: PostAuthSource;
  newCapabilityEnabled: boolean;
  newCapabilityRoute?: string;
}

export interface PostAuthResolution {
  route: string;
  reason:
    | "admin-default"
    | "empresa-wallet-configured"
    | "empresa-wallet-default"
    | "default-fallback";
}

// Fuente de verdad (NuevaFuncionalidad.md + directiva de producto):
// - El destino post-auth para empresa es wallet.
// - Se permite configuración de ruta interna para wallet, con fallback seguro a /wallet/nueva-capacidad.
const ADMIN_DEFAULT_ROUTE = "/admin";
const EMPRESA_DEFAULT_ROUTE = "/wallet/nueva-capacidad";
const GLOBAL_FALLBACK_ROUTE = "/";

function isValidInternalRoute(route?: string): boolean {
  if (!route) return false;
  return route.startsWith("/") && !route.startsWith("//");
}

function isExplicitlyDisabled(value: string | undefined): boolean {
  if (!value) return false;
  const normalized = value.toLowerCase().trim();
  return (
    normalized === "0" ||
    normalized === "false" ||
    normalized === "no" ||
    normalized === "off" ||
    normalized === "disabled"
  );
}

export function getPostAuthFeatureConfig() {
  return {
    newCapabilityEnabled: !isExplicitlyDisabled(process.env.NEXT_PUBLIC_POST_AUTH_NEW_CAPABILITY_ENABLED),
    newCapabilityRoute:
      process.env.NEXT_PUBLIC_POST_AUTH_NEW_CAPABILITY_ROUTE || EMPRESA_DEFAULT_ROUTE,
  };
}

export function resolvePostAuthRoute(context: PostAuthContext): PostAuthResolution {
  const normalizedUserType = context.userType?.toLowerCase() as PostAuthUserType;

  if (normalizedUserType === "admin") {
    return {
      route: ADMIN_DEFAULT_ROUTE,
      reason: "admin-default",
    };
  }

  if (normalizedUserType === "empresa") {
    if (isValidInternalRoute(context.newCapabilityRoute)) {
      const safeRoute = context.newCapabilityRoute as string;
      return {
        route: safeRoute,
        reason: "empresa-wallet-configured",
      };
    }

    return {
      route: EMPRESA_DEFAULT_ROUTE,
      reason: "empresa-wallet-default",
    };
  }

  return {
    route: GLOBAL_FALLBACK_ROUTE,
    reason: "default-fallback",
  };
}
