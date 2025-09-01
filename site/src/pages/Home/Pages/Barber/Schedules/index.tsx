import { useEffect, useState } from 'react';
import style from './Schedules.module.scss';
// @ts-ignore
import api from '@services/api';
// @ts-ignore
import { IScheduledService } from '@types/ScheduledService';

import { parseISO, format, getDay, differenceInMinutes } from 'date-fns';
// import Modal from '@components/Modal';
import ServiceActions from '@components/ServiceActions';
import { fomratTimeDuration } from '@utils/formatTimeDuration';

const Schedules = () => {
    
    const [userNextServices, setUserNextServices] = useState<IScheduledService[]>([]);
    const [userTimes, setUserTimes] = useState<string[]>([]);
    const [userWorkingDays, setUserWorkingDays] = useState<number[]>([]);

    const SLOT_DURATION = 30; // minutos

    useEffect(() => {
        const fetchData = async () => {
            const result = await api.get('/users/barbers/next-services')
            setUserNextServices(result.data.nextServices);
            setUserTimes(result.data.times);
            setUserWorkingDays(result.data.days);
        }

        fetchData();
    }, []);

    return (
        <div className={style.Container}>
            {/* Cabeçalho com dias da semana */}
            <div
                className={style.Header}
                style={{ gridTemplateColumns: `5rem repeat(${userWorkingDays.length}, 1fr)` }}
            >
                <div className={style.TimeColumn}></div>
                {userWorkingDays.map((day, i) => (
                    <div key={i} className={style.DayHeader}>
                        {day}
                    </div>
                ))}
            </div>

            {/* Corpo da agenda */}
            <div className={style.Body} style={{ gridTemplateColumns: `5rem repeat(${userWorkingDays.length}, 1fr)` }} >
                {/* Coluna com horários */}
                <div className={style.TimeColumn}>
                    {userTimes.map((time, i) => (
                        <div key={i} className={style.TimeSlot}>
                            {time}
                        </div>
                    ))}
                </div>

                {/* Colunas da semana */}
                {userWorkingDays.map((_, dayIndex) => (
                    <div key={dayIndex} className={style.DayColumn}>
                        {userTimes.map((time, i) => {
                            // filtra serviços desse dia e horário
                            const servicesAtThisTime = userNextServices.filter(service => {
                                const serviceDate = parseISO(service.date);

                                // getDay: 0 = domingo, 1 = segunda ... 
                                // ajustando para começar na segunda (0 = seg, 6 = dom)
                                const weekday = (getDay(serviceDate) + 6) % 7;

                                const serviceTime = format(serviceDate, "HH:mm");

                                return weekday === dayIndex && serviceTime === time;
                            });

                            return (
                                <div key={i} className={style.Slot}>
                                    {servicesAtThisTime.map((service, idx) => {
                                        const duration = service.service.duration;
                                        const slotsToOccupy = duration / SLOT_DURATION;

                                        return (
                                            <ServiceActions trigger={
                                                <div
                                                    key={idx}
                                                    className={style.ServiceCard}
                                                    style={{
                                                        height: `${slotsToOccupy * 100}%`,
                                                    }}
                                                >
                                                    <div className={style.ServiceDetails}>
                                                        <span className={style.ServiceName}>{service.service.name}</span>
                                                        <div className={style.DetailsLowerLine}>
                                                            <span className={style.ClientName}>{service.costumer.name}</span>
                                                            <span className={style.Duration}>{fomratTimeDuration(service.service.duration)}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            } 
                                            service={service} />
                                        );
                                    })}
                                </div>
                            );
                        })}
                    </div>
                ))}
            </div>
        </div>
    );
}

export default Schedules;