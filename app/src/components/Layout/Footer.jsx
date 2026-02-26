import React from "react";

function BrandLogoMark() {
  return (
    <div className="grid h-10 w-10 place-items-center rounded-xl border border-[#845b34]/30">
      <span className="text-[#845b34]">♛</span>
    </div>
  );
}

export default function Footer() {
  return (
    <footer className="mt-auto border-t border-[#845b34]/15 bg-white">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-3 px-4 py-8 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          
          
        </div>

        <div className="flex flex-wrap items-center gap-4 font-[Montserrat] text-sm font-semibold text-[#845b34]">
          <a href="#" className="hover:text-[#e8a96e]">
            Términos
          </a>
          <a href="#" className="hover:text-[#e8a96e]">
            Privacidad
          </a>
        </div>

        <div className="font-[Montserrat] text-xs text-[#845b34]/70">
          © {new Date().getFullYear()} CrownTime Collective. Todos los derechos reservados.
        </div>
      </div>
    </footer>
  );
}