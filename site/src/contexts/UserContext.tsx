import { createContext, useContext, useEffect, useState } from 'react';
// @ts-ignore
import { IUser } from '@types/User';
import api from '../services/api';
import { useNavigate } from 'react-router-dom';


type UserContextType = {
    user: IUser | null;
    setUser: (user: IUser | null) => void;
    logout: () => void;
};

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
    const navigate = useNavigate();
    const [user, setUser] = useState<IUser | null>(null);

    const logout = async () => {
        setUser(null);
        try {
            await api.post('/auth/logout');
        } catch (err) {
            console.error('Erro ao fazer logout:', err);
        }
        navigate('/login');
    };

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const response = await api.get('/auth/profile', {
                    withCredentials: true, 
                });

                setUser(response.data);
            } catch (err) {
                console.error('Usuário não autenticado:', err);
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
