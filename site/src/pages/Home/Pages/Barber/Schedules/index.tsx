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
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IconProp } from '@fortawesome/fontawesome-svg-core';

interface ResponseType {
    days: string[],
    nextServices: IScheduledService[],
    times: string[]
}

const BarberSchedules = () => {
    
    const { user } = useUser();

    const SLOT_DURATION = 30; 

    const statusMap: Record<string, string> = {
        'Pendente': style.Pending,
        'Confirmado': style.Confirmed,
        'Cancelado': style.Canceld,
        'Atrasado': style.Delayed,
        'Em andamento': style.Running,
        'Finalizado': style.Complete
    };

    const { data: nextServices } = useQuery<ResponseType>({
        // @ts-ignore
        queryKey: ['nextServices', user?.sub],
        queryFn: async () => {
            const response = await api.get(`/users/barbers/next-services`);
            return response.data;
        },
        enabled: !!user?.sub
    })


    return (
        <div className={style.Container}>
            <div
                className={style.Header}
                style={{ gridTemplateColumns: `5rem repeat(${nextServices?.days.length || 0}, 1fr)` }}
            >
                <div className={style.TimeColumn}></div>
                {nextServices?.days.map((day, i) => (
                    <div key={i} className={style.DayHeader}>
                        {day}
                    </div>
                ))}
            </div>

            <div className={style.Body} style={{ gridTemplateColumns: `5rem repeat(${nextServices?.days.length || 0}, 1fr)` }} >
                <div className={style.TimeColumn}>
                    {nextServices?.times.map((time, i) => (
                        <div key={i} className={style.TimeSlot}>
                            {time}
                        </div>
                    ))}
                </div>

                {nextServices?.days.map((currentDay, dayIndex) => (
                    <div key={dayIndex} className={style.DayColumn}>
                        {nextServices?.times.map((time, timeIndex) => {
                            const servicesAtThisTime = nextServices?.nextServices?.filter(service => {
                                try {
                                    const serviceDate = parseISO(service.date);
                                    const weekday = getDay(serviceDate);
                                    const serviceTime = format(serviceDate, "HH:mm");
                                    
                                    const dayNamesMap = {
                                        0: 'Dom', 1: 'Seg', 2: 'Ter', 3: 'Qua', 
                                        4: 'Qui', 5: 'Sex', 6: 'Sáb'
                                    };
                                    
                                    const serviceDayAbbrev = dayNamesMap[weekday];
                                    
                                    const mappedDayIndex = nextServices.days.findIndex(day => day === serviceDayAbbrev);
                                    
                                    const dayMatches = mappedDayIndex === dayIndex && mappedDayIndex !== -1;
                                    
                                    let timeMatches = false;
                                    
                                    if (dayMatches) {
                                        const serviceMinutes = parseInt(serviceTime.split(':')[0]) * 60 + parseInt(serviceTime.split(':')[1]);
                                        const slotMinutes = parseInt(time.split(':')[0]) * 60 + parseInt(time.split(':')[1]);
                                        
                                        const slotDuration = SLOT_DURATION;
                                        timeMatches = serviceMinutes >= slotMinutes && serviceMinutes < (slotMinutes + slotDuration);
                                    }
                                    
                                    const matches = dayMatches && timeMatches;
                                    
                                    return matches;
                                    
                                } catch (error) {
                                    console.error('Erro ao processar serviço:', service, error);
                                    return false;
                                }
                            }) || [];

                            return (
                                <div key={timeIndex} className={style.Slot}>
                                    {servicesAtThisTime.map((service, serviceIndex) => {
                                        const duration = service.service.duration;
                                        const slotsToOccupy = duration / SLOT_DURATION;

                                        return (
                                            <ServiceActions 
                                                key={`${service._id || serviceIndex}`}
                                                trigger={
                                                    <div
                                                        className={style.ServiceCard}
                                                        style={{
                                                            height: `${slotsToOccupy * 100}%`
                                                        }}
                                                    >
                                                        <div className={style.ServiceDetails}>
                                                            <div className={style.MainDetails}>
                                                                <span className={style.ServiceName}>{service.service.name}</span>
                                                                <p className={`${style.Status} ${statusMap[service.status] || style.Pending}`}>
                                                                    <FontAwesomeIcon
                                                                        icon={{
                                                                            'Pendente': 'clock' as IconProp,
                                                                            'Confirmado': 'calendar-check' as IconProp,
                                                                            'Cancelado': 'times' as IconProp,
                                                                            'Atrasado': 'running' as IconProp,
                                                                            'Em andamento': 'spinner' as IconProp,
                                                                            'Finalizado': 'check' as IconProp
                                                                        }[service.status] || 'question'} 

                                                                        spin={service.status === 'Em andamento'}
                                                                    /> 
                                                                </p>
                                                            </div>
                                                            <div className={style.DetailsLowerLine}>
                                                                <span className={style.ClientName}>{service.costumer.name}</span>
                                                                <span className={style.Duration}>{fomratTimeDuration(service.service.duration)}</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                } 
                                                service={service} 
                                            />
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

export default BarberSchedules;