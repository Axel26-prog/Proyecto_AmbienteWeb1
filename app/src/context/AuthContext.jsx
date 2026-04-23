import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext(null);

/**
 * Proveedor global de autenticación.
 * Guarda el token JWT y los datos del usuario en localStorage.
 * Exponer: user, token, login, logout, isAuthenticated, hasRole
 */
export function AuthProvider({ children }) {
  const [user, setUser]   = useState(null);
  const [token, setToken] = useState(null);

  // Restaurar sesión al cargar la app
  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    const storedUser  = localStorage.getItem("user");
    if (storedToken && storedUser) {
      try {
        setToken(storedToken);
        setUser(JSON.parse(storedUser));
      } catch {
        logout();
      }
    }
  }, []);

  /**
   * Guardar sesión después del login exitoso.
   * @param {string} jwtToken  - Token JWT recibido del backend
   * @param {object} userData  - Datos del usuario (sin contraseña)
   */
  const login = (jwtToken, userData) => {
    localStorage.setItem("token", jwtToken);
    localStorage.setItem("user", JSON.stringify(userData));
    setToken(jwtToken);
    setUser(userData);
  };

  /** Cerrar sesión y limpiar storage */
  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setToken(null);
    setUser(null);
  };

  /** ¿El usuario tiene sesión activa? */
  const isAuthenticated = !!token && !!user;

  /**
   * Verificar si el usuario tiene uno de los roles indicados.
   * @param {string|string[]} roles  Ej: "Administrador" o ["Administrador","Vendedor"]
   */
  const hasRole = (roles) => {
    if (!user) return false;
    const rolesArray = Array.isArray(roles) ? roles : [roles];
    return rolesArray.includes(user.rol);
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout, isAuthenticated, hasRole }}>
      {children}
    </AuthContext.Provider>
  );
}

/** Hook para usar el contexto en cualquier componente */
export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth debe usarse dentro de <AuthProvider>");
  return ctx;
}