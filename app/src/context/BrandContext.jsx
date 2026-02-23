import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { getMarcas } from "../services/marcaService";

const BrandContext = createContext(null);

function shortLabel(nombre) {
    const parts = nombre.trim().split(/\s+/);
    if (parts.length >= 2) return `${parts[0]}\n${parts[1]}`;
    return nombre.toUpperCase();
}

export function BrandProvider({ children }) {
    const [brands, setBrands] = useState([]);
    const [activeBrand, setActiveBrand] = useState(null);
    const [loadingBrands, setLoadingBrands] = useState(true);

    useEffect(() => {
        let mounted = true;

        (async () => {
            try {
                setLoadingBrands(true);
                const data = await getMarcas(); // [{id_marca, nombre}]
                const mapped = data.map((m) => ({
                    key: String(m.id_marca),
                    id_marca: m.id_marca,
                    name: m.nombre,
                    short: shortLabel(m.nombre),
                    image: m.imagen || "", // si luego agregas columna imagen
                }));

                if (!mounted) return;

                setBrands(mapped);
                if (mapped.length > 0) setActiveBrand((prev) => prev ?? mapped[0].key);
            } catch (e) {
                console.error(e);
            } finally {
                if (mounted) setLoadingBrands(false);
            }
        })();

        return () => {
            mounted = false;
        };
    }, []);

    const active = useMemo(
        () => brands.find((b) => b.key === activeBrand) || null,
        [brands, activeBrand]
    );

    const value = useMemo(
        () => ({ brands, activeBrand, setActiveBrand, active, loadingBrands }),
        [brands, activeBrand, active, loadingBrands]
    );

    return <BrandContext.Provider value={value}>{children}</BrandContext.Provider>;
}

export function useBrand() {
    const ctx = useContext(BrandContext);
    if (!ctx) throw new Error("useBrand must be used inside <BrandProvider />");
    return ctx;
}