import { useEffect, useState } from 'react';
import style from './HistoryService.module.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

// @ts-ignore
import { IScheduledService } from '@types/ScheduledService';

import ScheduleAgain from '@assets/icons/schedule_again.svg?react';
import Eye from '@assets/icons/eye.svg?react';

interface Props {
    service: IScheduledService
}

// @ts-ignore
import { formatDate } from '@utils/formatDate';

const HistoryService:React.FC<Props> = ({ service }) => {

    const [starsComponent, setStarsComponent] = useState<React.ReactNode>();

    useEffect(() => {
        if (service.rated) {
            const stars = [];

            for (let i = 0; i < service.rate.stars; i++) {
                stars.push(<FontAwesomeIcon key={`filled=${i}`} icon='star' />);
            }

            for (let i = 0; i < (5 - service.rate.stars); i++) {
                stars.push(<FontAwesomeIcon  key={`empty-${i}`} icon={['far', 'star']} />)
            }
            setStarsComponent(<div className={style.Stars}>{stars}</div>)
        } else {
            setStarsComponent(<p>Toque para avaliar...</p>);
        }
    }, [service])

    return (
        <div className={style.Container}>
            <p className={style.Title}>{service.service.name}</p>
            <div className={style.Details}>
                <p className={style.AditionalInfo}><FontAwesomeIcon className={style.DetailsIcon} icon="user" /> {service.barber.name}</p>
                <p className={style.AditionalInfo}><FontAwesomeIcon className={style.DetailsIcon} icon="calendar" />{formatDate(service.date) || 'Carregando data...'}</p>
            </div>
            <div className={style.BottomInfos}>
                {starsComponent}
                <div className={style.ActionButtons}>
                    <ScheduleAgain className={style.Icon} />
                    <Eye className={style.Icon} />
                    <FontAwesomeIcon icon="trash" className={`${style.Icon} ${style.Trash}`} /> 
                </div>
            </div>
        </div>
    )
}

export default HistoryService;