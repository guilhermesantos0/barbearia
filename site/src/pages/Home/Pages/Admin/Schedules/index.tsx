import { useQuery } from '@tanstack/react-query';
import style from './Schedules.module.scss';
import { useUser } from '@contexts/UserContext';
import { useEffect, useState } from 'react';
import api from '@services/api';
import { IScheduledService } from '@types/ScheduledService';
import { SelectMenu } from '@components/SelectMenu';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import AdminScheduledService from '@components/AdminScheduledService';

const AdminSchdules = () => {

    const { user } = useUser();
    const [isAllowed, setIsAllowed] = useState<boolean>(false);

    const [filterStatus, setFilterStatus] = useState<string | undefined>();

    useEffect(() => {
        const fetchData = async () => {
            if (!user) return;

            const roleTypeResult = await api.get(`/roles/${user.role}/type`)
            const roleType = roleTypeResult.data;

            setIsAllowed(roleType === 'admin' || roleType === 'barbeiro-admin')
        }

        fetchData();
    }, [user])

    // const statusOptions = {
    //     placeholder: 'Período',
    //     value: period,
    //     onChange: (value: string | undefined) => setPeriod(value),
    //     options: [
    //         { value: '1w', label: '1 Semana' },
    //         { value: '1month', label: '1 Mês' },
    //         { value: '1y', label: '1 Ano' },
    //         { value: 'full', label: 'Sempre' }
    //     ]
    // }

    const statusFilter = {
        placeholder: 'Status',
        value: filterStatus,
        onChange: (value: string | undefined) => setFilterStatus(value),
        options: [
            { value: 'Pendente', label: 'Pendente' },
            { value: 'Confirmado', label: 'Confirmado' },
            { value: 'Atrasado', label: 'Atrasado' },
            { value: 'Em andamento', label: 'Em andamento' },
            { value: 'Finalizado', label: 'Concluido' },
            { value: 'Cancelado', label: 'Cancelado' }
        ]
    }


    const { data: scheduledServices } = useQuery<IScheduledService[]>({
        queryKey: ['getAllScheduledServices', user?.sub],
        queryFn: async () => {
            const scheduledServicesResult = await api.get('/scheduledservices/full');
            return scheduledServicesResult.data;
        },
        enabled: isAllowed
    })

    return (
        <div className={style.Container}>
            {
                isAllowed ? (
                    <div className={style.PageContent}>
                        <h1>Serviços agendados</h1>
                        <div className={style.Options}>
                            <SelectMenu 
                                placeholder={statusFilter.placeholder}
                                value={statusFilter.value}
                                onChange={statusFilter.onChange}
                                options={statusFilter.options}
                                className={style.SelectMenu}
                            />

                            <button className={style.AddService}><FontAwesomeIcon icon='plus' /> Adicionar Serviço</button>
                        </div>
                        <div className={style.PageContent}>
                            {
                                scheduledServices && scheduledServices.length > 0 ? (
                                    <>
                                        {
                                            scheduledServices?.map((appointment, idx) => (
                                                <AdminScheduledService key={idx} appointment={appointment} />
                                            ))
                                        }
                                    </>
                                ) : (
                                    <div>Nenhum serviço agendado</div>
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

export default AdminSchdules;