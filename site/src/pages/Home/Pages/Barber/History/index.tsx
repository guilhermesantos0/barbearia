import style from './History.module.scss';
import { useEffect, useMemo, useState } from 'react';

import Filter from '@assets/icons/filter.svg?react';
import { SelectMenu } from '@components/SelectMenu';
import HistoryService from '@components/HistoryService';

// @ts-ignore
import { IUser } from '@types/User';
// @ts-ignore
import api from '@services/api';

const History = () => {
    const [user, setUser] = useState<IUser | null>(null);

    const fetchData = async () => {
        const result = await api.get('/users/me');
        setUser(result.data);
    };

    useEffect(() => {
        fetchData();
    }, []);

    const [period, setPeriod] = useState<string | undefined>('');
    const [customer, setCustomer] = useState<string | undefined>('');
    const [filteredService, setFilteredService] = useState<string | undefined>('');
    const [rate, setRate] = useState<string | undefined>('');

    const [customers, setCustomers] = useState<Array<{ value: string; label: string }>>([]);
    const [services, setServices] = useState<Array<{ value: string; label: string }>>([]);

    useEffect(() => {
        if (!user || user.role !== 1) return; // 1 = barbeiro

        const uniqueCustomers = new Map<string, string>();
        const uniqueServices = new Map<string, string>();

        user.history.forEach((service) => {
            if (!uniqueCustomers.has(service.costumer._id)) {
                uniqueCustomers.set(service.costumer._id, service.costumer.name);
            }

            if (!uniqueServices.has(service.service._id)) {
                uniqueServices.set(service.service._id, service.service.name);
            }
        });

        setCustomers(Array.from(uniqueCustomers, ([value, label]) => ({ value, label })));
        setServices(Array.from(uniqueServices, ([value, label]) => ({ value, label })));
    }, [user]);

    const filters = [
        {
            placeholder: 'Período',
            value: period,
            onChange: (value: string | undefined) => setPeriod(value),
            options: [
                { value: '1w', label: '1 Semana' },
                { value: '1month', label: '1 Mês' },
                { value: '1y', label: '1 Ano' },
                { value: 'full', label: 'Sempre' }
            ]
        },
        {
            placeholder: 'Cliente',
            value: customer,
            onChange: (value: string | undefined) => setCustomer(value),
            options: customers
        },
        {
            placeholder: 'Serviço',
            value: filteredService,
            onChange: (value: string | undefined) => setFilteredService(value),
            options: services
        },
        {
            placeholder: 'Avaliação',
            value: rate,
            onChange: (value: string | undefined) => setRate(value),
            options: [
                { value: '1star', label: '1 Estrela' },
                { value: '2star', label: '2 Estrelas' },
                { value: '3star', label: '3 Estrelas' },
                { value: '4star', label: '4 Estrelas' },
                { value: '5star', label: '5 Estrelas' }
            ]
        }
    ];

    const isBarber = (user: IUser) => {
        return user.role === 1;
    };

    const filteredHistory = useMemo(() => {
        if (!user || user.role !== 1) return [];

        let updatedHistory = [...user.history];

        if (customer) {
            updatedHistory = updatedHistory.filter(
                (service) => service.costumer._id === customer
            );
        }

        if (filteredService) {
            updatedHistory = updatedHistory.filter(
                (service) => service.service._id === filteredService
            );
        }

        if (rate) {
            const starNumber = parseInt(rate[0]);
            updatedHistory = updatedHistory.filter(
                (service) => service.rated && service.rate.stars === starNumber
            );
        }

        if (period && period !== 'full') {
            const now = new Date();
            const cutoffDate = new Date(now);

            switch (period) {
                case '1w':
                    cutoffDate.setDate(now.getDate() - 7);
                    break;
                case '1month':
                    cutoffDate.setMonth(now.getMonth() - 1);
                    break;
                case '1y':
                    cutoffDate.setFullYear(now.getFullYear() - 1);
                    break;
                default:
                    break;
            }

            updatedHistory = updatedHistory.filter(
                (service) => new Date(service.date) >= cutoffDate
            );
        }

        updatedHistory.sort(
            (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
        );

        return updatedHistory.filter((service) => service.status === 'Finalizado');
    }, [user, customer, filteredService, rate, period]);

    return (
        <div className={style.Container}>
            <h1>Histórico</h1>
            {user && isBarber(user) && (
                <div className={style.PageContent}>
                    <div className={style.ServicesArea}>
                        {filteredHistory.length > 0 ? (
                            <div className={style.UserHistory}>
                                {filteredHistory.map((service, index) => (
                                    <HistoryService
                                        key={index}
                                        service={service}
                                        onAction={fetchData}
                                        view="barber"
                                    />
                                ))}
                            </div>
                        ) : (
                            <p className={style.NoResults}>
                                Nenhum serviço encontrado com os filtros selecionados
                            </p>
                        )}
                    </div>

                    <div className={style.FilterArea}>
                        <p className={style.Title}>
                            <Filter className={style.Icon} /> Filtros
                        </p>
                        <ul className={style.FilterOptions}>
                            {filters.map((filter, index) => (
                                <li key={index}>
                                    <SelectMenu
                                        placeholder={filter.placeholder}
                                        value={filter.value}
                                        onChange={filter.onChange}
                                        options={filter.options}
                                        className={style.SelectMenu}
                                    />
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            )}
        </div>
    );
};

export default History;
