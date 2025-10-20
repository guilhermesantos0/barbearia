import { useQuery } from '@tanstack/react-query';
import style from './Schedules.module.scss';
import { useUser } from '@contexts/UserContext';
import { useEffect, useMemo, useState } from 'react';
import api from '@services/api';
import { IScheduledService } from '@types/ScheduledService';
import { SelectMenu } from '@components/SelectMenu';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import AdminScheduledService from '@components/Admin/AdminScheduledService';

const AdminSchedules = () => {
    const { user } = useUser();
    const [isAllowed, setIsAllowed] = useState<boolean>(false);

    const [filterStatus, setFilterStatus] = useState<string | undefined>();
    const [filterCustomer, setFilterCustomer] = useState<string | undefined>();
    const [filterBarber, setFilterBarber] = useState<string | undefined>();
    const [filterService, setFilterService] = useState<string | undefined>();

    const [customers, setCustomers] = useState<Array<{ value: string; label: string }>>([]);
    const [barbers, setBarbers] = useState<Array<{ value: string, label: string}>>([]);
    const [services, setServices] = useState<Array<{ value: string; label: string }>>([]);

    useEffect(() => {
        const fetchData = async () => {
            if (!user) return;
            const roleTypeResult = await api.get(`/roles/${user.role}/type`);
            const roleType = roleTypeResult.data;
            setIsAllowed(roleType === 'admin' || roleType === 'barbeiro-admin');
        };
        fetchData();
    }, [user]);

    const { data: scheduledServices } = useQuery<IScheduledService[]>({
        queryKey: ['getAllScheduledServices', user?.sub],
        queryFn: async () => {
            const scheduledServicesResult = await api.get('/scheduledservices/full');
            return scheduledServicesResult.data;
        },
        enabled: isAllowed
    });

    useEffect(() => {
        if (!scheduledServices) return;

        const uniqueCustomers = new Map<string, string>();
        const uniqueBarbers = new Map<string, string>();
        const uniqueServices = new Map<string, string>();

        scheduledServices.forEach((appointment) => {
            if (appointment.costumer && !uniqueCustomers.has(appointment.costumer._id)) {
                uniqueCustomers.set(appointment.costumer._id, appointment.costumer.name);
            }

            if (appointment.barber && !uniqueBarbers.has(appointment.barber._id)) {
                uniqueBarbers.set(appointment.barber._id, appointment.barber.name);
            }

            if (appointment.service && !uniqueServices.has(appointment.service._id)) {
                uniqueServices.set(appointment.service._id, appointment.service.name);
            }
        });

        setCustomers(Array.from(uniqueCustomers, ([value, label]) => ({ value, label })));
        setBarbers(Array.from(uniqueBarbers, ([value, label]) => ({ value, label })));
        setServices(Array.from(uniqueServices, ([value, label]) => ({ value, label })));
    }, [scheduledServices]);

    const filteredSchedules = useMemo(() => {
        if (!scheduledServices) return [];

        let updated = [...scheduledServices];

        if (filterStatus) {
            updated = updated.filter((appt) => appt.status === filterStatus);
        }

        if (filterCustomer) {
            updated = updated.filter((appt) => appt.costumer?._id === filterCustomer);
        }

        if (filterBarber) {
            updated = updated.filter((appt) => appt.barber._id === filterBarber);
        }

        if (filterService) {
            updated = updated.filter((appt) => appt.service?._id === filterService);
        }

        updated.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

        return updated;
    }, [scheduledServices, filterStatus, filterCustomer, filterBarber, filterService]);

    const filters = [
        {
            placeholder: 'Status',
            value: filterStatus,
            onChange: (value: string | undefined) => setFilterStatus(value),
            options: [
                { value: 'Pendente', label: 'Pendente' },
                { value: 'Confirmado', label: 'Confirmado' },
                { value: 'Atrasado', label: 'Atrasado' },
                { value: 'Em andamento', label: 'Em andamento' },
                { value: 'Finalizado', label: 'Finalizado' },
                { value: 'Cancelado', label: 'Cancelado' }
            ]
        },
        {
            placeholder: 'Cliente',
            value: filterCustomer,
            onChange: (value: string | undefined) => setFilterCustomer(value),
            options: customers
        },
        {
            placeholder: 'Barbeiro',
            value: filterBarber,
            onChange: (value: string | undefined) => setFilterBarber(value),
            options: barbers
        },
        {
            placeholder: 'Serviço',
            value: filterService,
            onChange: (value: string | undefined) => setFilterService(value),
            options: services
        }
    ];

    return (
        <div className={style.Container}>
            {isAllowed ? (
                <div className={style.PageContent}>
                    <h1>Serviços agendados</h1>
                    <div className={style.Options}>
                        {filters.map((filter, index) => (
                            <SelectMenu
                                key={index}
                                placeholder={filter.placeholder}
                                value={filter.value}
                                onChange={filter.onChange}
                                options={filter.options}
                                className={style.SelectMenu}

                                searchable={filter.placeholder === 'Cliente' || filter.placeholder === 'Barbeiro'}
                            />
                        ))}

                        <button className={style.AddService}>
                            <FontAwesomeIcon icon="plus" /> Adicionar Serviço
                        </button>
                    </div>
                    <div className={style.Schedules}>
                        {filteredSchedules && filteredSchedules.length > 0 ? (
                            filteredSchedules.map((appointment, idx) => (
                                <AdminScheduledService key={idx} appointment={appointment} />
                            ))
                        ) : (
                            <div>Nenhum serviço agendado</div>
                        )}
                    </div>
                </div>
            ) : (
                <p>Você não vai achar nada aqui...</p>
            )}
        </div>
    );
};

export default AdminSchedules;
