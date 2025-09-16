import { createContext, useContext, useEffect, useState } from "react";
//@ts-ignore
import api from "@services/api";

interface BarberShop {
    _id: string;
    name: string;
    address: string;
    phone?: string;
    email?: string;
    logoUrl?: string;
    workingHours: {
        day: string;
        open?: string;
        close?: string;
        breaks?: { start: string; end: string }[];
    }[];
    paymentMethods: string[];
    socialMedia: Record<string, string>;
    cancellationPolicy?: string;
    delayTolerance: number;
    holidays: string[];
}

interface BarberShopContextProps {
    barberShop: BarberShop | null;
    loading: boolean;
}

const BarberShopContext = createContext<BarberShopContextProps>({
    barberShop: null,
    loading: true,
});

export const BarberShopProvider = ({ children }: { children: React.ReactNode }) => {
    const [barberShop, setBarberShop] = useState<BarberShop | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await api.get("/barbershop");
                setBarberShop(res.data);

            } catch (err) {
                console.error("Erro ao buscar dados da barbearia:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    return (
        <BarberShopContext.Provider value={{ barberShop, loading }}>
            {children}
        </BarberShopContext.Provider>
    );
};

export const useBarberShop = () => useContext(BarberShopContext);
