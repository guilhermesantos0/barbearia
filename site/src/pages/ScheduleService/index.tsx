import { useEffect, useState } from 'react';
import style from './ScheduleService.module.scss';

// @ts-ignore
import { IUser } from '@types/User';
import api from '@services/api';
import { IService } from '@types/Service';

const ScheduleService = () => {
    const [user, setUser] = useState<IUser>();
    const [barbers, setBarbers] = useState<IUser[]>([]);
    const [services, setServices] = useState<IService[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            const userResult = await api.get('/users/me');
            setUser(userResult.data);

            const barbersResult = await api.get('/users/barbers');
            setBarbers(barbersResult.data);

            const servicesResult = await api.get('/services');
            setServices(servicesResult.data);
        }

        fetchData();
    },[])


    return (
        <div className={style.Container}>

        </div>
    )
}

export default ScheduleService