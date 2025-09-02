import { useEffect, useState } from 'react';
import style from './Schedules.module.scss';
// @ts-ignore
import api from '@services/api';
// @ts-ignore
import { IScheduledService } from '@types/ScheduledService';

import { parseISO, format, getDay, differenceInMinutes } from 'date-fns';
// import Modal from '@components/Modal';
import ServiceActions from '@components/ServiceActions';
// @ts-ignore
import { fomratTimeDuration } from '@utils/formatTimeDuration';
import { useQuery } from '@tanstack/react-query';
import { useUser } from '@contexts/UserContext';

interface ResponseType {
    days: string[],
    nextServices: IScheduledService[],
    times: string[]
}

const Schedules = () => {
    
    const { user } = useUser();

    const SLOT_DURATION = 30; 

    // useEffect(() => {
    //     const fetchData = async () => {
    //         const result = await api.get('/users/barbers/next-services')
    //         setUserNextServices(result.data.nextServices);
    //         setUserTimes(result.data.times);
    //         setUserWorkingDays(result.data.days);
    //     }

    //     fetchData();
    // }, [])

    const { data: nextServices } = useQuery<ResponseType>({
        // @ts-ignore
        queryKey: ['nextServices', user?.sub],
        queryFn: async () => {
            console.log('teste')
            const response = await api.get(`/users/barbers/next-services`);
            console.log(response)
            return response.data;
        },
        enabled: true
    })

    return (
        <div className={style.Container}>
            <div
                className={style.Header}
                style={{ gridTemplateColumns: `5rem repeat(${nextServices?.days.length}, 1fr)` }}
            >
                <div className={style.TimeColumn}></div>
                {nextServices?.days.map((day, i) => (
                    <div key={i} className={style.DayHeader}>
                        {day}
                    </div>
                ))}
            </div>

            <div className={style.Body} style={{ gridTemplateColumns: `5rem repeat(${nextServices?.days.length}, 1fr)` }} >
                <div className={style.TimeColumn}>
                    {nextServices?.times.map((time, i) => (
                        <div key={i} className={style.TimeSlot}>
                            {time}
                        </div>
                    ))}
                </div>

                {nextServices?.days.map((_, dayIndex) => (
                    <div key={dayIndex} className={style.DayColumn}>
                        {nextServices?.times.map((time, i) => {
                            const servicesAtThisTime = nextServices?.nextServices?.filter(service => {
                                // @ts-ignore
                                const serviceDate = parseISO(service.date);

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