import { IService } from '../../types/Service';
import style from './AdminService.module.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IconProp } from '@fortawesome/fontawesome-svg-core';

import MustacheIcon from '@assets/icons/mustache.svg?react';
import { ReactNode, useState } from 'react';
import { fomratTimeDuration } from '../../utils/formatTimeDuration';
import { formatPrice } from '../../utils/formatPrice';
import { toast } from 'react-toastify';
import api from '../../services/api';
import { useNavigate } from 'react-router-dom';

import { Switch } from '@radix-ui/react-switch';
import Modal from '@components/Modal';
import { useQueryClient } from '@tanstack/react-query';
import { SelectMenu } from '@components/SelectMenu';
import { useUser } from '@contexts/UserContext';

interface AdminServiceProps {
    service: IService;
}

interface ServiceInfosProps {
    icon: ReactNode,
    label: string,
    value?: string
}

const AdminService:React.FC<AdminServiceProps> = ({ service }) => {

    const { user } = useUser();
    const queryClient = useQueryClient();

    const [isActive, setIsActive] = useState<boolean>(service.active); 
    const [confirmOpen, setConfirmOpen] = useState<boolean>(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false);

    const [priceInput, setPriceInput] = useState(formatPrice(service.price))
    const [durationInput, setDurationInput] = useState(fomratTimeDuration(service.duration))

    const [editingData, setEditingData] = useState<{
        name: string,
        description: string,
        price: number,
        duration: number,
        category: string
    }>({
        name: service.name,
        description: service.description,
        price: service.price,
        duration: service.duration,
        category: service.category
    });

    const [isLoading, setIsLoading] = useState<boolean>(false);

    const handleSaveChanges = async () => {
        setIsLoading(true);
        try {
            const response = await api.put(`/services/${service._id}`, editingData );

            if (response.status === 200) {
                toast.success('Serviço atualizado com sucesso!');
                // @ts-ignore
                queryClient.invalidateQueries(['services', user.sub ]);
                
            } else {
                toast.error('Erro ao atualizar serviço!')
            }
        } catch (error) {
            toast.error('Erro ao atualizar serviço!')
        } finally {
            setIsEditModalOpen(false);
            setIsLoading(false)
        }
    }

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

    const handleNameChange = (newName: string) => {
        setEditingData(prev => ({ ...prev, name: newName }));
    }

    const handleDescriptionChange = (newDescription: string) => {
        setEditingData(prev => ({ ...prev, description: newDescription }));
    }

    const categoryOptions = [
        { value: 'hair_services', label: 'Serviços de Cabelo' },
        { value: 'beard_services', label: 'Serviços de Barba' },
        { value: 'stetic_services', label: 'Serviços Estéticos' },
        { value: 'combo_services', label: 'Serviços Combo' },
        { value: 'other_services', label: 'Outros Serviços' }
    ];

    return (
        <>
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

                <div className={style.BottomOptions}>
                    <Switch
                        checked={isActive}
                        onCheckedChange={handleToggle}
                        className={style.Switch}
                    />
                    <button className={style.Button} onClick={() => setIsEditModalOpen(true)}><FontAwesomeIcon className={style.Icon} icon='pencil' /></button>
                    <button className={style.Button}><FontAwesomeIcon className={`${style.Icon} ${style.Delete}`} icon='trash' /></button>
                </div>

            </div>

            <Modal open={confirmOpen} onOpenChange={setConfirmOpen} trigger={<></>}>
                <h2>Desativar serviço</h2>
                <div>
                    Tem certeza que deseja desativar o serviço <b className={style.RemovingService}>{service.name}</b>?<br/>Ele não poderá mais ser agendado.
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

            <Modal open={isEditModalOpen} onOpenChange={setIsEditModalOpen} trigger={<></>}>
                <h2>Editar Serviço</h2>

                <div className={style.EditForm}>
                    <div className={`${style.InputContainer} ${style.Name}`}>
                        <label htmlFor="serviceName">Nome do Serviço</label>
                        <input type="text" id='serviceName' value={editingData.name} onChange={(e) => handleNameChange(e.target.value)} />
                    </div>

                    <div className={`${style.InputContainer} ${style.Description}`}>
                        <label htmlFor="serviceDescription">Descrição</label>
                        <textarea name="serviceDescription" id="serviceDescription" value={editingData.description} onChange={(e) => handleDescriptionChange(e.target.value)}></textarea>
                    </div>

                    <div className={`${style.InputContainer} ${style.Price}`}>
                        <label htmlFor="servicePrice">Preço</label>
                        <input 
                                type="text" 
                                placeholder="R$ 0,00" 
                                id='servicePrice'
                                value={priceInput} 
                                onChange={(e) => {
                                    setPriceInput(e.target.value);
                                }} 
                                onBlur={(e) => {
                                    const rawValue = e.target.value.replace(/[^\d,.]/g, '');
                                    let numericValue = 0;
                                    
                                    if (rawValue.includes(',')) {
                                        numericValue = parseFloat(rawValue.replace(',', '.')) || 0;
                                    } else if (rawValue.includes('.')) {
                                        numericValue = parseFloat(rawValue) || 0;
                                    } else if (rawValue) {
                                        numericValue = parseFloat(rawValue) / 100;
                                    }
                                    
                                    const priceInCents = Math.round(numericValue * 100);
                                    setEditingData({ ...editingData, price: priceInCents });
                                    setPriceInput(formatPrice(priceInCents));
                                }}
                                className={style.FormInput}
                            />
                    </div>

                    <div className={`${style.InputContainer} ${style.Duration}`}>
                        <label htmlFor="serviceDescription">Duração</label>
                        <input 
                            type="text" 
                            placeholder="30 min" 
                            value={durationInput} 
                            onChange={(e) => {
                                setDurationInput(e.target.value);
                            }} 
                            onBlur={(e) => {
                                const rawValue = e.target.value.replace(/[^\d]/g, '');
                                const numericValue = parseInt(rawValue) || 0;
                                setEditingData({ ...editingData, duration: numericValue });
                                setDurationInput(fomratTimeDuration(numericValue));
                            }}
                            className={style.FormInput}
                        />
                    </div>

                    <div className={`${style.InputContainer} ${style.Category}`}>
                        <label htmlFor="serviceCategory">Categoria</label>
                        <SelectMenu
                            options={categoryOptions}
                            placeholder='Selecione uma categoria'
                            value={editingData.category}
                            onChange={(value: string | undefined) => setEditingData({ ...editingData, category: value || 'other_services' })}
                            freePosition
                            viewPortClassName={style.SelectMenu}
                        >

                        </SelectMenu>
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
                        disabled={isLoading }
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

export default AdminService