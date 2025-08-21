// @ts-ignore
import { IService } from "@types/Service";

import style from './ServiceCard.module.scss';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// @ts-ignore
import { fomratTimeDuration } from "@utils/formatTimeDuration";
import { IconProp } from "@fortawesome/fontawesome-svg-core";

interface ServiceData {
    id: string,
    name: string,
    price: number,
    duration: number
}

interface ServiceCardProps {
    service: IService,
    selected?: (serviceData: ServiceData) => void
}

import MustacheIcon from '@assets/icons/mustache.svg?react';
// @ts-ignore
import { formatPrice } from "@utils/formatPrice";

const ServiceCard: React.FC<ServiceCardProps> = ({ service, selected }) => {

    const serviceTypesLabel:Record<string, string> = {
        "hair_services": "Cabelo",
        "beard_services": "Barba",
        "stetic_services": "Estética",
        "combo_services": "Combo",
        "other_services": "Outros"
    }

    const handleSelectService = () => {
        if(!selected) return
        selected({
            id: service._id,
            name: service.name,
            price: service.price,
            duration: service.duration
        })
    }

    return (
        <div className={style.Container} onClick={handleSelectService}>
            <h2 className={style.Title}>{service.name}</h2>
            <p className={style.Description}>{service.description}</p>
            <span className={style.Details}>
                <p><FontAwesomeIcon icon='clock' />{fomratTimeDuration(service.duration)}</p>
                <p>
                    {
                        service.category === 'beard_services' ? (
                            <MustacheIcon className={style.Icon} />
                        ) : (
                            <FontAwesomeIcon icon={{
                                'hair_services': 'scissors' as IconProp,
                                'stetic_services': 'droplet' as IconProp,
                                'combo_services': 'gift' as IconProp,
                                'other_services': 'tool' as IconProp
                                }[service.category] || 'question'} 
                            />
                        )
                    }
                    {serviceTypesLabel[service.category]}

                </p>
            </span>
            <p className={style.Price}>{formatPrice(service.price)}</p>
        </div>
    )
}

export default ServiceCard