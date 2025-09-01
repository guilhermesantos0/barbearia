// @ts-ignore
import { IScheduledService } from '@types/ScheduledService';
import style from './PendingSchedule.module.scss';
// @ts-ignore
import { formatDate } from '@utils/formatDate';
// @ts-ignore
import api from '@services/api';
import { toast } from 'react-toastify';
import Modal from '@components/Modal';

import * as Dialog from '@radix-ui/react-dialog';
import { useState } from 'react';

import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useUser } from '@contexts/UserContext';

interface PendingScheduleProps {
    schedule: IScheduledService;
    onConfirm?: () => void;
}

const PendingSchedule: React.FC<PendingScheduleProps> = ({ schedule, onConfirm }) => {

    const { user } = useUser();
    const queryClient = useQueryClient();

    const [modalOpen, setModalOpen] = useState(false);
    const [reason, setReason] = useState('');

    const handleConfirm = async () => {
        const confirmed = await api.put(`/scheduledservices/${schedule._id}`, { status: 'Confirmado' });
        if(confirmed.status === 200) {
            toast.success('Agendamento confirmado com sucesso!');
            onConfirm && onConfirm();
            queryClient.invalidateQueries(['unconfirmedSchedules', user?.sub]);
        }
        else { 
            toast.error('Erro ao confirmar agendamento. Tente novamente mais tarde.');
        }
    }

    const handleCancel = () => {
        setModalOpen(true);
    }

    const handleConfirmAndCancel = async () => {
        if(reason.trim().length === 0) {
            toast.error('Por favor, insira um motivo para o cancelamento.');
            return;
        }

        const canceled = await api.put(`/scheduledservices/${schedule._id}`, { status: 'Cancelado', cancelReason: reason });
        if(canceled.status === 200) {
            toast.success('Agendamento cancelado com sucesso!');
            onConfirm && onConfirm();
            setModalOpen(false);
            queryClient.invalidateQueries(['unconfirmedSchedules', user?.sub]);
        }
        else { 
            toast.error('Erro ao cancelar agendamento. Tente novamente mais tarde.');
        }
    }

    return (
        <>
            <div className={style.Container}>
                <h2 className={style.Title}>{schedule.service.name}</h2>
                <div className={style.Details}>
                    <span className={style.Detail}><p className={style.DetailLabel}>Cliente</p> <p className={style.DetailValue}>{schedule.costumer.name}</p></span>
                    <span className={style.Detail}><p className={style.DetailLabel}>Data</p> <p className={style.DetailValue}>{formatDate(schedule.date)}</p></span>
                    <span className={style.Detail}><p className={style.DetailLabel}>Status</p> <p className={style.DetailValue}>{schedule.status}</p></span>
                </div>
                <div className={style.Actions}>
                    <button className={style.ConfirmButton} onClick={handleConfirm}>Confirmar</button>
                    <button className={style.CancelButton} onClick={handleCancel}>Cancelar</button>
                </div>
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
    );
};

export default PendingSchedule;