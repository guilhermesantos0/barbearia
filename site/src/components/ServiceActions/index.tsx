import { IScheduledService } from "@types/ScheduledService";
import { ReactNode } from "react";

import Modal from "@components/Modal";

import style from './ServiceActions.module.scss';

interface ServiceActionsProps {
    service: IScheduledService,
    trigger: ReactNode
}

const ServiceActions:React.FC<ServiceActionsProps> = ({ service, trigger }) => {
    return (
        <Modal trigger={trigger} >
            <div className={style.Container}>
                <h2 className={style.Title}></h2>
                <div className={style.Actions}>

                </div>
            </div>
        </Modal>
    )
}

export default ServiceActions