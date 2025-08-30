import { useEffect, useState } from 'react';
import style from './Schedules.module.scss';
import { IUser } from '@types/User';
import api from '@services/api';

const Schedules = () => {
    
    const [user, setUser] = useState<IUser | null>();
    
    useEffect(() => {
        const fetchData = async () => {
            const result = await api.get('/users/me')
            setUser(result.data);
        }

        fetchData();
    }, [])

    return (
        <div className={style.Container}>

        </div>
    )
}

export default Schedules;