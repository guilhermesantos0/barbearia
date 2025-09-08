// @ts-ignore
import { IScheduledService } from "@types/ScheduledService";
import { ReactNode, useEffect, useState } from "react";

import Modal from "@components/Modal";

import style from './ServiceActions.module.scss';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// @ts-ignore
import { formatDate } from "@utils/formatDate";

import { useQueryClient } from '@tanstack/react-query';
import { useUser } from "@contexts/UserContext";
// @ts-ignore
import api from "@services/api";
import DatePicker from "@components/DatePicker";
import TimePicker from "@components/TimePicker";
import { format } from "date-fns";
import { toast } from "react-toastify";

interface ServiceActionsProps {
    service: IScheduledService,
    trigger: ReactNode
}

const ServiceActions:React.FC<ServiceActionsProps> = ({ service, trigger }) => {
    const [page, setPage] = useState<'main' | 'edit' | 'cancel'>('main')

    const { user } = useUser();
    const queryClient = useQueryClient();

    const [availableTimes, setAvailableTimes] = useState<string[]>([]);
    const [reason, setReason] = useState<string>('');

    useEffect(() => {
        setPage('main')
    }, [])

    const handleOpenEdit = async () => {
        const onlyServiceDate = format(service.date, 'yyyy-MM-dd')
        const onlyServiceTime = format(service.date, 'HH:mm')

        const barberTimesResult = await api.get(`/users/barbers/${user?.sub}/available-slots?date=${onlyServiceDate}&serviceDuration=${service.service.duration}`);
        const createAvailableTimes = [ ...barberTimesResult.data, onlyServiceTime ].map(t => { const [h, m] = t.split(":").map(Number); return { original: t, minutes: h * 60 + m }; }).sort((a, b) => a.minutes - b.minutes).map(t => t.original)
        setAvailableTimes(createAvailableTimes);
        setPage('edit');
    };

    const handleCancel = async () => {
        setPage('cancel');
    }

    const handleFinish = async () => {
        const response = await api.put(`/scheduledservices/${service._id}`, { status: 'Finalizado' })
        if (response.status === 200) {
            // @ts-ignore
            queryClient.invalidateQueries(['nextServices', user?.sub]);
        }
    }

    const handleStart = async() => {
        const response = await api.put(`/scheduledservices/${service._id}`, { status: 'Em andamento' })
        if (response.status === 200) {
            // @ts-ignore
            queryClient.invalidateQueries(['nextServices', user?.sub]);
        }
    }

    const handleChangeDate = async(newDate: Date | string) => {
        const barberTimesResult = await api.get(`/users/barbers/${user?.sub}/available-slots?date=${newDate}&serviceDuration=${service.service.duration}`);
        setAvailableTimes(barberTimesResult.data);
        console.log(newDate);
    }

    const initialDate = new Date(service.date);
    const [serviceTime, setServiceTime] = useState(
        `${String(initialDate.getHours()).padStart(2, "0")}:${String(initialDate.getMinutes()).padStart(2, "0")}`
    );

    const handleBack = async () => {
        setPage('main')
        setAvailableTimes([])
    }    

    const handleConfirmAndCancel = async () => {
        if(reason.trim().length === 0) {
            toast.error('Por favor, insira um motivo para o cancelamento.');
            return;
        }
        
        const canceled = await api.put(`/scheduledservices/${service._id}`, { status: 'Cancelado', cancelReason: reason });
        if(canceled.status === 200) {
            toast.success('Agendamento cancelado com sucesso!');
            // @ts-ignore
            queryClient.invalidateQueries(['nextServices', user.sub]);
        }
        else { 
            toast.error('Erro ao cancelar agendamento. Tente novamente mais tarde.');
        }
    }

    return (
        <>
            <Modal trigger={trigger} overflowYShow={page === 'edit'} >
                <div className={style.Container}>
                    <h2 className={style.Title}>{service.service.name}</h2>
                    <div className={style.Details}>
                        <span className={style.Detail}><p className={style.DetailLabel}><FontAwesomeIcon icon="person" /> Cliente</p><p className={style.DetailValue}>{service.costumer.name}</p></span>
                        <span className={style.Detail}><p className={style.DetailLabel}><FontAwesomeIcon icon="clock" /> Horário</p><p className={style.DetailValue}>{formatDate(service.date)}</p></span>
                    </div>
                    {
                        page == 'main' && (
                            <div className={style.Actions}>
                                <button className={style.Action} disabled={service.status === 'Finalizado'} onClick={handleOpenEdit}><FontAwesomeIcon icon='pencil' /> Editar</button>
                                <button className={style.Action} disabled={service.status === 'Finalizado'} onClick={handleCancel}><FontAwesomeIcon icon='xmark' /> Cancelar</button>

                                {
                                    service.status === 'Em andamento' && (
                                        <button className={`${style.Action} ${style.Start}`} onClick={handleFinish} >
                                            <FontAwesomeIcon icon="spinner" spin /> Finalizar
                                        </button>
                                    )
                                }
                                
                                {
                                    (service.status === 'Confirmado' || service.status === 'Atrasado') && (
                                        <button className={`${style.Action} ${style.Start}`} onClick={handleStart} >
                                            <FontAwesomeIcon icon="play" /> Iniciar
                                        </button>
                                    )
                                }
                                {
                                    service.status === 'Finalizado' && (
                                        <button className={`${style.Action} ${style.Start}`} disabled>
                                            <FontAwesomeIcon icon="check" /> Finalizado
                                        </button>
                                    )
                                }
                            
                            </div>
                        )
                    }
                    {
                        page === 'edit' && (
                            <>
                                <div className={style.Items}>
                                    <div className={style.DatePicker}>
                                        <DatePicker defaultValue={new Date(service.date)} onChange={handleChangeDate} />
                                    </div>
                                    <div className={style.TimePicker}>
                                        <TimePicker label="Horário" defaultOptions={availableTimes} value={serviceTime} onChange={setServiceTime} />
                                    </div>
                                </div>

                                <div className={`${style.Actions} ${style.EditActions}`}>
                                    <button className={style.Action} onClick={handleBack}><FontAwesomeIcon icon='arrow-left' /> Voltar</button>
                                    <button className={`${style.Action} ${style.Start}`}><FontAwesomeIcon icon='check' /> Confirmar</button>
                                </div>
                            </>
                        )
                    }
                    {
                        page === 'cancel' && (
                            <>
                                <h2 className={style.ModalTitle}>Motivo do cancelamento</h2>
                                <textarea className={style.ReasonInput} placeholder="Descreva o motivo do cancelamento..." value={reason} onChange={(e) => setReason(e.target.value)} />
                                <p className={style.Warning}>O cliente será notificado sobre o cancelamento.</p>
                                <div className={style.CancelActions}>
                                    <button className={style.ConfirmButton} onClick={handleConfirmAndCancel}>Confirmar</button>
                                    <button className={style.CancelButton} onClick={() => setPage('main')}>Voltar</button>
                                </div>
                            </>
                        )
                    }
                </div>
            </Modal>

        </>
    )
}

export default ServiceActions