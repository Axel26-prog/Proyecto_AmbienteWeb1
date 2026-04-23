import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-hot-toast";
import { useAuth } from "@/context/AuthContext";
import { loginUsuario } from "@/services/UsuarioServices";
import logo from "@/assets/Logo/Logo.png";

const schema = yup.object({
  correo:     yup.string().email("Correo inválido").required("El correo es obligatorio"),
  contrasena: yup.string().required("La contraseña es obligatoria"),
});

export default function LoginPage() {
  const { login } = useAuth();
  const navigate  = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({ resolver: yupResolver(schema) });

  const onSubmit = async (data) => {
    try {
      const response = await loginUsuario(data);

      if (response?.success && response?.token) {
        login(response.token, response.data);
        toast.success("Inicio de sesión exitoso");

        const rol = response.data?.rol;
        if (rol === "Administrador") navigate("/usuarios");
        else if (rol === "Vendedor") navigate("/subastas");
        else                         navigate("/");
      } else {
        toast.error(response?.message || "Credenciales inválidas");
      }
    } catch (error) {
      toast.error("Error al iniciar sesión");
      console.error(error);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#f7f7f7]">

      {/* Header igual al tuyo */}
      <header className="bg-white">
        <div className="flex w-full items-center justify-between px-12 py-5">
          <Link to="/" className="flex items-center">
            <img src={logo} alt="CrownTime" className="h-24 w-auto object-contain" />
          </Link>
        </div>
        <div className="h-[3px] w-full bg-[#845b34]/70" />
      </header>

      {/* Formulario centrado */}
      <main className="flex flex-1 items-center justify-center px-4 py-12">
        <div className="w-full max-w-md rounded-2xl bg-white shadow-md border border-[#845b34]/20 p-8">

          <h1 className="font-[Georgia] text-3xl font-bold text-[#845b34] text-center mb-2">
            Iniciar Sesión
          </h1>
          <p className="font-[Montserrat] text-sm text-[#5b3717]/60 text-center mb-8">
            Bienvenido de nuevo a CrownTime Collective
          </p>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">

            {/* Correo */}
            <div>
              <label className="block font-[Montserrat] text-sm font-semibold text-[#5b3717] mb-1">
                Correo electrónico
              </label>
              <input
                type="email"
                placeholder="ejemplo@correo.com"
                {...register("correo")}
                className="w-full rounded-lg border border-[#845b34]/40 bg-white px-4 py-2.5 font-[Montserrat] text-sm text-[#5b3717] placeholder:text-[#5b3717]/40 focus:border-[#845b34] focus:outline-none focus:ring-1 focus:ring-[#845b34]"
              />
              {errors.correo && (
                <p className="mt-1 font-[Montserrat] text-xs text-red-500">{errors.correo.message}</p>
              )}
            </div>

            {/* Contraseña */}
            <div>
              <label className="block font-[Montserrat] text-sm font-semibold text-[#5b3717] mb-1">
                Contraseña
              </label>
              <input
                type="password"
                placeholder="••••••••"
                {...register("contrasena")}
                className="w-full rounded-lg border border-[#845b34]/40 bg-white px-4 py-2.5 font-[Montserrat] text-sm text-[#5b3717] placeholder:text-[#5b3717]/40 focus:border-[#845b34] focus:outline-none focus:ring-1 focus:ring-[#845b34]"
              />
              {errors.contrasena && (
                <p className="mt-1 font-[Montserrat] text-xs text-red-500">{errors.contrasena.message}</p>
              )}
            </div>

            {/* Botón */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full rounded-full border-2 border-[#845b34] bg-[#845b34] px-8 py-3 font-[Montserrat] text-base font-bold text-[#e8a96e] transition hover:bg-[#5b3717] hover:border-[#5b3717] disabled:opacity-60"
            >
              {isSubmitting ? "Ingresando..." : "Ingresar"}
            </button>

            <p className="font-[Montserrat] text-sm text-center text-[#5b3717]/70">
              ¿No tienes cuenta?{" "}
              <Link to="/register" className="font-semibold text-[#845b34] underline hover:text-[#5b3717]">
                Regístrate
              </Link>
            </p>
          </form>
        </div>
      </main>

      {/* Footer igual al tuyo */}
      <footer className="bg-[#845b34]">
        <div className="mx-auto flex w-full max-w-6xl justify-center px-4 py-6">
          <p className="text-center font-[Montserrat] text-sm text-[#e8a96e]">
            © {new Date().getFullYear()} CrownTime Collective. Todos los derechos reservados.
          </p>
        </div>
      </footer>

    </div>
  );
}