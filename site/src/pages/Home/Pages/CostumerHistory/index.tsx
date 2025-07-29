import style from './CostumerHistory.module.scss';

import { useUser } from '@contexts/UserContext';

import Filter from '@assets/icons/filter.svg?react';

import { SelectMenu } from '@components/SelectMenu';
import { useEffect, useState } from 'react';
import { ICostumer } from '@types/Costumer';


const CostumerHistory  = () => {
    const { user } = useUser();
    
    const [period, setPeriod] = useState();
    const [barber, setBarber] = useState();
    const [filteredService, setFilteredService] = useState();
    const [rate, setRate] = useState();
    
    const [barbers, setBarbers] = useState<any>([]);
    const [services, setServices] = useState<any>([]);

    useEffect(() => {
        if (!user || user.role !== 0) return;

        (user as ICostumer).history.forEach((service) => {

            const setBarber = () => {
                if (barbers.some((barber) => barber.value === service.barber._id)) return;
                setBarbers(prev => [...prev, { value: service.barber._id, label: service.barber.name }]);
            }

            const setService = () => {
                if(services.some((thisService) => thisService.value === service.service._id)) return;
                setServices(prev => [...prev, { value: service.service._id, label: service.service.name }]);
            }

        })
    }, [user])

    const filters = [
        {
            placeholder: 'Período',
            value: period,
            onChange: setPeriod,
            options: [
                {
                    value: 'lastweek',
                    label: '1 Semana'
                },
                {
                    value: 'lastmonth',
                    label: '1 Mês'
                },
                {
                    value: 'lastyear',
                    label: '1 Ano'
                },
                {
                    value: 'full',
                    label: 'Sempre'
                }
            ]
        },
        {
            placeholder: 'Barbeiro',
            value: barber,
            onChange: setBarber,
            options: barbers
        },
        {
            placeholder: 'Serviço',
            value: filteredService,
            onChange: setFilteredService,
            options: services
        },
        {
            placeholder: 'Avaliação',
            value: rate,
            onChange: setRate,
            options: [
                {
                    value: '1star',
                    label: '1 Estrela'
                },
                {
                    value: '2star',
                    label: '2 Estrelas'
                },
                {
                    value: '3star',
                    label: '3 Estrelas'
                },
                {
                    value: '4star',
                    label: '4 Estrelas'
                },
                {
                    value: '5star',
                    label: '5 Estrelas'
                }
            ]
        }
    ]
    return (
        <div className={style.Container}>
            <h1>Histórico</h1>
            <div className={style.PageContent}>
                <div className={style.ServicesArea}>
                    
                </div>
                <div className={style.FilterArea}>
                    <p><Filter className={style.Icon} /> Filtros</p>
                    <ul className={style.FilterOptions}>
                        <li>
                            <SelectMenu options={testOptions} placeholder='Selecione' onChange={setTestee} value={testee} />
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    )
}

export default CostumerHistory;