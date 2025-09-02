// @ts-ignore
import { IScheduledService } from "@types/ScheduledService";
import { ReactNode, useState } from "react";

import Modal from "@components/Modal";

import style from './ServiceActions.module.scss';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// @ts-ignore
import { formatDate } from "@utils/formatDate";

import { useQueryClient } from '@tanstack/react-query';
import { useUser } from "@contexts/UserContext";
// @ts-ignore
import api from "@services/api";

interface ServiceActionsProps {
    service: IScheduledService,
    trigger: ReactNode
}

const ServiceActions:React.FC<ServiceActionsProps> = ({ service, trigger }) => {
    const [isSecondaryModalOpen, setIsSecondaryModalOpen] = useState<boolean>(false);

    const { user } = useUser();
    const queryClient = useQueryClient();

    const handleEdit = async () => {
        setIsSecondaryModalOpen(true);
    }

    const handleRemove = async () => {
        setIsSecondaryModalOpen(true);
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

    return (
        <>
            <Modal trigger={trigger} >
                <div className={style.Container}>
                    <h2 className={style.Title}>{service.service.name}</h2>
                    <div className={style.Details}>
                        <span className={style.Detail}><p className={style.DetailLabel}><FontAwesomeIcon icon="person" /> Cliente</p><p className={style.DetailValue}>{service.costumer.name}</p></span>
                        <span className={style.Detail}><p className={style.DetailLabel}><FontAwesomeIcon icon="clock" /> Horário</p><p className={style.DetailValue}>{formatDate(service.date)}</p></span>
                    </div>
                    <div className={style.Actions}>
                        <button className={style.Action}><FontAwesomeIcon icon='pencil' /> Editar</button>
                        <button className={style.Action}><FontAwesomeIcon icon='trash' /> Remover</button>

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
                </div>
            </Modal>

        </>
    )
}

export default ServiceActions