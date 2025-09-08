import { useUser } from '@contexts/UserContext';
import style from './ConfirmSchedules.module.scss'
import { useEffect, useState } from 'react';
// @ts-ignore
import api from '@services/api';
// @ts-ignore
import { IScheduledService } from '@types/ScheduledService';

import PendingSchedule from '@components/PendingSchedule';

const BarberConfirmSchedules = () => {
    const { user } = useUser();

    const [pendingSchedules, setPendingSchedules] = useState<IScheduledService[]>([]);

    const fetchData = async () => {
        if(user) {
            const unConfirmedScheduled = await api.get(`/scheduledservices/${(user as any).sub}/unconfirmed`);
            console.log(unConfirmedScheduled.data)
            setPendingSchedules(unConfirmedScheduled.data);
        }
    }

    useEffect(() => {
        fetchData();
    }, [user])

    return (
        <div className={style.Container}>
            <h1>Confirmar Agendamentos</h1>
            {
                user && pendingSchedules.length > 0 && (
                    <div className={style.PendingSchedules}>
                        {
                            pendingSchedules.map((schedule, idx) => (
                                <PendingSchedule key={idx} schedule={schedule} onConfirm={fetchData} />
                            ))
                        }
                    </div>
                )
            }
        </div>
    );
};

export default BarberConfirmSchedules;