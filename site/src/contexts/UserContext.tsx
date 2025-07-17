// src/contexts/UserContext.tsx
import { createContext, useContext, useEffect, useState } from 'react';
import { jwtDecode } from 'jwt-decode';

import { ICostumer } from '../types/Costumer';
import { IEmployee } from '../types/Empoyee';

type UserContextType = {
    user: ICostumer | IEmployee | null;
    setUser: (user: ICostumer | IEmployee | null) => void;
    logout: () => void;
};

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
    const [user, setUser] = useState<ICostumer | IEmployee | null>(null);

    useEffect(() => {
        const token = localStorage.getItem('access_token');
        if (token) {
            try {
                const decoded = jwtDecode<ICostumer | IEmployee>(token);
                setUser(decoded);
            } catch (err) {
                console.error('Token inválido 🧨', err);
                localStorage.removeItem('access_token');
            }
        }
    }, []);

    const logout = () => {
        setUser(null);
        localStorage.removeItem('access_token');
    };

    return (
        <UserContext.Provider value={{ user, setUser, logout }}>
            {children}
        </UserContext.Provider>
    );
};

export const useUser = () => {
    const context = useContext(UserContext);
    console.log(context)
    if (!context) throw new Error('useUser precisa estar dentro de <UserProvider>');
    return context;
};
