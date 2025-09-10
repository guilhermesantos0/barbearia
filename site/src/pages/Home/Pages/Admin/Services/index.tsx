import { useUser } from '@contexts/UserContext';
import style from './Services.module.scss';
import { useEffect, useState } from 'react';
// @ts-ignore
import api from '@services/api';
import { useQuery } from '@tanstack/react-query';
import { IService } from '@types/Service';
import AdminService from '@components/AdminService';

const AdminServices = () => {
    const { user } = useUser();
    const [isAllowed, setIsAllowed] = useState<boolean>(false);

    useEffect(() => {
        const fetchData = async () => {
            if (!user) return;
            const roleTypeResult = await api.get(`/roles/${user.role}/type`);
            const roleType = roleTypeResult.data;
            setIsAllowed(roleType === 'admin' || roleType === 'barbeiro-admin');
        };
        fetchData();
    }, [user]);

    const { data: allServices } = useQuery<IService[]>({
        queryKey: ['allServices', user?.sub],
        queryFn: async () => {
            const allServicesResult = await api.get('/services');
            return allServicesResult.data;
        },
        enabled: isAllowed
    })

    return (
        <div className={style.Container}>
            {
                isAllowed ? (
                    <div className={style.PageContent}>
                        <h1>Serviços disponíveis</h1>
                        <div className={style.Services}>
                            {
                                allServices && allServices.length > 0 ? (
                                    <>
                                        { 
                                            allServices.map((service, idx) => (
                                                <AdminService key={idx} service={service} />
                                            ))
                                        }
                                    </>
                                ) : (
                                    <div>Nenhum serviço criado</div>
                                )
                            }
                        </div>
                    </div>
                ) : (
                    <p>Você não vai achar nada aqui...</p>
                )
            }

        </div>
    )
}

export default AdminServices;