import { IService } from '@types/Service';
import style from './AdminService.module.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IconProp } from '@fortawesome/fontawesome-svg-core';

import MustacheIcon from '@assets/icons/mustache.svg?react';
import { ReactNode, useState } from 'react';
import { fomratTimeDuration } from '@utils/formatTimeDuration';
import { formatPrice } from '@utils/formatPrice';
import { toast } from 'react-toastify';
import api from '@services/api';

import * as Dialog from '@radix-ui/react-dialog';
import { Switch } from '@radix-ui/react-switch';
import Modal from '@components/Modal';

interface AdminServiceProps {
    service: IService;
}

interface ServiceInfosProps {
    icon: ReactNode,
    label: string,
    value?: string
}

const AdminService:React.FC<AdminServiceProps> = ({ service }) => {

    const [isActive, setIsActive] = useState<boolean>(service.active); 
    const [confirmOpen, setConfirmOpen] = useState<boolean>(false);

    const ServiceInfos:React.FC<ServiceInfosProps> = ({ icon, label, value }) => {
        return (
            <div className={style.ServiceInfo}>
                <div className={style.ServiceInfoLabelSection}>
                    {icon}
                    <h4 className={style.ServiceInfoLabel}>{label}:</h4>
                </div>
                <h3 className={style.ServiceInfoValue}>{value}</h3>
            </div>
        )
    }

    const serviceInfosArray = [
        {
            icon: <FontAwesomeIcon icon={['far', 'clock']} />,
            label: 'Duração',
            value: fomratTimeDuration(service.duration)
        },
        {
            icon: <FontAwesomeIcon icon='dollar' />,
            label: 'Preço',
            value: formatPrice(service.price)
        },
    ]

    const handleToggle = async () => {
        if (isActive) {
            setConfirmOpen(true)
        } else {
            const activateResult = await api.patch(`/services/${service._id}/status`, { "active": true });

            if (activateResult.status === 200) {
                setIsActive(true);
                toast.success('Serviço ativado com sucesso!')
            } else {
                toast.warn('Houve um erro ao ativar o serviço!')
            }
        }
    }

    const confirmDisable = async () => {
        const disableResult = await api.patch(`/services/${service._id}/status`, { "active": false });

        if (disableResult.status === 200) {
            setIsActive(false);
            setConfirmOpen(false);
            toast.info('Serviço desativado com sucesso!');
        } else {
            toast.warn('Houve um erro ao desativar o serviço!')
        }
    }

    return (
        <div className={style.Container}>
            <div className={style.TopInfos}>
                <div className={style.IconContainer}>
                    {
                        service.category === 'beard_services' ? (
                            <MustacheIcon className={style.Icon} />
                        ) : (
                            <FontAwesomeIcon className={style.Icon} icon={{
                                'hair_services': 'scissors' as IconProp,
                                'stetic_services': 'droplet' as IconProp,
                                'combo_services': 'gift' as IconProp,
                                'other_services': 'gear' as IconProp
                                }[service.category] || 'power-off'} 
                            />
                        )
                    }
                </div>
                <div className={style.TextsContainer}>
                    <h2 className={style.Name}>{service.name}</h2>
                    <h4 className={style.Description}>{service.description}</h4>
                </div>
            </div>
            <div className={style.ServiceInfos}>
                {
                    serviceInfosArray.map((serviceInfo, idx) => (
                        <ServiceInfos key={idx} icon={serviceInfo.icon} label={serviceInfo.label} value={serviceInfo.value} />
                    ))
                }
            </div>
            <span className={`${style.StatusInfo} ${isActive ? style.Active : style.Inactive}`}>
                <div className={style.StatusIndicator}></div>
                { isActive ? 'Ativo' : 'Inativo' }
            </span>
            <div className={style.SwitchWrapper}>
                <Switch
                    checked={isActive}
                    onCheckedChange={handleToggle}
                    className={style.Switch}
                />
                <div className={style.Status}>
            </div>

                <Modal open={confirmOpen} onOpenChange={setConfirmOpen} trigger={<></>}>
                    <h2 className={style.ModalTitle}>Desativar serviço</h2>
                    <div className={style.ModalDescription}>
                        Tem certeza que deseja desativar o serviço <b>{service.name}</b>?<br/>Ele não poderá mais ser agendado.
                    </div>
                    <div className={style.Actions}>
                            <button onClick={() => setConfirmOpen(false)} className={style.Cancel}>
                                Cancelar
                            </button>
                            <button onClick={confirmDisable} className={style.Confirm}>
                                Confirmar
                            </button>
                        </div>
                </Modal>
            </div>

        </div>
    )
}

export default AdminService