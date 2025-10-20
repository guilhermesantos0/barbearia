import { useUser } from '@contexts/UserContext';
import style from './Times.module.scss';
import { useEffect, useState } from 'react';
//@ts-expect-error
import api from '@services/api';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { format, addDays, isSameDay, startOfMonth, endOfMonth, eachDayOfInterval, startOfWeek, endOfWeek, isSameMonth } from 'date-fns';
import { ptBR } from 'date-fns/locale/pt-BR';
import { ChevronLeftIcon, ChevronRightIcon, TrashIcon, CalendarIcon, ClockIcon } from '@radix-ui/react-icons';
import { toast } from 'react-toastify';
import { CheckIcon } from '@radix-ui/react-icons';
import * as Checkbox from '@radix-ui/react-checkbox';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import TimePicker from '@components/TimePicker';

const Times = () => {
    const { user } = useUser();
    const [isAllowed, setIsAllowed] = useState<boolean>(false);
    const [selectedDate, setSelectedDate] = useState<Date>(new Date());
    const [showHolidayModal, setShowHolidayModal] = useState<boolean>(false);
    const [openTime, setOpenTime] = useState<string>('09:00');
    const [closeTime, setCloseTime] = useState<string>('18:00');
    const [openDays, setOpenDays] = useState<string[]>([]);
    const [hasChanges, setHasChanges] = useState<boolean>(false);
    const queryClient = useQueryClient();

    const daysOfWeek = [
        { label: 'Domingo', value: 'sunday', short: 'Dom', icon: '☀️' },
        { label: 'Segunda-feira', value: 'monday', short: 'Seg', icon: '💼' },
        { label: 'Terça-feira', value: 'tuesday', short: 'Ter', icon: '💼' },
        { label: 'Quarta-feira', value: 'wednesday', short: 'Qua', icon: '💼' },
        { label: 'Quinta-feira', value: 'thursday', short: 'Qui', icon: '💼' },
        { label: 'Sexta-feira', value: 'friday', short: 'Sex', icon: '💼' },
        { label: 'Sábado', value: 'saturday', short: 'Sáb', icon: '🎉' }
    ];

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
        if (barbershopData) {
            setOpenTime(barbershopData.openTime || '09:00');
            setCloseTime(barbershopData.closeTime || '18:00');
            setOpenDays(barbershopData.openDays || []);
            setHasChanges(false);
        }
    }, [barbershopData]);

    const addHolidayMutation = useMutation({
        mutationFn: async (date: string) => {
            return api.post('/barbershops/holidays', { date });
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['barbershop'] });
            setShowHolidayModal(false);
            toast.success('Feriado adicionado com sucesso!');
        },
        onError: () => {
            toast.error('Erro ao adicionar feriado.');
        }
    });

    const removeHolidayMutation = useMutation({
        mutationFn: async (date: string) => {
            return api.delete(`/barbershops/holidays/${date}`);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['barbershop'] });
            toast.success('Feriado removido com sucesso!');
        },
        onError: () => {
            toast.error('Erro ao remover feriado.');
        }
    });

    const updateScheduleMutation = useMutation({
        mutationFn: async (data: { openTime: string; closeTime: string; openDays: string[] }) => {
            return api.patch(`/barbershops/${barbershopData?._id}`, data);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['barbershop'] });
            toast.success('Horários atualizados com sucesso!');
            setHasChanges(false);
        },
        onError: () => {
            toast.error('Erro ao atualizar horários.');
        }
    });

    const handleDayToggle = (day: string) => {
        if (openDays.includes(day)) {
            setOpenDays(openDays.filter(d => d !== day));
        } else {
            setOpenDays([...openDays, day]);
        }
        setHasChanges(true);
    };

    const handleTimeChange = (field: 'open' | 'close', value: string) => {
        if (field === 'open') {
            setOpenTime(value);
        } else {
            setCloseTime(value);
        }
        setHasChanges(true);
    };

    const handleSaveSchedule = () => {
        if (!barbershopData?._id) {
            toast.error('Dados da barbearia não carregados.');
            return;
        }
        updateScheduleMutation.mutate({ openTime, closeTime, openDays });
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

    const isDayClosed = (date: Date) => {
        const dayNamePt = format(date, 'EEEE', { locale: ptBR }).toLowerCase();
        const dayMap: Record<string, string> = {
            'domingo': 'sunday',
            'segunda-feira': 'monday',
            'terça-feira': 'tuesday',
            'quarta-feira': 'wednesday',
            'quinta-feira': 'thursday',
            'sexta-feira': 'friday',
            'sábado': 'saturday'
        };
        const dayValue = dayMap[dayNamePt];
        return !openDays.includes(dayValue);
    };

    const getOperatingHours = () => {
        if (!openTime || !closeTime) return 'Não definido';
        return `${openTime} às ${closeTime}`;
    };

    const getOpenDaysCount = () => {
        return openDays.length;
    };

    const getHolidaysCount = () => {
        return barbershopData?.holidays?.length || 0;
    };

    if (!isAllowed) {
        return (
            <div className={style.Container}>
                <div className={style.AccessDenied}>
                    <FontAwesomeIcon icon="lock" className={style.LockIcon} />
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
                    <div className={style.TitleSection}>
                        <div>
                            <h1 className={style.Title}>Horários de Funcionamento</h1>
                            <p className={style.Subtitle}>Gerencie os horários e dias de atendimento da barbearia</p>
                        </div>
                    </div>

                    <div className={style.StatsCards}>
                        <div className={style.StatCard}>
                            <FontAwesomeIcon icon="clock" className={style.StatIcon} />
                            <div className={style.StatInfo}>
                                <span className={style.StatLabel}>Horário</span>
                                <span className={style.StatValue}>{getOperatingHours()}</span>
                            </div>
                        </div>
                        <div className={style.StatCard}>
                            <FontAwesomeIcon icon="calendar-check" className={style.StatIcon} />
                            <div className={style.StatInfo}>
                                <span className={style.StatLabel}>Dias Abertos</span>
                                <span className={style.StatValue}>{getOpenDaysCount()} dias</span>
                            </div>
                        </div>
                        <div className={style.StatCard}>
                            <FontAwesomeIcon icon="calendar-xmark" className={style.StatIcon} />
                            <div className={style.StatInfo}>
                                <span className={style.StatLabel}>Feriados</span>
                                <span className={style.StatValue}>{getHolidaysCount()}</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className={style.ContentGrid}>
                    <div className={style.LeftColumn}>
                        <div className={style.Card}>
                            <div className={style.CardHeader}>
                                <div className={style.CardTitle}>
                                    <h2>Horário de Atendimento</h2>
                                </div>
                            </div>
                            
                            <div className={style.CardContent}>
                                <div className={style.TimeSettingsGrid}>
                                    <div className={style.TimeInputGroup}>
                                        <label htmlFor="openTime">
                                            <FontAwesomeIcon icon="door-open" className={style.InputIcon} />
                                            Abertura
                                        </label>
                                        <TimePicker
                                            value={openTime}
                                            onChange={(val) => handleTimeChange('open', val)}
                                            maxH={Number(closeTime.split(':')[0])}
                                            inModal={true}
                                        />
                                    </div>
                                    <div className={style.TimeInputGroup}>
                                        <label htmlFor="closeTime">
                                            <FontAwesomeIcon icon="door-closed" className={style.InputIcon} />
                                            Fechamento
                                        </label>
                                        <TimePicker
                                            value={closeTime}
                                            onChange={(val) => handleTimeChange('close', val)}
                                            minH={Number(openTime.split(':')[0])}
                                            inModal={true}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className={style.Card}>
                            <div className={style.CardHeader}>
                                <div className={style.CardTitle}>
                                    <FontAwesomeIcon icon="calendar-days" className={style.CardIcon} />
                                    <h2>Dias de Funcionamento</h2>
                                </div>
                                <div className={style.CardBadge}>{getOpenDaysCount()} selecionados</div>
                            </div>
                            
                            <div className={style.CardContent}>
                                <div className={style.DaysGrid}>
                                    {daysOfWeek.map((day) => {
                                        const isSelected = openDays.includes(day.value);
                                        return (
                                            <div 
                                                key={day.value} 
                                                className={`${style.DayCard} ${isSelected ? style.DayCardSelected : ''}`}
                                                onClick={() => handleDayToggle(day.value)}
                                            >
                                                <div className={style.DayCardContent}>
                                                    <span className={style.DayEmoji}>{day.icon}</span>
                                                    <div className={style.DayInfo}>
                                                        <span className={style.DayShort}>{day.short}</span>
                                                        <span className={style.DayFull}>{day.label}</span>
                                                    </div>
                                                </div>
                                                <div className={style.DayCheckbox}>
                                                    <Checkbox.Root
                                                        className={style.CheckboxRoot}
                                                        checked={isSelected}
                                                        onCheckedChange={() => handleDayToggle(day.value)}
                                                    >
                                                        <Checkbox.Indicator className={style.CheckboxIndicator}>
                                                            <CheckIcon width={16} height={16} />
                                                        </Checkbox.Indicator>
                                                    </Checkbox.Root>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>

                        {hasChanges && (
                            <div className={style.SaveSection}>
                                <button 
                                    onClick={handleSaveSchedule}
                                    className={style.SaveButton}
                                    disabled={updateScheduleMutation.isPending}
                                >
                                    <FontAwesomeIcon icon="save" />
                                    {updateScheduleMutation.isPending ? 'Salvando...' : 'Salvar Alterações'}
                                </button>
                            </div>
                        )}
                    </div>

                    <div className={style.RightColumn}>
                        <div className={style.Card}>
                            <div className={style.CardHeader}>
                                <div className={style.CardTitle}>
                                    <CalendarIcon className={style.CardIcon} />
                                    <h2>Feriados e Fechamentos</h2>
                                </div>
                                <button 
                                    onClick={() => setShowHolidayModal(true)}
                                    className={style.AddHolidayButton}
                                >
                                    <FontAwesomeIcon icon="plus" />
                                    Adicionar Feriado
                                </button>
                            </div>

                            <div className={style.CardContent}>
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
                                            const isClosedDay = isDayClosed(date);

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
                                                            title="Remover feriado"
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

                                <div className={style.CalendarLegend}>
                                    <div className={style.LegendItem}>
                                        <div className={`${style.LegendDot} ${style.LegendToday}`}></div>
                                        <span>Hoje</span>
                                    </div>
                                    <div className={style.LegendItem}>
                                        <div className={`${style.LegendDot} ${style.LegendHoliday}`}></div>
                                        <span>Feriado</span>
                                    </div>
                                    <div className={style.LegendItem}>
                                        <div className={`${style.LegendDot} ${style.LegendClosed}`}></div>
                                        <span>Fechado</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className={style.Card}>
                            <button><FontAwesomeIcon icon="times" /> Descartar Alterações</button>
                            <button><FontAwesomeIcon icon="save" /> Salvar Alterações</button>
                        </div>
                    </div>
                </div>

                {showHolidayModal && (
                    <div className={style.ModalOverlay} onClick={() => setShowHolidayModal(false)}>
                        <div className={style.Modal} onClick={(e) => e.stopPropagation()}>
                            <div className={style.ModalHeader}>
                                <CalendarIcon className={style.ModalIcon} />
                                <h3>Adicionar Feriado</h3>
                            </div>
                            <div className={style.ModalContent}>
                                <div className={style.DateDisplay}>
                                    <FontAwesomeIcon icon="calendar" />
                                    <span>{format(selectedDate, "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}</span>
                                </div>
                                <p className={style.ModalDescription}>
                                    A barbearia estará fechada neste dia e não serão aceitos agendamentos.
                                </p>
                            </div>
                            <div className={style.ModalActions}>
                                <button 
                                    onClick={() => setShowHolidayModal(false)}
                                    className={style.CancelButton}
                                >
                                    <FontAwesomeIcon icon="times" />
                                    Cancelar
                                </button>
                                <button 
                                    onClick={handleAddHoliday}
                                    className={style.ConfirmButton}
                                    disabled={addHolidayMutation.isPending}
                                >
                                    <FontAwesomeIcon icon="check" />
                                    {addHolidayMutation.isPending ? 'Adicionando...' : 'Confirmar Feriado'}
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
