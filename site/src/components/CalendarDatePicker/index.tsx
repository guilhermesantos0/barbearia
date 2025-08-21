import { useState, useMemo, useEffect } from "react";
import { addDays, startOfWeek, endOfWeek, isSameDay, format, parseISO } from "date-fns";
import { ptBR } from "date-fns/locale";
import style from "./CalendarDatePicker.module.scss";

interface BarberDay {
    day: string;
    available: boolean;
}

interface CalendarDatePickerProps {
    days: BarberDay[];
    availableToday?: boolean,
    selected: (day: Date) => void;
}

const CalendarDatePicker: React.FC<CalendarDatePickerProps> = ({ days, availableToday, selected }) => {
    const [selectedDay, setSelectedDay] = useState<Date | null>(null);

    const today = new Date();
    const next15Days = Array.from({ length: 16 }, (_, i) => addDays(today, i));

    const weeksMatrix = useMemo(() => {
        const startDate = startOfWeek(next15Days[0], { locale: ptBR });
        const endDate = endOfWeek(next15Days[next15Days.length - 1], { locale: ptBR });

        const matrix: Date[][] = [];
        let current = startDate;
        let week: Date[] = [];

        while (current <= endDate) {
            for (let i = 0; i < 7; i++) {
                week.push(current);
                current = addDays(current, 1);
            }
            matrix.push(week);
            week = [];
        }
        return matrix;
    }, [next15Days]);

    const handleSelect = (date: Date, available: boolean) => {
        if (!available) return;
        setSelectedDay(date);
        selected(date);
    };

    const isAvailable = (date: Date) => {
        const formatted = format(date, "yyyy-MM-dd");
        return days.find(d => d.day === formatted)?.available ?? false;
    };

    useEffect(() => {
        if (!days) return
        if (!availableToday) days[0].available = false
    }, [days])

    return (
        <div className={style.Container}>
            <div className={style.WeekDays}>
                {["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"].map(d => (
                    <div key={d} className={style.WeekDay}>{d}</div>
                ))}
            </div>

            {weeksMatrix.map((week, i) => (
                <div key={i} className={style.WeekRow}>
                    {week.map(day => {
                        const available = isAvailable(day);
                        const selected = selectedDay && isSameDay(day, selectedDay);
                        const todayDay = isSameDay(day, new Date());
                        const inPeriod = next15Days.some(d => isSameDay(d, day));

                        return (
                            <button
                                key={day.toString()}
                                onClick={() => handleSelect(day, available)}
                                disabled={!available || !inPeriod}
                                className={`
                                    ${style.Day} 
                                    ${available ? style.Available : style.Unavailable} 
                                    ${selected ? style.Selected : ""} 
                                    ${todayDay ? style.Today : ""} 
                                    ${!inPeriod ? style.OtherMonth : ""}
                                `}
                            >
                                {format(day, "d")}
                            </button>
                        )
                    })}
                </div>
            ))}
        </div>
    );
};

export default CalendarDatePicker;
