import { useUser } from '@contexts/UserContext';
import style from './Plans.module.scss';
import { useEffect, useState } from 'react';
// @ts-ignore
import api from '@services/api';
import { useQuery } from '@tanstack/react-query';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IPlan } from '@types/Plan';
import { formatPrice } from '@utils/formatPrice';
import { icon, IconProp } from '@fortawesome/fontawesome-svg-core';
import { SelectMenu } from '@components/SelectMenu';
import * as Checkbox from '@radix-ui/react-checkbox';
import { CheckIcon } from '@radix-ui/react-icons';
import DatePicker from '@components/DatePicker';

interface ConditionValue {
    type: string,
    label: string
}

const AdminPlans = () => {

    const { user } = useUser();
    const [isAllowed, setIsAllowed] = useState<boolean>(false);

    const [expandedBenefit, setExpandedBenefit] = useState<string | null>(null);

    const [searchValue, setSearchValue] = useState<string>();

    useEffect(() => {
        const fetchData = async () => {
            if (!user) return;
            const roleTypeResult = await api.get(`/roles/${user.role}/type`);
            const roleType = roleTypeResult.data;
            setIsAllowed(roleType === 'admin' || roleType === 'barbeiro-admin');
        };
        fetchData();
    }, [user]);

    const { data: premiumPlans } = useQuery<IPlan[]>({
        queryKey: ['premiumplans', user?.sub],
        queryFn: async () => {
            const premiumPlansResult = await api.get('/plans');
            return premiumPlansResult.data;
        },
        enabled: isAllowed
    })

    useEffect(() => {
        premiumPlans?.forEach((plan) => {
            plan.benefits.forEach((benefit) => {
                console.log(`${plan.name}_${benefit.label} - ${JSON.stringify(benefit.conditions)}`)
            })
        })
    }, [premiumPlans])

    /* 
        'percentage': 'percentage' as IconProp,
        'fixed_value': 'dollar-sign' as IconProp,
        'free_service': 'scissors' as IconProp,
        'free_courtesy': 'gift' as IconProp,
        'free_extra_service': 'star' as IconProp,
        'other_plan_benefits' : 'medal' as IconProp,
        'free_barbershop_products': 'pump-soap' as IconProp
    */

    
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

    const appliesToOptions = [
        {
            label: 'Serviços de Cabelo',
            value: 'hair_services'
        },
        {
            label: 'Serviços de Barba',
            value: 'beard_services'
        },
        {
            label: 'Combos',
            value: 'comb_services'
        },
        {
            label: 'Outros',
            value: 'others'
        }
    ]

    // const conditionsArray = ['appliesTo', 'maxUsesPerMonth', 'expiresAt', 'durationDays']
    const conditionsArray: Record<string, ConditionValue> = {
        appliesTo: { type: 'string', label: 'Aplica Para:' },
        maxUsesPerMonth: { type: 'number', label: 'Usos /mês' },
        expiresAt: { type: 'date', label: 'Expira em' },
        durationDays: { type: 'number', label: 'Duração (dias)' }
    };

    const handleChangeType = () => {

    }

    const toggleCondition = (key) => {
        console.log(key)
    };

    return (
        <div className={style.Container}>
            {
                isAllowed ? (
                    <div className={style.PageContent}>
                        <h1>Planos de Assinatura</h1>
                        <div className={style.DisplayContent}>
                            <div className={style.TopOptions}>
                                <input type="text" className={style.SearchBox} value={searchValue} onChange={(e) => setSearchValue(e.target.value)} />
                                <button className={style.AddPlan}><FontAwesomeIcon icon='plus' /> Adicionar Plano</button>
                            </div>
                            <div className={style.Plans}>
                                {
                                    premiumPlans?.length > 0 && premiumPlans?.map((plan) => (
                                        <div key={plan._id} className={style.Plan}>
                                            <div className={style.TopSection}>
                                                <FontAwesomeIcon icon='crown' className={style.Icon} />
                                                <div className={style.MainText}>
                                                    <h3 className={style.Title}>{plan.name}</h3>
                                                    <h4 className={style.Subtitle}>{plan.description}</h4>
                                                    <h4 className={style.Price}>{formatPrice(plan.price)}</h4>
                                                </div>
                                            </div>
                                            <div className={style.BottomSection}>
                                                <div className={style.BenefitsLabel}>
                                                    <h3>Benefícios do plano:</h3>
                                                    <button className={style.AddBenefit}><FontAwesomeIcon icon='plus' className={style.Icon} /> Adicionar Benefício</button>
                                                </div>
                                                <div className={style.Benefits}>
                                                    {
                                                        plan.benefits.length > 0 && plan.benefits.map((benefit) => {
                                                            const isExpanded = expandedBenefit ===  benefit._id;

                                                            return (
                                                                <div key={benefit._id} className={style.Benefit} onClick={() => setExpandedBenefit(isExpanded ? null : benefit._id)}>
                                                                    <div className={style.ExhibitionArea}>
                                                                        <div className={style.LeftContent}>
                                                                            <FontAwesomeIcon 
                                                                                icon={{
                                                                                    'percentage': 'percentage' as IconProp,
                                                                                    'fixed_value': 'dollar-sign' as IconProp,
                                                                                    'free_service': 'scissors' as IconProp,
                                                                                    'free_courtesy': 'gift' as IconProp,
                                                                                    'free_extra_service': 'star' as IconProp,
                                                                                    'other_plan_benefits' : 'medal' as IconProp,
                                                                                    'free_barbershop_products': 'pump-soap' as IconProp
                                                                                }[benefit.type] || 'question'} 

                                                                                className={style[benefit.type]}
                                                                            />
                                                                            <h4>{benefit.label}</h4>
                                                                        </div>
                                                                        <div className={style.RightContent}>
                                                                            <SelectMenu freePosition className={style.SelectMenu} options={typeOptions} onChange={handleChangeType} value={benefit.type} viewPortClassName={style.ViewPortClassName} />
                                                                            <FontAwesomeIcon icon='pencil' className={style.Edit} onClick={(e) => e.stopPropagation()} />
                                                                        </div>
                                                                    </div>
                                                                    {
                                                                        isExpanded && (
                                                                            <div className={style.ExpandedContent} onClick={(e) => e.stopPropagation()}>
                                                                                <div className={style.DetailsGrid}>
                                                                                    <section className={style.DetailSection}>
                                                                                        <h4>Condições</h4>
                                                                                        <div className={style.Conditions}>
                                                                                            {
                                                                                                Object.entries(conditionsArray).map(([k, v]) => (
                                                                                                    <div className={style.Condition}>
                                                                                                        <div className={style.Checkbox}>
                                                                                                            <Checkbox.Root
                                                                                                                className={style.CheckboxRoot}
                                                                                                                checked={!!benefit.conditions[k]}
                                                                                                                onCheckedChange={() => toggleCondition(k)}
                                                                                                                id={k}
                                                                                                                name={k}
                                                                                                            >
                                                                                                                <Checkbox.Indicator className={style.CheckboxIndicator}>
                                                                                                                    <CheckIcon width={16} height={16} />
                                                                                                                </Checkbox.Indicator>
                                                                                                            </Checkbox.Root>
                                                                                                            
                                                                                                            <label htmlFor={k}>{v.label}</label>
                                                                                                        </div>
                                                                                                        {
                                                                                                            v.type === 'date' && (
                                                                                                                <DatePicker />
                                                                                                            )
                                                                                                        }
                                                                                                        {
                                                                                                            k === 'appliesTo' && (
                                                                                                                <SelectMenu options={appliesToOptions} value={benefit.conditions.appliesTo ?? ''} onChange={handleChangeType} />
                                                                                                            )
                                                                                                        }
                                                                                                        {
                                                                                                            k === 'maxUsesPerMonth' || k === 'durationDays' && (
                                                                                                                <>
                                                                                                                    { console.log(benefit.conditions[k]) }
                                                                                                                    <input type={v.type} value={benefit.conditions[k] ?? ''} className={style.Input} />
                                                                                                                </>
                                                                                                            )
                                                                                                        }
                                                                                                    </div>
                                                                                                ))
                                                                                            }
                                                                                        </div>
                                                                                    </section>
                                                                                </div>
                                                                            </div>
                                                                        )
                                                                    }
                                                                </div>
                                                            )
                                                        })
                                                    }
                                                </div>
                                            </div>

                                            
                                        </div>
                                    ))
                                }
                            </div>
                        </div>
                    </div>
                ) : (
                    <div>Você não vai achar nada aqui...</div>
                )
            }
        </div>
    )
}

export default AdminPlans;