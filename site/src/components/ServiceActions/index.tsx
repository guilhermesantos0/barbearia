import { IScheduledService } from "@types/ScheduledService";
import { ReactNode } from "react";

import Modal from "@components/Modal";

import style from './ServiceActions.module.scss';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { formatDate } from "@utils/formatDate";

interface ServiceActionsProps {
    service: IScheduledService,
    trigger: ReactNode
}

const ServiceActions:React.FC<ServiceActionsProps> = ({ service, trigger }) => {
    return (
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
                    <button className={`${style.Action} ${style.Start}`}><FontAwesomeIcon icon='play' /> Iniciar</button>
                </div>
            </div>
        </Modal>
    )
}

export default ServiceActions