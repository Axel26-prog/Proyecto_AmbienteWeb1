/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useMemo, useState } from "react";

const BrandContext = createContext(null);

const BRAND_KEY_TO_DBNAME = {
    rolex: "Rolex",
    patek: "Patek Philippe",
    cartier: "Cartier",
    ap: "Audemars Piguet",
    ulysse: "Ulysse Nardin",
    franck: "Franck Muller",
};

export function BrandProvider({ children }) {
    const [activeBrand, setActiveBrand] = useState("all");

    const activeBrandName = BRAND_KEY_TO_DBNAME[activeBrand] ?? "Todos";

    const value = useMemo(
        () => ({
            activeBrand,
            setActiveBrand,
            activeBrandName,
            BRAND_KEY_TO_DBNAME,
        }),
        [activeBrand, activeBrandName]
    );

    return <BrandContext.Provider value={value}>{children}</BrandContext.Provider>;
}

export default BrandContext;