import style from './ScheduledService.module.scss';

import { IScheduledService } from '../../types/ScheduledService';
import { useEffect, useState } from 'react';
import { Pencil1Icon } from '@radix-ui/react-icons';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IconProp } from '@fortawesome/fontawesome-svg-core';
// @ts-ignore
import api from '@services/api';
import { toast } from 'react-toastify';
import * as Dialog from '@radix-ui/react-dialog';
import { useUser } from '@contexts/UserContext';
import { useQueryClient } from '@tanstack/react-query';

interface Props {
    service: IScheduledService,
    view: 'Costumer' | 'Employee'
}

const ScheduledService:React.FC<Props> = ({ service, view }) => {

    const { user } = useUser();
    const queryClient = useQueryClient();

    const [serviceDate, setServiceDate] = useState('');
    const [serviceStatusStyle, setServiceStatusStyle] = useState('')

    const [modalOpen, setModalOpen] = useState<boolean>(false);
    const [reason, setReason] = useState<string>('');

    const formatDate = (date: Date | string) => {
        const d = typeof date === 'string' ? new Date(date) : date;
        
        if (isNaN(d.getTime())) return 'Data inválida';
        
        const day = d.getDate().toString().padStart(2, '0');
        const month = (d.getMonth() + 1).toString().padStart(2, '0');
        const year = d.getFullYear();
        const hours = d.getHours().toString().padStart(2, '0');
        const minutes = d.getMinutes().toString().padStart(2, '0');
        
        return `${day}/${month}/${year} às ${hours}:${minutes}`;
    };
 
    useEffect(() => {
        if (!service?.date) return;
        setServiceDate(formatDate(service.date));
        
        const statusMap: Record<string, string> = {
            'Pendente': style.Pending,
            'Confirmado': style.Confirmed,
            'Cancelado': style.Canceld,
            'Atrasado': style.Delayed,
            'Em andamento': style.Running,
            'Finalizado': style.Complete
        };
        
        setServiceStatusStyle(statusMap[service.status] || style.Pending);
    }, [service]);

    const handleCancelService = async () => {

    }

    const handleDeleteService = async () => {
        const response = await api.delete(`/scheduledservices/${service._id}`);
        if (response.status === 200) {
            // @ts-ignore
            queryClient.invalidateQueries(['nextServices', user.sub]);
            toast.success('Agendamento deletado com sucesso!')
        }
    }
    
    const handleConfirmAndCancel = async () => {
        if(reason.trim().length === 0) {
            toast.error('Por favor, insira um motivo para o cancelamento.');
            return;
        }
        
        const canceled = await api.put(`/scheduledservices/${service._id}`, { status: 'Cancelado', cancelReason: reason });
        if(canceled.status === 200) {
            toast.success('Agendamento cancelado com sucesso!');
            setModalOpen(false);
            // @ts-ignore
            queryClient.invalidateQueries(['nextServices', user.sub]);
        }
        else { 
            toast.error('Erro ao cancelar agendamento. Tente novamente mais tarde.');
        }
    }

    return (
        <>
            <div className={style.Container}>
                {
                    view === 'Costumer' ? (
                        <>
                            {
                                service.status !== "Em andamento" && service.status !== "Cancelado" && (
                                    <FontAwesomeIcon onClick={() => setModalOpen(true)} icon={['far', "xmark-circle"]} className={`${style.Icon} ${style.Trash}`} />       
                                )
                            }
                            {
                                service.status === "Cancelado" && (
                                    <FontAwesomeIcon onClick={handleDeleteService} icon="trash" className={`${style.Icon} ${style.Trash}`} />
                                )
                            }
                            <div className={style.ServiceInfos}>
                                <p className={style.Title}>{service.service.name}</p>
                                <div className={style.Details}>
                                    <p className={style.AditionalInfo}><FontAwesomeIcon className={style.DetailsIcon} icon="user" /> {service.barber.name}</p>
                                    <p className={style.AditionalInfo}><FontAwesomeIcon className={style.DetailsIcon} icon="calendar" />{serviceDate || 'Carregando data...'}</p>
                                </div>
                                <p className={`${style.Status} ${serviceStatusStyle}`}>
                                    <FontAwesomeIcon 
                                        
                                        icon={{
                                            'Pendente': 'clock' as IconProp,
                                            'Confirmado': 'check' as IconProp,
                                            'Cancelado': 'times' as IconProp,
                                            'Atrasado': 'running' as IconProp,
                                            'Em andamento': 'spinner' as IconProp,
                                            'Finalizado': 'calendar-check' as IconProp
                                        }[service.status] || 'question'} 

                                        spin={service.status === 'Em andamento'}
                                    /> {service.status}
                                </p>
                            </div>
                        </>
                        
                    ) : (
                        <Pencil1Icon className={`${style.Icon} ${style.Pencil}`} />
                    )
                }
                
            </div>

            <Dialog.Root open={modalOpen} onOpenChange={setModalOpen}>
                <Dialog.Portal>
                    <Dialog.Overlay className={style.ConfirmOverlay} />
                    <Dialog.Content className={style.ConfirmContainer}>
                        <h2>Motivo do cancelamento</h2>
                        <textarea className={style.ReasonInput} placeholder="Descreva o motivo do cancelamento..." value={reason} onChange={(e) => setReason(e.target.value)} />
                        <p className={style.Warning}>O cliente será notificado sobre o cancelamento.</p>
                        <div className={style.ConfirmButtons}>
                            <button className={style.ConfirmButton} onClick={handleConfirmAndCancel}>Confirmar</button>
                            <Dialog.Close asChild>
                                <button className={style.CancelButton}>Voltar</button>
                            </Dialog.Close>
                        </div>
                    </Dialog.Content>
                </Dialog.Portal>
            </Dialog.Root>
        </>
    )
}

export default ScheduledService