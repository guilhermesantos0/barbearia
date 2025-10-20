// @ts-ignore
import { IScheduledService } from '@types/ScheduledService';
import style from './AdminScheduledService.module.scss';
import { ReactNode, useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import BarberIcon from '@assets/icons/barber.svg?react';
// @ts-ignore
import { formatDate } from '@utils/formatDate';
// @ts-ignore
import { fomratTimeDuration } from '@utils/formatTimeDuration';
// @ts-ignore
import { formatPrice } from '@utils/formatPrice';
import { IconProp } from '@fortawesome/fontawesome-svg-core';
import Modal from '@components/Modal';
import DetailsSection from '@components/DetailsSection';
// @ts-ignore
import { formatDayNumbers } from '@utils/formatDayNumbers';
import DatePicker from '@components/DatePicker';
import TimePicker from '@components/TimePicker';
import { SelectMenu } from '@components/SelectMenu';
import { format } from 'date-fns';
// @ts-ignore
import api from '@services/api';
import { toast } from 'react-toastify';
import { useQueryClient } from '@tanstack/react-query';

interface AdminScheduledServiceProps {
    appointment: IScheduledService
}

interface ServiceInfosProps {
    icon: ReactNode,
    label: string,
    value: string
}

const AdminScheduledService: React.FC<AdminScheduledServiceProps> = ({ appointment }) => {
    
    const [isViewModalOpen, setIsViewModalOpen] = useState<boolean>(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false);

    const [serviceStatusStyle, setServiceStatusStyle] = useState<string>();
    
    // Edit modal state
    const [editingData, setEditingData] = useState<{
        date: Date;
        barberId: string;
        status: 'Pendente' | 'Confirmado' | 'Cancelado' | 'Atrasado' | 'Em andamento' | 'Finalizado';
        discountApplied: number;
    }>(() => {
        const appointmentDate = new Date(appointment.date);
        
        return {
            date: appointmentDate,
            barberId: appointment.barber._id,
            status: appointment.status,
            discountApplied: appointment.discountApplied
        };
    });

    const [availableTimes, setAvailableTimes] = useState<string[]>([]);
    const [barbers, setBarbers] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    
    const queryClient = useQueryClient();

    const ServiceInfos:React.FC<ServiceInfosProps> = ({ icon, label, value }) => {
        return (
            <div className={style.ServiceInfo}>
                <div className={style.ServiceInfoLabelSection}>
                    {icon}
                    <h4 className={style.ServiceInfoLabel}>{label}</h4>
                </div>
                <h3 className={style.ServiceInfoValue}>{value}</h3>
            </div>
        )
    }

    useEffect(() => {
        
        const statusMap: Record<string, string> = {
            'Pendente': style.Pending,
            'Confirmado': style.Confirmed,
            'Cancelado': style.Canceld,
            'Atrasado': style.Delayed,
            'Em andamento': style.Running,
            'Finalizado': style.Complete
        };
        
        setServiceStatusStyle(statusMap[appointment.status] || style.Pending);
    }, [appointment]);

    useEffect(() => {
        if (isEditModalOpen) {
            loadBarbers();
            loadAvailableTimes();
        }
    }, [isEditModalOpen, editingData.barberId]);

    useEffect(() => {
        if (isEditModalOpen && editingData.barberId) {
            loadAvailableTimes();
        }
    }, [editingData.date]);

    useEffect(() => {
        if (isEditModalOpen) {
            const appointmentDate = new Date(appointment.date);
            setEditingData(prev => {
                if (prev.date.getTime() !== appointmentDate.getTime()) {
                    return {
                        date: appointmentDate,
                        barberId: appointment.barber._id,
                        status: appointment.status,
                        discountApplied: appointment.discountApplied
                    };
                }
                return prev;
            });
        }
    }, [isEditModalOpen]);

    const loadBarbers = async () => {
        try {
            const barbersResult = await api.get('/users/barbers');
            setBarbers(barbersResult.data);
        } catch (error) {
            console.error('Error loading barbers:', error);
            toast.error('Erro ao carregar barbeiros');
        }
    };

    const loadAvailableTimes = async () => {
        try {
            const onlyServiceDate = format(editingData.date, 'yyyy-MM-dd');
            const barberTimesResult = await api.get(`/users/barbers/${editingData.barberId}/available-slots?date=${onlyServiceDate}&serviceDuration=${appointment.service.duration}`);
            
            const currentTime = format(editingData.date, 'HH:mm');
            const createAvailableTimes = [...barberTimesResult.data, currentTime]
                .map(t => {
                    const [h, m] = t.split(":").map(Number);
                    return { original: t, minutes: h * 60 + m };
                })
                .sort((a, b) => a.minutes - b.minutes)
                .map(t => t.original);
            
            setAvailableTimes(createAvailableTimes);
        } catch (error) {
            console.error('Error loading available times:', error);
            toast.error('Erro ao carregar horários disponíveis');
        }
    };

    const handleDateChange = async (newDate: Date) => {
        setEditingData(prev => {
            return { ...prev, date: newDate };
        });
    };

    const handleBarberChange = async (barberId: string | undefined) => {
        if (barberId) {
            setEditingData(prev => ({ ...prev, barberId }));
        }
    };

    const handleStatusChange = (status: string | undefined) => {
        if (status && ['Pendente', 'Confirmado', 'Cancelado', 'Atrasado', 'Em andamento', 'Finalizado'].includes(status)) {
            setEditingData(prev => ({ ...prev, status: status as 'Pendente' | 'Confirmado' | 'Cancelado' | 'Atrasado' | 'Em andamento' | 'Finalizado' }));
        }
    };

    const handleDiscountChange = (discountApplied: number) => {
        setEditingData(prev => ({ ...prev, discountApplied }));
    };

    const handleSaveChanges = async () => {
        setIsLoading(true);
        try {
            const [hours, minutes] = format(editingData.date, 'HH:mm').split(':');
            const newDateTime = new Date(editingData.date);
            newDateTime.setHours(parseInt(hours), parseInt(minutes), 0, 0);

            const updateData = {
                date: newDateTime.toISOString(),
                barber: editingData.barberId,
                status: editingData.status,
                discountApplied: editingData.discountApplied
            };

            const response = await api.put(`/scheduledservices/${appointment._id}`, updateData);
            
            if (response.status === 200) {
                toast.success('Serviço atualizado com sucesso!');
                setIsEditModalOpen(false);
                // @ts-ignore
                queryClient.invalidateQueries(['adminScheduledServices']);
                // @ts-ignore
                queryClient.invalidateQueries(['nextServices']);
            } else {
                toast.error('Erro ao atualizar serviço');
            }
        } catch (error) {
            console.error('Error updating service:', error);
            toast.error('Erro ao atualizar serviço');
        } finally {
            setIsLoading(false);
        }
    };

    const barberOptions = barbers.map(barber => ({
        value: barber._id,
        label: barber.name
    }));

    const statusOptions = [
        { value: 'Pendente', label: 'Pendente' },
        { value: 'Confirmado', label: 'Confirmado' },
        { value: 'Cancelado', label: 'Cancelado' },
        { value: 'Atrasado', label: 'Atrasado' },
        { value: 'Em andamento', label: 'Em andamento' },
        { value: 'Finalizado', label: 'Finalizado' }
    ];

    const serviceInfosArray = [
        {
            icon: <FontAwesomeIcon className={style.Icon} icon='user' />,
            label: 'Cliente',
            value: appointment.costumer.name
        },
        {
            icon: <BarberIcon className={style.Icon} />,
            label: 'Barbeiro',
            value: appointment.barber.name
        },
        {
            icon: <FontAwesomeIcon className={style.Icon} icon='scissors' />,
            label: 'Serviço',
            value: appointment.service.name
        },
        {
            icon: <FontAwesomeIcon className={style.Icon} icon={['far', 'calendar']} />,
            label: 'Data',
            value: formatDate(appointment.date)
        },
        {
            icon: <FontAwesomeIcon className={style.Icon} icon={['far', 'clock']} />,
            label: 'Duração',
            value: fomratTimeDuration(appointment.service.duration)
        },
        {
            icon: <FontAwesomeIcon className={style.Icon} icon='dollar' />,
            label: 'Preço',
            value: formatPrice(appointment.service.price * ( (100 - appointment.discountApplied) / 100 ))
        }
    ]

    const topDetailsData = [
        {
            label: 'Cliente',
            value: appointment.costumer.name,
            icon: 'user'
        },
        {
            label: 'Barbeiro',
            value: appointment.barber.name,
            icon: <BarberIcon />
        },
        {
            label: 'Serviço',
            value: appointment.service.name,
            icon: 'scissors'
        }
    ]

    const bottonLeftDetailsData = [
        {
            label: 'Data',
            value: formatDayNumbers(appointment.date),
            icon: 'calendar'
        },
        {
            label: 'Preço',
            value: formatPrice(appointment.service.price),
            icon: 'dollar'
        }
    ]

    const bottomRightDetailsData = [
        {
            label: 'Duração',
            value: fomratTimeDuration(appointment.service.duration),
            icon: 'clock'
        },
        
        {
            label: 'Desconto',
            value: `${appointment.discountApplied}%`,
            icon: 'tag'
        }
    ]

    const rateDetailsData = [
        {
            label: 'Avaliação',
            value: appointment.rated ? 
                <div className={style.Stars}>
                    {[1, 2, 3, 4, 5].map(star => (
                        <FontAwesomeIcon
                            icon={star <= appointment.rate.stars ? 'star' : ['far', 'star']}
                            className={style.Star}
                            key={star}
                        />
                    ))}
                </div>
                : 'Não avaliado',
            icon: 'star'
        },
        {
            label: 'Avaliado em',
            value: appointment.rated ? formatDate(appointment.rate.ratedAt) : 'Não avaliado',
            icon: 'calendar-check'
        }
    ]

    return (
        <>
            <div className={style.Container}>
                <div className={style.MainInfos}>
                    <div className={style.Left}>
                        <h2>{appointment.service.name}</h2>
                        <div className={`${style.Status} ${serviceStatusStyle}`}>
                            <FontAwesomeIcon 
                                                                    
                                icon={{
                                    'Pendente': 'clock' as IconProp,
                                    'Confirmado': 'check' as IconProp,
                                    'Cancelado': 'times' as IconProp,
                                    'Atrasado': 'running' as IconProp,
                                    'Em andamento': 'spinner' as IconProp,
                                    'Finalizado': 'calendar-check' as IconProp
                                }[appointment.status] || 'question'} 

                                spin={appointment.status === 'Em andamento'}
                            /> {appointment.status}
                        </div>
                    </div>
                    <div className={style.Actions}>
                        <button className={style.ActionButton}><FontAwesomeIcon className={style.Icon} icon={['far', 'eye']} onClick={() => setIsViewModalOpen(true)} /></button>
                        <button className={style.ActionButton} onClick={() => setIsEditModalOpen(true)}><FontAwesomeIcon className={style.Icon} icon='pencil' /></button>
                        {
                            appointment.status === 'Cancelado' ? (
                                <button className={`${style.ActionButton} ${style.Red}`}><FontAwesomeIcon className={style.Icon} icon='trash' /></button>
                            ) : (
                                <button className={`${style.ActionButton} ${style.Red}`}><FontAwesomeIcon className={style.Icon} icon='xmark' /></button>
                            )
                        }
                    </div>
                </div>
                <div className={style.ServiceInfos}>
                    {
                        serviceInfosArray.map((serviceInfo, idx) => (
                            <ServiceInfos key={idx} icon={serviceInfo.icon} label={serviceInfo.label} value={serviceInfo.value} /> 
                        ))
                    }
                </div>
            </div>

            <Modal open={isViewModalOpen} onOpenChange={setIsViewModalOpen} trigger={<></>} close>
                <div className={style.Title}>
                    <h3>Detalhes do Serviço</h3>
                    <span className={`${style.StatusInfo} ${serviceStatusStyle}`}>
                        <FontAwesomeIcon 
                                                                        
                            icon={{
                                'Pendente': 'clock' as IconProp,
                                'Confirmado': 'check' as IconProp,
                                'Cancelado': 'times' as IconProp,
                                'Atrasado': 'running' as IconProp,
                                'Em andamento': 'spinner' as IconProp,
                                'Finalizado': 'calendar-check' as IconProp
                            }[appointment.status] || 'question'} 

                            spin={appointment.status === 'Em andamento'}
                        /> {appointment.status}
                    </span>
                </div>
                <div className={style.InfosContainer}>
                    <DetailsSection details={topDetailsData} />
                </div>
                <div className={style.InfosContainer}>
                    <div className={style.MiddleContainer}>
                        <div className={style.LeftContainer}>
                            <DetailsSection className={style.Details} details={bottonLeftDetailsData} />
                        </div>
                        <div className={style.RightContainer}>
                            <DetailsSection className={style.Details} details={bottomRightDetailsData} />
                        </div>
                    </div>
                    <div className={style.SeparatorLine}></div>
                    <div className={style.FinalValueContainer}>
                        <h4>Valor Final</h4>
                        <p>{formatPrice(appointment.service.price * ( (100 - appointment.discountApplied) / 100 ))}</p>
                    </div>
                </div>
                
                {
                    appointment.status === 'Finalizado' && appointment.rated && (
                        <div className={style.InfosContainer}>
                            <DetailsSection details={rateDetailsData} />
                            <div className={style.Comment}>
                                {appointment.rate.comment}
                            </div>
                        </div>
                    )
                }
            </Modal>

            <Modal open={isEditModalOpen} onOpenChange={setIsEditModalOpen} trigger={<></>} close overflowYShow>
                <h2>Editar Serviço</h2>
                
                <div className={style.EditForm}>
                    <div className={style.FormRow}>
                        <div className={style.FormField}>
                            <label className={style.FormLabel}>Data e Horário</label>
                            <DatePicker 
                                defaultValue={editingData.date} 
                                onChange={handleDateChange} 
                            />
                        </div>
                        
                        <div className={style.FormField}>
                            <TimePicker 
                                label="" 
                                defaultOptions={availableTimes} 
                                value={format(editingData.date, 'HH:mm')} 
                                onChange={(time) => {
                                    if (time) {
                                        const [hours, minutes] = time.split(':');
                                        const newDate = new Date(editingData.date);
                                        newDate.setHours(parseInt(hours), parseInt(minutes), 0, 0);
                                        setEditingData(prev => ({ ...prev, date: newDate }));
                                    }
                                }} 
                                inModal
                            />
                        </div>
                    </div>

                    <div className={style.FormRow}>
                        <div className={style.FormField}>
                            <label className={style.FormLabel}>Barbeiro</label>
                            <SelectMenu
                                options={barberOptions}
                                value={editingData.barberId}
                                onChange={handleBarberChange}
                                placeholder="Selecione um barbeiro"
                            />
                        </div>
                        
                        <div className={style.FormField}>
                            <label className={style.FormLabel}>Status</label>
                            <SelectMenu
                                options={statusOptions}
                                value={editingData.status}
                                onChange={handleStatusChange}
                                placeholder="Selecione o status"
                            />
                        </div>
                    </div>

                    <div className={style.FormRow}>
                        <div className={style.FormField}>
                            <label className={style.FormLabel}>Desconto (%)</label>
                            <input
                                type="number"
                                min="0"
                                max="100"
                                value={editingData.discountApplied}
                                onChange={(e) => handleDiscountChange(parseInt(e.target.value) )}
                                className={style.FormInput}
                            />
                        </div>
                        
                        <div className={style.FormField}>
                            <label className={style.FormLabel}>Valor Final</label>
                            <div className={style.FinalPriceDisplay}>
                                {formatPrice(appointment.service.price * ((100 - editingData.discountApplied) / 100))}
                            </div>
                        </div>
                    </div>
                </div>

                <div className={style.EditActions}>
                    <button 
                        className={style.CancelButton} 
                        onClick={() => setIsEditModalOpen(false)}
                        disabled={isLoading}
                    >
                        <FontAwesomeIcon icon='times' /> Cancelar
                    </button>
                    <button 
                        className={style.SaveButton} 
                        onClick={handleSaveChanges}
                        disabled={isLoading || isNaN(appointment.service.price * ((100 - editingData.discountApplied) / 100))}
                    >
                        {isLoading ? (
                            <>
                                <FontAwesomeIcon icon='spinner' spin /> Salvando...
                            </>
                        ) : (
                            <>
                                <FontAwesomeIcon icon='check' /> Salvar
                            </>
                        )}
                    </button>
                </div>
            </Modal>
        </>
    )
}

export default AdminScheduledService