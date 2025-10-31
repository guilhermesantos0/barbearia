import style from './AdminBenefit.module.scss';

import { IBenefit } from '@types/Plan';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { SelectMenu } from '@components/SelectMenu';
import { IconProp } from '@fortawesome/fontawesome-svg-core';
import { useQueryClient } from '@tanstack/react-query';
import Modal from '@components/Modal';
import { useState } from 'react';

interface AdminBenefitProps {
    benefit: IBenefit
};

const AdminBenefit: React.FC<AdminBenefitProps> = ({ benefit }) => {

    const queryClient = useQueryClient();
    const [isModalOpen, setIsModalOpen] = useState(false);
    
    const handleChangeType = async () => {

    }

    const getBenefitIcon = (type: string): IconProp => {
        const iconMap: Record<string, IconProp> = {
            'percentage': 'percentage',
            'fixed_value': 'dollar-sign',
            'free_service': 'scissors',
            'free_courtesy': 'gift',
            'free_extra_service': 'star',
            'other_plan_benefits': 'medal',
            'free_barbershop_products': 'pump-soap'
        };
        return iconMap[type] || 'question';
    };

    const typeOptions = [
        {
            label: 'Porcentagem',
            value: 'percentage',
            icon: <FontAwesomeIcon icon="percentage" />
        },
        {
            label: 'Valor Fixo',
            value: 'fixed_value',
            icon: <FontAwesomeIcon icon="dollar-sign" />
        },
        {
            label: 'Serviço Grátis',
            value: 'free_service',
            icon: <FontAwesomeIcon icon="scissors" />
        },
        {
            label: 'Cortesia',
            value: 'free_courtesy',
            icon: <FontAwesomeIcon icon="gift" />
        },
        {
            label: 'Serviço Extra Grátis',
            value: 'free_extra_service',
            icon: <FontAwesomeIcon icon="star" />
        },
        {
            label: 'Outros Benefícios',
            value: 'other_plan_benefits',
            icon: <FontAwesomeIcon icon="medal" />
        },
        {
            label: 'Produtos da Barbearia',
            value: 'free_barbershop_products',
            icon: <FontAwesomeIcon icon="pump-soap" />
        }
    ];

    const [editingData, setEditingData] = useState<{
        label: string,
        type: string,
        value: number,
        conditions: Object,
        unlimited: boolean
    }>({
        label: benefit.label,
        type: benefit.type,
        value: benefit.value,
        conditions: benefit.conditions,
        unlimited: benefit.unlimited
    })

    return (
        <>
            <div className={style.Benefit}>
                <div className={style.ExhibitionArea}>
                    <div className={style.LeftContent}>
                        <FontAwesomeIcon 
                            icon={getBenefitIcon(benefit.type)} 
                            className={style[benefit.type as keyof typeof style]}
                        />
                        <h4>{benefit.label}</h4>
                    </div>
                    <div className={style.RightContent}>
                        <SelectMenu freePosition className={style.SelectMenu} options={typeOptions} onChange={handleChangeType} value={benefit.type} viewPortClassName={style.ViewPortClassName} />
                        <FontAwesomeIcon icon='pencil' className={style.Edit} onClick={() => setIsModalOpen(true)} />
                    </div>
                </div>
            </div>
            <Modal open={isModalOpen} onOpenChange={setIsModalOpen} trigger={<></>} close>
                <div className={style.ModalContent}>
                    <h3>Editar Benefício</h3>
                    <div className={style.ModalForm}>
                        <div className={style.ModalFormGroup}>
                            <label htmlFor="benefitName">Nome do Benefício</label>
                        </div>
                    </div>
                </div>
            </Modal>
        </>
    )
}

export default AdminBenefit