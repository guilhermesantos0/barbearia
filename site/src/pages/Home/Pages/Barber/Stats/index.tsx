import { useEffect, useState } from 'react';
import style from './Stats.module.scss';
import api from '@services/api';

const Stats = () => {

    const [userStats, setUserStats] = useState();

    useEffect(() => {
        const fetchData = async () => {
            const response = await api.get('/users/stats');
            setUserStats(response);
        }

        fetchData();
    }, []);

    return (
        <div className={style.Container}>

        </div>
    )
}

export default Stats;