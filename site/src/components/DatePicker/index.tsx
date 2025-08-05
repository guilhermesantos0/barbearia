import { useState } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "@radix-ui/react-popover";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@radix-ui/react-dropdown-menu";
import { ChevronLeftIcon, ChevronRightIcon, CalendarIcon, ChevronDownIcon } from "@radix-ui/react-icons";
import { format, addMonths, subMonths, startOfMonth, endOfMonth, startOfWeek, endOfWeek, addDays, isSameMonth, isSameDay, setYear } from "date-fns";
import { ptBR } from "date-fns/locale/pt-BR";
import style from './DatePicker.module.scss';

const DatePicker = () => {
    const [selectedDate, setSelectedDate] = useState<Date | null>(null);
    const [currentMonth, setCurrentMonth] = useState(new Date());
    const [showYearSelector, setShowYearSelector] = useState(false);

    const selectedYear = new Date().getFullYear();
    const currentYear = currentMonth.getFullYear();
    const years = Array.from({ length: 101 }, (_, i) => selectedYear - 100 + i).reverse();

    const handleYearChange = (year: number) => {
        setCurrentMonth(setYear(currentMonth, year));
        setShowYearSelector(false);
    };

    const renderHeader = () => (
        <div className={style.CalendarHeader}>
            <button onClick={(e) => { e.preventDefault(); setCurrentMonth(subMonths(currentMonth, 1)) }}>
                <ChevronLeftIcon />
            </button>
            <DropdownMenu open={showYearSelector} onOpenChange={setShowYearSelector}>
                <DropdownMenuTrigger className={style.YearTrigger}>
                    <span>{format(currentMonth, "MMMM yyyy", { locale: ptBR })}</span>
                    <ChevronDownIcon />
                </DropdownMenuTrigger>
                <DropdownMenuContent className={style.YearSelector}>
                    {years.map((year) => (
                        <DropdownMenuItem 
                            key={year}
                            className={`${style.YearOption} ${year === currentYear ? style.Selected : ''}`}
                            onClick={() => handleYearChange(year)}
                        >
                            {year}
                        </DropdownMenuItem>
                    ))}
                </DropdownMenuContent>
            </DropdownMenu>

            <button onClick={(e) => { e.preventDefault(); setCurrentMonth(addMonths(currentMonth, 1))}}>
                <ChevronRightIcon />
            </button>
        </div>
    );

    const renderDays = () => {
        const startDate = startOfWeek(startOfMonth(currentMonth), { locale: ptBR });
        const endDate = endOfWeek(endOfMonth(currentMonth), { locale: ptBR });

        const rows = [];
        let days = [];
        let day = startDate;
        let formattedDate = "";

        while (day <= endDate) {
            for (let i = 0; i < 7; i++) {
                formattedDate = format(day, "d");
                const cloneDay = day;
                days.push(
                    <div
                        className={`${style.Day} ${!isSameMonth(day, currentMonth) ? `${style.Disabled}` : ""} ${selectedDate && isSameDay(day, selectedDate) ? `${style.Selected}` : ""}`}
                        onClick={() => setSelectedDate(cloneDay)}
                        key={day.toString()}
                    >
                        <span>{formattedDate}</span>
                    </div>
                );
                day = addDays(day, 1);
            }
            rows.push(
                <div className={style.CalendarRow} key={day.toString()}>
                    {days}
                </div>
            );
            days = [];
        }
        return <div className={style.Body}>{rows}</div>;
    };

    return (
        <div className={style.Container}>
            <Popover>
                <PopoverTrigger className={style.Trigger}>
                    <span>{selectedDate ? format(selectedDate, "dd/MM/yyyy") : "Selecionar data"}</span>
                    <CalendarIcon className={style.Icon} />
                </PopoverTrigger>
                <PopoverContent className={style.Popover}>
                    {renderHeader()}
                    <div className={style.WeekDays}>
                        {['D', 'S', 'T', 'Q', 'Q', 'S', 'S'].map((day, i) => (
                            <div className={style.WeekDay} key={i}>{day}</div>
                        ))}
                    </div>
                    {renderDays()}
                </PopoverContent>
            </Popover>
        </div>
    );
};

export default DatePicker;