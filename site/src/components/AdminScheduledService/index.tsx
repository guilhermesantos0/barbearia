// @ts-ignore
import { IScheduledService } from '@types/ScheduledService';
import style from './AdminScheduledService.module.scss';
import { ReactNode } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import BarberIcon from '@assets/icons/barber.svg?react';
// @ts-ignore
import { formatDate } from '@utils/formatDate';
// @ts-ignore
import { fomratTimeDuration } from '@utils/formatTimeDuration';
// @ts-ignore
import { formatPrice } from '@utils/formatPrice';

interface AdminScheduledServiceProps {
    appointment: IScheduledService
}

interface ServiceInfosProps {
    icon: ReactNode,
    label: string,
    value: string
}

const AdminScheduledService: React.FC<AdminScheduledServiceProps> = ({ appointment }) => {
    
    const ServiceInfos:React.FC<ServiceInfosProps> = ({ icon, label, value }) => {
        return (
            <div className={style.ServiceInfo}>
                {icon}
                <h4 className={style.ServiceInfoLabel}>{label}</h4>
                <h3 className={style.ServiceInfoValue}>{value}</h3>
            </div>
        )
    }

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
            <h2>{appointment.service.name}</h2>
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