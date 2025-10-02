import style from './AdminBenefit.module.scss';

import { IBenefit } from '@types/Plan';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { SelectMenu } from '@components/SelectMenu';
import { IconProp } from '@fortawesome/fontawesome-svg-core';
import { useQueryClient } from '@tanstack/react-query';

interface AdminBenefitProps {
    benefit: IBenefit
};

const AdminBenefit: React.FC<AdminBenefitProps> = ({ benefit }) => {

    const queryClient = useQueryClient();
    
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

    return (
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
                    <FontAwesomeIcon icon='pencil' className={style.Edit} onClick={(e) => e.stopPropagation()} />
                </div>
            </div>
        </div>
    )
}

export default AdminBenefit