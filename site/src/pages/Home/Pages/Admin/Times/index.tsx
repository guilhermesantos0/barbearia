import { useUser } from '@contexts/UserContext';
import style from './Times.module.scss';
import { useEffect, useState } from 'react';
//@ts-expect-error - API service import path resolution
import api from '@services/api';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { format, addDays, isSameDay, startOfMonth, endOfMonth, eachDayOfInterval, isWeekend } from 'date-fns';
import { ptBR } from 'date-fns/locale/pt-BR';
import { ChevronLeftIcon, ChevronRightIcon, PlusIcon, TrashIcon, CalendarIcon } from '@radix-ui/react-icons';

interface WorkingHours {
    day: string;
    open?: string;
    close?: string;
    breaks?: { start: string; end: string }[];
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
        const updatedHours = workingHours.map(wh => 
            wh.day === day ? { ...wh, [field]: value } : wh
        );
        setWorkingHours(updatedHours);
    };

    const handleAddWorkingDay = (day: string) => {
        const newWorkingDay: WorkingHours = {
            day,
            open: '08:00',
            close: '18:00',
            breaks: []
        };
        setWorkingHours([...workingHours, newWorkingDay]);
    };

    const handleRemoveWorkingDay = (day: string) => {
        setWorkingHours(workingHours.filter(wh => wh.day !== day));
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
        return eachDayOfInterval({ start, end });
    };

    const getWorkingDay = (day: string) => {
        return workingHours.find(wh => wh.day === day);
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
                    <h1>Gerenciar Horários de Funcionamento</h1>
                    <p>Configure os horários de funcionamento e feriados da barbearia</p>
                </div>

                <div className={style.Content}>
                {/* Working Hours Section */}
                <div className={style.Section}>
                    <h2>Horários de Funcionamento</h2>
                    <div className={style.WorkingHours}>
                        {daysOfWeek.map(day => {
                            const workingDay = getWorkingDay(day);
                            const isEditing = editingDay === day;

                            return (
                                <div key={day} className={style.WorkingDay}>
                                    <div className={style.DayHeader}>
                                        <span className={style.DayName}>{day}</span>
                                        {workingDay ? (
                                            <div className={style.DayActions}>
                                                <button 
                                                    onClick={() => setEditingDay(isEditing ? null : day)}
                                                    className={style.EditButton}
                                                >
                                                    {isEditing ? 'Salvar' : 'Editar'}
                                                </button>
                                                <button 
                                                    onClick={() => handleRemoveWorkingDay(day)}
                                                    className={style.RemoveButton}
                                                >
                                                    <TrashIcon />
                                                </button>
                                            </div>
                                        ) : (
                                            <button 
                                                onClick={() => handleAddWorkingDay(day)}
                                                className={style.AddButton}
                                            >
                                                <PlusIcon /> Adicionar
                                            </button>
                                        )}
                                    </div>

                                    {workingDay && (
                                        <div className={style.TimeInputs}>
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
                                        </div>
                                    )}

                                    {isEditing && (
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

                {/* Holidays Section */}
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
                                    const isWeekendDay = isWeekend(date);
                                    const isToday = isSameDay(date, new Date());
                                    const isSelected = isSameDay(date, selectedDate);

                                    return (
                                        <div 
                                            key={date.toString()}
                                            className={`${style.CalendarDay} ${
                                                isHolidayDate ? style.Holiday : ''
                                            } ${isWeekendDay ? style.Weekend : ''} ${
                                                isToday ? style.Today : ''
                                            } ${isSelected ? style.Selected : ''}`}
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
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Holiday Modal */}
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