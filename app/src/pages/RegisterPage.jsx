import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-hot-toast";
import { registerUsuario } from "@/services/UsuarioServices";
import logo from "@/assets/Logo/Logo.png";

const schema = yup.object({
  nombre:     yup.string().required("El nombre es obligatorio"),
  apellido:   yup.string().required("El apellido es obligatorio"),
  correo:     yup.string().email("Correo inválido").required("El correo es obligatorio"),
  contrasena: yup.string().min(6, "Mínimo 6 caracteres").required("La contraseña es obligatoria"),
  confirmar:  yup.string()
    .oneOf([yup.ref("contrasena")], "Las contraseñas no coinciden")
    .required("Confirma tu contraseña"),
  telefono:   yup.string().optional(),
  id_rol:     yup.number().oneOf([2, 3], "Rol no válido").required("El rol es obligatorio"),
});

const inputClass = "w-full rounded-lg border border-[#845b34]/40 bg-white px-4 py-2.5 font-[Montserrat] text-sm text-[#5b3717] placeholder:text-[#5b3717]/40 focus:border-[#845b34] focus:outline-none focus:ring-1 focus:ring-[#845b34]";
const labelClass = "block font-[Montserrat] text-sm font-semibold text-[#5b3717] mb-1";
const errorClass = "mt-1 font-[Montserrat] text-xs text-red-500";

export default function RegisterPage() {
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: { id_rol: 3 }, // Cliente por defecto
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data) => {
    try {
      const { confirmar, ...payload } = data;
      payload.id_rol = parseInt(payload.id_rol);

      const response = await registerUsuario(payload);

      if (response?.success) {
        toast.success("¡Cuenta creada correctamente!");
        navigate("/login");
      } else {
        toast.error(response?.message || "No se pudo crear la cuenta");
      }
    } catch (error) {
      toast.error("Error al registrarse");
      console.error(error);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#f7f7f7]">

      {/* Header */}
      <header className="bg-white">
        <div className="flex w-full items-center justify-between px-12 py-5">
          <Link to="/" className="flex items-center">
            <img src={logo} alt="CrownTime" className="h-24 w-auto object-contain" />
          </Link>
        </div>
        <div className="h-[3px] w-full bg-[#845b34]/70" />
      </header>

      {/* Formulario */}
      <main className="flex flex-1 items-center justify-center px-4 py-12">
        <div className="w-full max-w-md rounded-2xl bg-white shadow-md border border-[#845b34]/20 p-8">

          <h1 className="font-[Georgia] text-3xl font-bold text-[#845b34] text-center mb-2">
            Crear Cuenta
          </h1>
          <p className="font-[Montserrat] text-sm text-[#5b3717]/60 text-center mb-8">
            Únete a CrownTime Collective
          </p>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">

            {/* Nombre */}
            <div>
              <label className={labelClass}>Nombre</label>
              <input type="text" placeholder="Tu nombre"
                {...register("nombre")} className={inputClass} />
              {errors.nombre && <p className={errorClass}>{errors.nombre.message}</p>}
            </div>

            {/* Apellido */}
            <div>
              <label className={labelClass}>Apellido</label>
              <input type="text" placeholder="Tu apellido"
                {...register("apellido")} className={inputClass} />
              {errors.apellido && <p className={errorClass}>{errors.apellido.message}</p>}
            </div>

            {/* Correo */}
            <div>
              <label className={labelClass}>Correo electrónico</label>
              <input type="email" placeholder="ejemplo@correo.com"
                {...register("correo")} className={inputClass} />
              {errors.correo && <p className={errorClass}>{errors.correo.message}</p>}
            </div>

            {/* Teléfono */}
            <div>
              <label className={labelClass}>
                Teléfono <span className="text-[#5b3717]/40 font-normal">(opcional)</span>
              </label>
              <input type="tel" placeholder="8888-8888"
                {...register("telefono")} className={inputClass} />
            </div>

            {/* Contraseña */}
            <div>
              <label className={labelClass}>Contraseña</label>
              <input type="password" placeholder="Mínimo 6 caracteres"
                {...register("contrasena")} className={inputClass} />
              {errors.contrasena && <p className={errorClass}>{errors.contrasena.message}</p>}
            </div>

            {/* Confirmar contraseña */}
            <div>
              <label className={labelClass}>Confirmar contraseña</label>
              <input type="password" placeholder="Repite tu contraseña"
                {...register("confirmar")} className={inputClass} />
              {errors.confirmar && <p className={errorClass}>{errors.confirmar.message}</p>}
            </div>

            {/* Rol */}
            <div>
              <label className={labelClass}>Tipo de cuenta</label>
              <select
                {...register("id_rol", { valueAsNumber: true })}
                className={inputClass}
              >
                <option value={3}>Cliente</option>
                <option value={2}>Vendedor</option>
              </select>
              {errors.id_rol && <p className={errorClass}>{errors.id_rol.message}</p>}
            </div>

            {/* Botón */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full rounded-full border-2 border-[#845b34] bg-[#845b34] px-8 py-3 font-[Montserrat] text-base font-bold text-[#e8a96e] transition hover:bg-[#5b3717] hover:border-[#5b3717] disabled:opacity-60"
            >
              {isSubmitting ? "Creando cuenta..." : "Crear cuenta"}
            </button>

            <p className="font-[Montserrat] text-sm text-center text-[#5b3717]/70">
              ¿Ya tienes cuenta?{" "}
              <Link to="/login" className="font-semibold text-[#845b34] underline hover:text-[#5b3717]">
                Inicia sesión
              </Link>
            </p>

          </form>
        </div>
      </main>

      {/* Footer */}
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