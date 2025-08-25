// @ts-ignore
import { IUser } from '@types/User'
import style from './BarberCard.module.scss'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useEffect, useState } from 'react'
import api from '../../services/api'

interface BarberData {
    id: string,
    name: string,
    profilePic: string,
    rate: number,
    ratingCount: number
}

interface BarberCardProps {
    barber: IUser,
    selected?: (barberData: BarberData) => void;
}

const BarberCard: React.FC<BarberCardProps> = ({ barber, selected }) => {
    const [availableToday, setAvailableToday] = useState<boolean>();

    useEffect(() => {
        const fetchData = async () => {
            const isAvailableTodayResult = await api.get(`/users/barbers/${barber._id}/available-today`)
            console.log(isAvailableTodayResult.data)
            setAvailableToday(isAvailableTodayResult.data);
        }

        fetchData();
    }, [])

    const handleSelectBarber = () => {
        if (!selected) return
        selected({
            id: barber._id,
            name: barber.name,
            profilePic: barber.profilePic,
            rate: barber.averageRating,
            ratingCount: barber.ratingCount
        })
    }

    return (
        <div className={style.Container} onClick={handleSelectBarber}>
            <img src={barber.profilePic} alt="" className={style.BarberImage} loading='lazy' />
            <div className={style.BarberDetails}>
                <span className={style.BarberName}>{barber.name}</span>
                <span className={style.BarberRating}><FontAwesomeIcon icon="star" /> {barber.averageRating} &#40;{barber.ratingCount} avaliações&#41;</span>
                    {
                        availableToday && availableToday ? (
                            <span className={`${style.Availability} ${style.Available}`}>
                                <FontAwesomeIcon icon={['far', "check-circle"]} />
                                <span>Disponível Hoje!</span>
                            </span>     
                        ) : (
                            <span className={`${style.Availability} ${style.Unavailable}`}>
                                <FontAwesomeIcon icon={['far', 'xmark-circle']} />
                                <span>Indisponível Hoje!</span>
                            </span>
                        )
                    }
            </div>
        </div>
    )
}

export default BarberCard