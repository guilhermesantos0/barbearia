import { IService } from '@types/Service';
import style from './AdminService.module.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IconProp } from '@fortawesome/fontawesome-svg-core';

import MustacheIcon from '@assets/icons/mustache.svg?react';
import { ReactNode } from 'react';
import { fomratTimeDuration } from '@utils/formatTimeDuration';
import { formatPrice } from '@utils/formatPrice';

interface AdminServiceProps {
    service: IService;
}

interface ServiceInfosProps {
    icon: ReactNode,
    label: string,
    value?: string,
    children?: ReactNode
}

const AdminService:React.FC<AdminServiceProps> = ({ service }) => {

    const ServiceInfos:React.FC<ServiceInfosProps> = ({ icon, label, value, children }) => {
        return (
            <div className={style.ServiceInfo}>
                <div className={style.ServiceInfoLabelSection}>
                    {icon}
                    <h4 className={style.ServiceInfoLabel}>{label}</h4>
                </div>
                {
                    value && (
                        <h3 className={style.ServiceInfoValue}>{value}</h3>
                    )
                }
                {
                    children && ( children )
                }
            </div>
        )
    }

    const serviceInfosArray = [
        {
            icon: <FontAwesomeIcon icon={['far', 'clock']} />,
            label: 'Duração',
            value: fomratTimeDuration(service.duration)
        },
        {
            icon: <FontAwesomeIcon icon='dollar' />,
            label: 'Preço',
            value: formatPrice(service.price)
        },
        {
            icon: <FontAwesomeIcon icon='staff' />,
            label: 'Status',
            children: <div className={`${style.Status} ${service.active ? style.Active : style.Inactive}`} > {service.active ? 'Ativo' : 'Inativo'} </div>
        }
    ]

    return (
        <div className={style.Container}>
            <div className={style.TopInfos}>
                <div className={style.IconContainer}>
                    {
                        service.category === 'beard_services' ? (
                            <MustacheIcon className={style.Icon} />
                        ) : (
                            <FontAwesomeIcon className={style.Icon} icon={{
                                'hair_services': 'scissors' as IconProp,
                                'stetic_services': 'droplet' as IconProp,
                                'combo_services': 'gift' as IconProp,
                                'other_services': 'tool' as IconProp
                                }[service.category] || 'question'} 
                            />
                        )
                    }
                </div>
                <div className={style.TextsContainer}>
                    <h2 className={style.Name}>{service.name}</h2>
                    <h4 className={style.Description}>{service.description}</h4>
                </div>
            </div>
            <div className={style.ServiceInfos}>
                {
                    serviceInfosArray.map((serviceInfo, idx) => (
                        <ServiceInfos icon={serviceInfo.icon} label={serviceInfo.label} value={serviceInfo.value || undefined} children={serviceInfo.children || undefined} />
                    ))
                }
            </div>
        </div>
    )
}

export default AdminService