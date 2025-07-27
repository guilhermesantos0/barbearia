import style from './ScheduledService.module.scss';

import { IScheduledService } from '../../types/ScheduledService';
import { useEffect, useState } from 'react';
import { Pencil1Icon, TrashIcon } from '@radix-ui/react-icons';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IconProp } from '@fortawesome/fontawesome-svg-core';

interface Props {
    service: IScheduledService,
    view: 'Costumer' | 'Employee'
}

const ScheduledService:React.FC<Props> = ({ service, view }) => {

    const [serviceDate, setServiceDate] = useState('');
    const [serviceStatusStyle, setServiceStatusStyle] = useState('')

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
        
        const statusMap: Record<string, string> = {
            'Pendente': style.Pending,
            'Confirmado': style.Confirmed,
            'Cancelado': style.Canceld,
            'Atrasado': style.Delayed,
            'Em andamento': style.Running,
            'Finalizado': style.Complete
        };
        
        setServiceStatusStyle(statusMap[service.status] || style.Pending);
    }, [service]);

    return (
        <div className={style.Container}>
            {
                view === 'Costumer' ? (
                    <FontAwesomeIcon icon="trash" className={`${style.Icon} ${style.Trash}`} />
                ) : (
                    <Pencil1Icon className={`${style.Icon} ${style.Pencil}`} />
                )
            }
            <div className={style.ServiceInfos}>
                <p className={style.Title}>{service.service.name}</p>
                <div className={style.Details}>
                    <p><FontAwesomeIcon icon="user" /> {service.barber.name}</p>
                    <p className={style.Pending}><FontAwesomeIcon icon="calendar" />{serviceDate || 'Carregando data...'}</p>
                </div>
                <p className={`${style.Status} ${serviceStatusStyle}`}>
                    <FontAwesomeIcon 
                        
                        icon={{
                            'Pendente': 'clock' as IconProp,
                            'Confirmado': 'check' as IconProp,
                            'Cancelado': 'times' as IconProp,
                            'Atrasado': 'running' as IconProp,
                            'Em andamento': 'spinner' as IconProp,
                            'Finalizado': 'calendar-check' as IconProp
                        }[service.status] || 'question'} 

                        spin={service.status === 'Em andamento'}
                    /> {service.status}
                </p>
            </div>
        </div>
    )
}

export default ScheduledService