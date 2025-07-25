import style from './ScheduledService.module.scss';

import { IScheduledService } from '../../types/ScheduledService';
import { useEffect, useState } from 'react';
import { Pencil1Icon, TrashIcon } from '@radix-ui/react-icons';

interface Props {
    service: IScheduledService,
    view: 'Costumer' | 'Employee'
}

const ScheduledService:React.FC<Props> = ({ service, view }) => {

    const [serviceDate, setServiceDate] = useState('');

    const formatDate = (date: Date | string) => {
        const d = typeof date === 'string' ? new Date(date) : date;
        
        if (isNaN(d.getTime())) return 'Data inválida';
        
        const day = d.getDate().toString().padStart(2, '0');
        const month = (d.getMonth() + 1).toString().padStart(2, '0');
        const year = d.getFullYear();
        const hours = d.getHours().toString().padStart(2, '0');
        const minutes = d.getMinutes().toString().padStart(2, '0');
        
        return `${day}/${month}/${year} às ${hours}:${minutes}`;
    };

    useEffect(() => {
        if (!service?.date) return;
        setServiceDate(formatDate(service.date));
    }, [service])

    return (
        <div className={style.Container}>
            <div className={style.TopSection}>
                <h1 className={style.Title}>{service.service.name}</h1>
                {
                    view === 'Costumer' ? (
                        <TrashIcon className={`${style.Icon} ${style.Trash}`} />
                    ) : (
                        <Pencil1Icon className={`${style.Icon} ${style.Pencil}`} />
                    )
                }
            </div>
            <h2>{service.barber.name}</h2>
            <h2>{serviceDate || 'Carregando data...'}</h2>
        </div>
    )
}

export default ScheduledService