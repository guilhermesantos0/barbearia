// @ts-ignore
import { IScheduledService } from '@types/ScheduledService';
import style from './AdminScheduledService.module.scss';
import { ReactNode, useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import BarberIcon from '@assets/icons/barber.svg?react';
// @ts-ignore
import { formatDate } from '@utils/formatDate';
// @ts-ignore
import { fomratTimeDuration } from '@utils/formatTimeDuration';
// @ts-ignore
import { formatPrice } from '@utils/formatPrice';
import { IconProp } from '@fortawesome/fontawesome-svg-core';

interface AdminScheduledServiceProps {
    appointment: IScheduledService
}

interface ServiceInfosProps {
    icon: ReactNode,
    label: string,
    value: string
}

const AdminScheduledService: React.FC<AdminScheduledServiceProps> = ({ appointment }) => {
    
    const [serviceStatusStyle, setServiceStatusStyle] = useState<string>();

    const ServiceInfos:React.FC<ServiceInfosProps> = ({ icon, label, value }) => {
        return (
            <div className={style.ServiceInfo}>
                <div className={style.ServiceInfoLabelSection}>
                    {icon}
                    <h4 className={style.ServiceInfoLabel}>{label}</h4>
                </div>
                <h3 className={style.ServiceInfoValue}>{value}</h3>
            </div>
        )
    }

    useEffect(() => {
        
        const statusMap: Record<string, string> = {
            'Pendente': style.Pending,
            'Confirmado': style.Confirmed,
            'Cancelado': style.Canceld,
            'Atrasado': style.Delayed,
            'Em andamento': style.Running,
            'Finalizado': style.Complete
        };
        
        setServiceStatusStyle(statusMap[appointment.status] || style.Pending);
    }, [appointment]);

    const serviceInfosArray = [
        {
            icon: <FontAwesomeIcon className={style.Icon} icon='user' />,
            label: 'Cliente',
            value: appointment.costumer.name
        },
        {
            icon: <BarberIcon className={style.Icon} />,
            label: 'Barbeiro',
            value: appointment.barber.name
        },
        {
            icon: <FontAwesomeIcon className={style.Icon} icon='scissors' />,
            label: 'Serviço',
            value: appointment.service.name
        },
        {
            icon: <FontAwesomeIcon className={style.Icon} icon={['far', 'calendar']} />,
            label: 'Data',
            value: formatDate(appointment.date)
        },
        {
            icon: <FontAwesomeIcon className={style.Icon} icon={['far', 'clock']} />,
            label: 'Duração',
            value: fomratTimeDuration(appointment.service.duration)
        },
        {
            icon: <FontAwesomeIcon className={style.Icon} icon='dollar' />,
            label: 'Preço',
            value: formatPrice(appointment.service.price * ( (100 - appointment.discountApplied) / 100 ))
        }
    ]

    return (
        <div className={style.Container}>
            <div className={style.MainInfos}>
                <div className={style.Left}>
                    <h2>{appointment.service.name}</h2>
                    <div className={`${style.Status} ${serviceStatusStyle}`}>
                        <FontAwesomeIcon 
                                                                
                            icon={{
                                'Pendente': 'clock' as IconProp,
                                'Confirmado': 'check' as IconProp,
                                'Cancelado': 'times' as IconProp,
                                'Atrasado': 'running' as IconProp,
                                'Em andamento': 'spinner' as IconProp,
                                'Finalizado': 'calendar-check' as IconProp
                            }[appointment.status] || 'question'} 

                            spin={appointment.status === 'Em andamento'}
                        /> {appointment.status}
                    </div>
                </div>
                <div className={style.Actions}>
                    <button className={style.ActionButton}><FontAwesomeIcon className={style.Icon} icon={['far', 'eye']} /></button>
                    <button className={style.ActionButton}><FontAwesomeIcon className={style.Icon} icon='pencil' /></button>
                    {
                        appointment.status === 'Cancelado' ? (
                            <button className={`${style.ActionButton} ${style.Red}`}><FontAwesomeIcon className={style.Icon} icon='trash' /></button>
                        ) : (
                            <button className={`${style.ActionButton} ${style.Red}`}><FontAwesomeIcon className={style.Icon} icon='xmark' /></button>
                        )
                    }
                </div>
            </div>
            <div className={style.ServiceInfos}>
                {
                    serviceInfosArray.map((serviceInfo, idx) => (
                        <ServiceInfos icon={serviceInfo.icon} label={serviceInfo.label} value={serviceInfo.value} /> 
                    ))
                }
            </div>
        </div>
    )
}

export default AdminScheduledService