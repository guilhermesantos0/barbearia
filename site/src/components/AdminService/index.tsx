import { IService } from '@types/Service';
import style from './AdminService.module.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IconProp } from '@fortawesome/fontawesome-svg-core';

import MustacheIcon from '@assets/icons/mustache.svg?react';
import { ReactNode } from 'react';

interface AdminServiceProps {
    service: IService;
}

interface ServiceInfosProps {
    icon: ReactNode,
    label: string,
    value: string
}

const AdminService:React.FC<AdminServiceProps> = ({ service }) => {

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

    const serviceInfosArray = [
        
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
        </div>
    )
}

export default AdminService