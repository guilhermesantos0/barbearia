// src/contexts/UserContext.tsx
import { createContext, useContext, useEffect, useState } from 'react';
import { jwtDecode } from 'jwt-decode';
import { isTokenExpired } from '../utils/auth';
import { ICostumer } from '../types/Costumer';
import { IEmployee } from '../types/Employee';
import api from '../services/api';
import { useNavigate } from 'react-router-dom';

type UserContextType = {
    user: ICostumer | IEmployee | null;
    setUser: (user: ICostumer | IEmployee | null) => void;
    logout: () => void;
};

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
    const navigate = useNavigate();
    const [user, setUser] = useState<ICostumer | IEmployee | null>(null);

    const logout = () => {
        setUser(null);
        localStorage.removeItem('access_token');
        navigate('/login');
    };

    useEffect(() => {
        const fetchUserData = async () => {
            const token = localStorage.getItem('access_token');
            if (!token) {
                logout();
                return;
            }

            // if (isTokenExpired(token)) {
            //     console.log('Token expirado');
            //     logout();
            //     return;
            // }

            try {
                const decoded = jwtDecode<ICostumer | IEmployee>(token);
                const endpoint = decoded.role === 0 ? '/costumers/me' : '/employees/me';
                
                const response = await api.get(endpoint, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });

                setUser(response.data);
            } catch (err) {
                console.error('Erro ao buscar dados do usuário:', err);
                logout();
            }
        };

        fetchUserData();
    }, []);

    return (
        <UserContext.Provider value={{ user, setUser, logout }}>
            {children}
        </UserContext.Provider>
    );
};

export const useUser = () => {
    const context = useContext(UserContext);
    if (!context) throw new Error('useUser deve ser usado dentro de UserProvider');
    return context;
};