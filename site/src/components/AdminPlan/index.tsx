import { IBenefit, IPlan } from '@types/Plan';
import style from './AdminPlan.module.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { formatPrice } from '@utils/formatPrice';
import * as Checkbox from '@radix-ui/react-checkbox';
import { CheckIcon } from '@radix-ui/react-icons';
import { IconProp } from '@fortawesome/fontawesome-svg-core';
import { SelectMenu } from '@components/SelectMenu';
import AdminBenefit from './AdminBenefit';
import { useQueryClient } from '@tanstack/react-query';
import Modal from '@components/Modal';
import { useState } from 'react';
import api from '@services/api';
import { toast } from 'react-toastify';
import { useUser } from '@contexts/UserContext';
import { Switch } from '@radix-ui/react-switch';

interface AdminPlanProps {
    plan: IPlan
}

const AdminPlan: React.FC<AdminPlanProps> = ({ plan }) => {

    const { user } = useUser();

    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const [isActive, setIsActive] = useState<boolean>(plan.active); 

    const queryClient = useQueryClient();

    const handleToggle = async () => {
        if (plan.active) {
            setIsModalOpen(true)
        }
        else {
            const activateResult = await api.patch(`/plans/${plan._id}/status`, { "active": true });

            if(activateResult.status === 200) {
                // @ts-ignore
                queryClient.invalidateQueries(['premiumplans', user?.sub])
                setIsActive(true);
                toast.success('Plano ativado com sucesso!')
            } else {
                toast.warn('Houve um erro ao ativar plano!')
            }
        }
    }

    const confirmDisable = async () => {
        const disableResult = await api.patch(`/plans/${plan._id}/status`, { "active": false });

        if (disableResult.status === 200) {
            // @ts-ignore
            queryClient.invalidateQueries(['premiumplans', user?.sub])
            setIsActive(false)
            setIsModalOpen(false)
            toast.info('Plano desativado com sucesso!')
        } else {
            toast.warn('Houve um erro ao desativar plano!')
        }
    }

    const handleEdit = () => {
        
    }

    return (
        <>
            <div className={`${style.Plan} ${!plan.active ? style.inactive : ''}`}>
                <div className={style.TopSection}>
                    <FontAwesomeIcon icon='crown' className={style.Icon} />
                    <div className={style.MainText}>
                        <h3 className={style.Title}>{plan.name}</h3>
                        <h4 className={style.Subtitle}>{plan.description}</h4>
                        <h4 className={style.Price}>{formatPrice(plan.price)}</h4>
                    </div>
                    <div className={style.OptionsContainer}>
                        <div className={style.Options}>
                            <Switch
                                checked={isActive}
                                onCheckedChange={handleToggle}
                                className={style.Switch}
                            />
                            <button className={style.Button} onClick={handleEdit}><FontAwesomeIcon className={style.Icon} icon='pencil' /></button>
                            <button className={style.Button}><FontAwesomeIcon className={`${style.Icon} ${style.Delete}`} icon='trash' /></button>
                        </div>
                        <div className={style.StatusWrapper}>
                            <span className={`${style.StatusInfo} ${isActive ? style.Active : style.Inactive}`}>
                                <div className={style.StatusIndicator}></div>
                                { isActive ? 'Ativo' : 'Inativo' }
                            </span>
                        </div>
                    </div>
                    {/* <div className={style.Checkbox}>
                        <Checkbox.Root
                            className={style.CheckboxRoot}
                            id={`plan-status-${plan._id}`}
                            checked={plan.active}
                            onCheckedChange={handleToggle}
                        >
                            <Checkbox.Indicator className={style.CheckboxIndicator}>
                                <CheckIcon width={16} height={16} />
                            </Checkbox.Indicator>
                        </Checkbox.Root>
                        <label htmlFor={`plan-status-${plan._id}`} className={style.Label}>
                            {plan.active ? 'Ativo' : 'Inativo'}
                        </label>
                    </div> */}
                </div>
                <div className={style.BottomSection}>
                    <div className={style.BenefitsLabel}>
                        <h3>Benefícios do plano:</h3>
                        <button className={style.AddBenefit}><FontAwesomeIcon icon='plus' className={style.Icon} /> Adicionar Benefício</button>
                    </div>
                    <div className={style.Benefits}>
                        {
                            plan.benefits.length > 0 && plan.benefits.map((benefit: IBenefit) => (
                                <AdminBenefit benefit={benefit} />
                            ))
                        }
                    </div>
                </div>

                
            </div>

            {/* {confirmDeactivate && (
                <div className={style.ConfirmationOverlay}>
                    <div className={style.ConfirmationDialog}>
                        <h3>Confirmar Desativação</h3>
                        <p>Tem certeza que deseja desativar o plano <strong>"{confirmDeactivate.planName}"</strong>?</p>
                        <p>Esta ação pode afetar os clientes que possuem este plano ativo.</p>
                        <div className={style.ConfirmationButtons}>
                            <button 
                                className={style.CancelButton} 
                                onClick={() => setConfirmDeactivate(null)}
                            >
                                Cancelar
                            </button>
                            <button 
                                className={style.ConfirmButton} 
                                onClick={confirmDeactivatePlan}
                            >
                                Desativar
                            </button>
                        </div>
                    </div>
                </div>
            )} */}

            <Modal open={isModalOpen} onOpenChange={setIsModalOpen} trigger={<></>}>
                <div className={style.ModalContent}>
                    <h3>Confirmar Alteração de Status</h3>
                    <p>Tem certeza que deseja {plan.active ? 'desativar' : 'ativar'} o plano <strong>"{plan.name}"</strong>?</p>
                    {plan.active && (
                        <p>Esta ação pode afetar os clientes que possuem este plano ativo.</p>
                    )}
                    <div className={style.ModalButtons}>
                        <button 
                            className={style.CancelButton} 
                            onClick={() => setIsModalOpen(false)}
                        >
                            Cancelar
                        </button>
                        <button 
                            className={style.ConfirmButton} 
                            onClick={confirmDisable}
                        >
                            {plan.active ? 'Desativar' : 'Ativar'}
                        </button>
                    </div>
                </div>
            </Modal>
        </>
    )
}

export default AdminPlan;