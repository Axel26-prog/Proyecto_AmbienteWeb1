import React from "react";

export default function Footer() {
  return (
    <footer className="mt-auto bg-[#845b34]">
      <div className="mx-auto flex w-full max-w-6xl justify-center px-4 py-6">

        <div
          className="text-center font-[Montserrat] text-sm text-[#e8a96e]"
        >
          © {new Date().getFullYear()} CrownTime Collective. Todos los derechos reservados.
        </div>

      </div>
    </footer>
  );
}