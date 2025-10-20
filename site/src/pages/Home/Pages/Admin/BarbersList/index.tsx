import style from './BarbersList.module.scss';
import { useUser } from '@contexts/UserContext';
import { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// @ts-ignore
import api from '@services/api';
import { useQuery } from '@tanstack/react-query';
// @ts-ignore
import { IUser } from '@types/User';
import { SelectMenu } from '@components/SelectMenu';
// @ts-ignore
import { formatPhoneNumber } from '@utils/formatPhoneNumber';
import AdminBarber from '@components/Admin/AdminBarber';

const BarbersList = () => {
    const { user } = useUser();
    const [isAllowed, setIsAllowed] = useState<boolean>(false);
    const [expandedBarber, setExpandedBarber] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            const roleTypeResult = await api.get(`/roles/${user?.role}/type`);
            const roleType = roleTypeResult.data;
            setIsAllowed(roleType === 'admin' || roleType === 'barbeiro-admin');
        };
        fetchData();
    }, [user]);

    const { data: barbers } = useQuery({
        queryKey: ['allBarbers', user?.sub],
        queryFn: async () => {
            const barbersResult = await api.get('/users/barbers/admin');
            return barbersResult.data;
        },
        enabled: isAllowed
    });

    const { data: services } = useQuery({
        queryKey: ['allServices', user?.sub],
        queryFn: async () => {
            const servicesResult = await api.get('/services/active')
            return servicesResult.data
        },
        enabled: isAllowed
    })

    const { data: roles } = useQuery({
        queryKey: ['allRoles', user?.sub],
        queryFn: async () => {
            const rolesResult = await api.get('/roles')
            return rolesResult.data
        },
        enabled: isAllowed
    })

    const { data: barberShopTimes } = useQuery({
        queryKey: ['barberShopTimes', user?.sub],
        queryFn: async () => {
            const barberShopDataResult = await api.get('/barbershops/times')
            return barberShopDataResult.data
        },
        enabled: isAllowed
    })

    return (
        <>
            <div className={style.Container}>
                {
                    isAllowed ? (
                        <div className={style.PageContent}>
                            <div className={style.TopArea}>
                                <h1 className={style.Title}>Lista de Barbeiros</h1>
                                <button className={style.AddBarber}><FontAwesomeIcon icon='plus' /> Adicionar Barbeiro</button>
                            </div>
                            
                            <div className={style.TableContainer}>
                                <div className={style.TableHeader}>
                                    <div className={style.HeaderCell}>Foto</div>
                                    <div className={style.HeaderCell}>Nome</div>
                                    <div className={style.HeaderCell}>Email</div>
                                    <div className={style.HeaderCell}>Telefone</div>
                                    <div className={style.HeaderCell}>Status</div>
                                    <div className={style.HeaderCell}>Avaliação</div>
                                    <div className={style.HeaderCell}>Ações</div>
                                </div>

                                <div className={style.TableBody}>
                                    {barbers && barbers.map((barber: IUser) => (
                                        <AdminBarber barber={barber} services={services} roles={roles} times={barberShopTimes} />
                                    ))}
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className={style.AccessDenied}>
                            <FontAwesomeIcon icon="lock" size="3x" />
                            <p>Você não tem permissão para acessar esta página.</p>
                        </div>
                    )
                }
            </div>
        </>
    )
}

export default BarbersList; 