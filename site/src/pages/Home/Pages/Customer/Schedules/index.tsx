import style from './Schedules.module.scss'

import { useUser } from '@contexts/UserContext'
import ScheduledService from '@components/ScheduledService';

// @ts-ignore
import { IUser } from '@types/User';
// @ts-ignore
import { IScheduledService } from '@types/ScheduledService';

import { PlusIcon } from '@radix-ui/react-icons';
import { useEffect, useState } from 'react';
//@ts-ignore
import api from '@services/api';
import { Link } from 'react-router-dom';

const CostumerSchedules = () => {

    const [user, setUser] = useState<IUser | null>();

    useEffect(() => {
        const fetchData = async () => {
            const result = await api.get('/users/me')
            setUser(result.data);
        }

        fetchData();
    }, [])

    const isCostumer = (user: IUser) => {
        return user.role === 0
    }

    return (
        <div className={style.Container}>
            {
                user && isCostumer(user) && (
                    <>
                        <h1 className={style.Welcome}>Olá, {user.name.split(' ')[0]}</h1>
                        <div className={style.InlineElements}>
                            <h3 className={style.Subtitle}>Confira seus agendamentos</h3>
                            <Link to='/agendar-servico' className={style.ScheduleNew}><PlusIcon className={style.Icon} /> Agendar Serviço</Link>
                        </div>
                        <div className={style.PageContent}>
                            {
                                user.history.length > 0 ? (
                                    <div className={style.UserServices}>
                                        {
                                            user.history.map((service: IScheduledService, idx: number) => (
                                                <>
                                                    {
                                                        service.status !== 'Finalizado' && (
                                                            <ScheduledService service={service} view="Costumer" key={idx} />
                                                        )
                                                    }
                                                </>
                                            ))
                                        }
                                    </div>
                                ) : (
                                    <></>
                                )                       
                            }
                        </div>
                    </>
                )
            }
        </div>
    )
}

export default CostumerSchedules