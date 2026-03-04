import { useContext } from "react";
import BrandContext from "./BrandContext";

export function useBrand() {
    const ctx = useContext(BrandContext);
    if (!ctx) throw new Error("useBrand debe usarse dentro de BrandProvider");
    return ctx;
}