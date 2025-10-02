import { useUser } from '@contexts/UserContext';
import style from './Times.module.scss';
import { useEffect, useState } from 'react';
//@ts-expect-error
import api from '@services/api';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { format, addDays, isSameDay, startOfMonth, endOfMonth, eachDayOfInterval, isWeekend, startOfWeek, endOfWeek, isSameMonth  } from 'date-fns';
import { ptBR } from 'date-fns/locale/pt-BR';
import { ChevronLeftIcon, ChevronRightIcon, TrashIcon, CalendarIcon } from '@radix-ui/react-icons';
import { toast } from 'react-toastify';

interface WorkingHours {
    day: string;
    open?: string | null;
    close?: string | null;
    breaks?: { start: string; end: string }[];
    _id?: string;
}

const Times = () => {
    const { user } = useUser();
    const [isAllowed, setIsAllowed] = useState<boolean>(false);
    const [selectedDate, setSelectedDate] = useState<Date>(new Date());
    const [showHolidayModal, setShowHolidayModal] = useState<boolean>(false);
    const [workingHours, setWorkingHours] = useState<WorkingHours[]>([]);
    const [editingDay, setEditingDay] = useState<string | null>(null);
    const queryClient = useQueryClient();

    const daysOfWeek = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'];
    
    const reverseDayMapping: Record<string, string> = {
        'Domingo': 'domingo',
        'Segunda': 'segunda-feira',
        'Terça': 'terça-feira',
        'Quarta': 'quarta-feira',
        'Quinta': 'quinta-feira',
        'Sexta': 'sexta-feira',
        'Sábado': 'sábado'
    };

    useEffect(() => {
        const fetchData = async () => {
            if (!user) return;
            const roleTypeResult = await api.get(`/roles/${user.role}/type`);
            const roleType = roleTypeResult.data;
            setIsAllowed(roleType === 'admin' || roleType === 'barbeiro-admin');
        };
        fetchData();
    }, [user]);

    const { data: barbershopData } = useQuery({
        queryKey: ['barbershop', user?._id],
        queryFn: async () => {
            const barberShopDataResult = await api.get('/barbershops');
            return barberShopDataResult.data;
        },
        enabled: isAllowed
    });

    useEffect(() => {
        if (barbershopData?.workingHours) {
            setWorkingHours(barbershopData.workingHours);
        }
    }, [barbershopData]);

    const addHolidayMutation = useMutation({
        mutationFn: async (date: string) => {
            return api.post('/barbershops/holidays', { date });
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['barbershop'] });
            setShowHolidayModal(false);
        }
    });

    const removeHolidayMutation = useMutation({
        mutationFn: async (date: string) => {
            return api.delete(`/barbershops/holidays/${date}`);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['barbershop'] });
        }
    });

    const updateWorkingHoursMutation = useMutation({
        mutationFn: async (updatedHours: WorkingHours[]) => {
            return api.patch(`/barbershops/${barbershopData?._id}`, { workingHours: updatedHours });
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['barbershop'] });
            setEditingDay(null);
        }
    });

    const handleWorkingHoursChange = (day: string, field: 'open' | 'close', value: string) => {
        const apiDayName = reverseDayMapping[day];
        const updatedHours = workingHours.map(wh => 
            wh.day === apiDayName ? { ...wh, [field]: value } : wh
        );
        setWorkingHours(updatedHours);
    };

    const handleRemoveWorkingDay = (day: string) => {
        const apiDayName = reverseDayMapping[day];
        setWorkingHours(workingHours.filter(wh => wh.day !== apiDayName));
    };

    const handleToggleDayStatus = (day: string) => {
        if (!barbershopData?._id) {
            toast.error('Dados da barbearia não carregados.');
            return;
        }
    
        const apiDayName = reverseDayMapping[day];
        const existingDay = workingHours.find(wh => wh.day === apiDayName);
    
        let updatedHours: WorkingHours[];
    
        if (existingDay) {
            if (existingDay.open === null || existingDay.close === null) {
                updatedHours = workingHours.map(wh =>
                    wh.day === apiDayName ? { ...wh, open: '08:00', close: '18:00' } : wh
                );
            } else {
                updatedHours = workingHours.map(wh =>
                    wh.day === apiDayName ? { ...wh, open: null, close: null } : wh
                );
            }
        } else {
            const newWorkingDay: WorkingHours = {
                day: apiDayName,
                open: '08:00',
                close: '18:00',
                breaks: []
            };
            updatedHours = [...workingHours, newWorkingDay];
        }
    
        setWorkingHours(updatedHours);
    
        updateWorkingHoursMutation.mutate(updatedHours, {
            onSuccess: () => {
                toast.success('Alteração de status salva!');
            },
            onError: (err: any) => {
                console.error('Erro ao salvar workingHours', err);
                toast.error('Não foi possível salvar. Tente novamente.');
            }
        });
    };
    

    const handleSaveWorkingHours = () => {
        updateWorkingHoursMutation.mutate(workingHours);
    };

    const handleAddHoliday = () => {
        const dateString = format(selectedDate, 'yyyy-MM-dd');
        addHolidayMutation.mutate(dateString);
    };

    const handleRemoveHoliday = (date: string) => {
        removeHolidayMutation.mutate(date);
    };

    const isHoliday = (date: Date) => {
        const dateString = format(date, 'yyyy-MM-dd');
        return barbershopData?.holidays?.includes(dateString) || false;
    };

    const getCalendarDays = () => {
        const start = startOfMonth(selectedDate);
        const end = endOfMonth(selectedDate);
        
        const calendarStart = startOfWeek(start, { weekStartsOn: 0 });
        
        const calendarEnd = endOfWeek(end, { weekStartsOn: 0 });
        
        return eachDayOfInterval({ start: calendarStart, end: calendarEnd });
    };

    const getWorkingDay = (day: string) => {
        const apiDayName = reverseDayMapping[day];
        return workingHours.find(wh => wh.day === apiDayName);
    };

    const isDayClosed = (day: string) => {
        const workingDay = getWorkingDay(day);
        return workingDay && (workingDay.open === null || workingDay.close === null);
    };

    if (!isAllowed) {
        return (
            <div className={style.Container}>
                <div className={style.AccessDenied}>
                    <h2>Acesso Negado</h2>
                    <p>Você não tem permissão para acessar esta página.</p>
                </div>
            </div>
        );
    }

    return (
        <div className={style.Container}>
            <div className={style.PageContent}>
                <div className={style.Header}>
                    <h1 className={style.Title}>Horários de Funcionamento</h1>
                </div>

                <div className={style.Content}>
                <div className={style.Section}>
                    <div className={style.WorkingHours}>
                        {daysOfWeek.map(day => {
                            const workingDay = getWorkingDay(day);
                            const isEditing = editingDay === day;
                            const isClosed = isDayClosed(day);
                            const hasWorkingDay = !!workingDay;

                            return (
                                <div key={day} className={`${style.WorkingDay} ${isClosed ? style.ClosedDay : ''}`}>
                                    <div className={style.DayHeader}>
                                        <span className={style.DayName}>{day}</span>
                                        <div className={style.DayActions}>
                                        <button
                                            onClick={() => handleToggleDayStatus(day)}
                                            className={`${style.ToggleButton} ${
                                                !hasWorkingDay
                                                    ? style.AddButton
                                                    : isClosed
                                                        ? style.OpenButton
                                                        : style.CloseButton
                                            }`}
                                            disabled={updateWorkingHoursMutation.isLoading}
                                        >
                                            {!hasWorkingDay ? 'Adicionar' : isClosed ? 'Abrir' : 'Fechar'}
                                        </button>

                                            {hasWorkingDay && (
                                                <>
                                                    <button 
                                                        onClick={() => setEditingDay(isEditing ? null : day)}
                                                        className={style.EditButton}
                                                        disabled={isClosed}
                                                    >
                                                        {isEditing ? 'Salvar' : 'Editar'}
                                                    </button>
                                                </>
                                            )}
                                        </div>
                                    </div>

                                    {workingDay && (
                                        <div className={style.TimeInputs}>
                                            {isClosed ? (
                                                <div className={style.ClosedStatus}>
                                                    <span>Fechado</span>
                                                </div>
                                            ) : (
                                                <>
                                                    <div className={style.TimeInput}>
                                                        <label>Abertura:</label>
                                                        <input
                                                            type="time"
                                                            value={workingDay.open || ''}
                                                            onChange={(e) => handleWorkingHoursChange(day, 'open', e.target.value)}
                                                            disabled={!isEditing}
                                                        />
                                                    </div>
                                                    <div className={style.TimeInput}>
                                                        <label>Fechamento:</label>
                                                        <input
                                                            type="time"
                                                            value={workingDay.close || ''}
                                                            onChange={(e) => handleWorkingHoursChange(day, 'close', e.target.value)}
                                                            disabled={!isEditing}
                                                        />
                                                    </div>
                                                </>
                                            )}
                                        </div>
                                    )}

                                    {isEditing && !isClosed && (
                                        <button 
                                            onClick={handleSaveWorkingHours}
                                            className={style.SaveButton}
                                            disabled={updateWorkingHoursMutation.isPending}
                                        >
                                            {updateWorkingHoursMutation.isPending ? 'Salvando...' : 'Salvar Alterações'}
                                        </button>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>

                <div className={style.Section}>
                    <div className={style.SectionHeader}>
                        <h2>Feriados e Dias de Fechamento</h2>
                        <button 
                            onClick={() => setShowHolidayModal(true)}
                            className={style.AddHolidayButton}
                        >
                            <CalendarIcon /> Adicionar Feriado
                        </button>
                    </div>

                    <div className={style.CalendarContainer}>
                        <div className={style.CalendarHeader}>
                            <button 
                                onClick={() => setSelectedDate(addDays(selectedDate, -30))}
                                className={style.CalendarNavButton}
                            >
                                <ChevronLeftIcon />
                            </button>
                            <h3>{format(selectedDate, 'MMMM yyyy', { locale: ptBR })}</h3>
                            <button 
                                onClick={() => setSelectedDate(addDays(selectedDate, 30))}
                                className={style.CalendarNavButton}
                            >
                                <ChevronRightIcon />
                            </button>
                        </div>

                        <div className={style.Calendar}>
                            <div className={style.WeekDays}>
                                {['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'].map(day => (
                                    <div key={day} className={style.WeekDay}>{day}</div>
                                ))}
                            </div>
                            <div className={style.CalendarDays}>
                            {getCalendarDays().map(date => {
                                const isHolidayDate = isHoliday(date);
                                const isToday = isSameDay(date, new Date());
                                const isSelected = isSameDay(date, selectedDate);
                                const isCurrentMonth = isSameMonth(date, selectedDate);
                                
                                const dayName = format(date, 'EEEE', { locale: ptBR });
                                const dayNameCapitalized = dayName.charAt(0).toUpperCase() + dayName.slice(1);
                                const isClosedDay = isDayClosed(dayNameCapitalized);

                                return (
                                    <div 
                                        key={date.toString()}
                                        className={`${style.CalendarDay} ${
                                            isHolidayDate ? style.Holiday : ''
                                        } ${
                                            isToday ? style.Today : ''
                                        } ${isSelected ? style.Selected : ''} ${
                                            isClosedDay ? style.Closed : ''
                                        } ${
                                            !isCurrentMonth ? style.OtherMonth : ''
                                        }`}
                                        onClick={() => setSelectedDate(date)}
                                    >
                                        <span className={style.DayNumber}>
                                            {format(date, 'd')}
                                        </span>
                                        {isHolidayDate && (
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleRemoveHoliday(format(date, 'yyyy-MM-dd'));
                                                }}
                                                className={style.RemoveHolidayButton}
                                            >
                                                <TrashIcon />
                                            </button>
                                        )}
                                        {isClosedDay && !isHolidayDate && (
                                            <span className={style.ClosedLabel}>Fechado</span>
                                        )}
                                    </div>
                                );
                            })}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {showHolidayModal && (
                <div className={style.ModalOverlay}>
                    <div className={style.Modal}>
                        <h3>Adicionar Feriado</h3>
                        <p>Data selecionada: {format(selectedDate, 'dd/MM/yyyy')}</p>
                        <div className={style.ModalActions}>
                            <button 
                                onClick={() => setShowHolidayModal(false)}
                                className={style.CancelButton}
                            >
                                Cancelar
                            </button>
                            <button 
                                onClick={handleAddHoliday}
                                className={style.ConfirmButton}
                                disabled={addHolidayMutation.isPending}
                            >
                                {addHolidayMutation.isPending ? 'Adicionando...' : 'Adicionar Feriado'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
            </div>
        </div>
    );
};

export default Times;