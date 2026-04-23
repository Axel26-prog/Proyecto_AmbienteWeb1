import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";

/**
 * Ruta protegida por autenticación y opcionalmente por rol.
 *
 * Uso en el router:
 *
 * // Solo requiere estar autenticado
 * <Route element={<ProtectedRoute />}>
 *   <Route path="/perfil" element={<PerfilPage />} />
 * </Route>
 *
 * // Solo Administrador
 * <Route element={<ProtectedRoute roles={["Administrador"]} />}>
 *   <Route path="/usuarios" element={<UsuariosPage />} />
 * </Route>
 *
 * // Vendedor o Administrador
 * <Route element={<ProtectedRoute roles={["Vendedor","Administrador"]} />}>
 *   <Route path="/subastas/crear" element={<CrearSubastaPage />} />
 * </Route>
 */
export default function ProtectedRoute({ roles }) {
  const { isAuthenticated, hasRole } = useAuth();

  // No autenticado → redirigir al login
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Autenticado pero sin el rol requerido → redirigir a inicio (o página de no autorizado)
  if (roles && !hasRole(roles)) {
    return <Navigate to="/no-autorizado" replace />;
  }

  return <Outlet />;
}