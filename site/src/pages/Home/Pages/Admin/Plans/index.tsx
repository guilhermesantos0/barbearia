import { useUser } from '@contexts/UserContext';
import style from './Plans.module.scss';
import { useEffect, useState } from 'react';
// @ts-ignore
import api from '@services/api';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// @ts-ignore
import { IPlan, IBenefit } from '@types/Plan';

import AdminPlan from '@components/AdminPlan';

interface ConditionValue {
    type: string,
    label: string
}

interface BenefitConditions {
    appliesTo?: string;
    maxUsesPerMonth?: number;
    expiresAt?: string;
    durationDays?: number;
}

const AdminPlans = () => {
    
    const { user } = useUser();
    const [isAllowed, setIsAllowed] = useState<boolean>(false);
    const queryClient = useQueryClient();

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
            plan.benefits.forEach((benefit: IBenefit) => {
                console.log(`${plan.name}_${benefit.label} - ${JSON.stringify(benefit.conditions)}`)
            })
        })
    }, [premiumPlans])

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

    const conditionsArray: Record<string, ConditionValue> = {
        appliesTo: { type: 'string', label: 'Aplica Para:' },
        maxUsesPerMonth: { type: 'number', label: 'Usos /mês' },
        expiresAt: { type: 'date', label: 'Expira em' },
        durationDays: { type: 'number', label: 'Duração (dias)' }
    };

    const handleChangeType = (value: string | undefined) => {
        console.log('Type changed to:', value);
    }

    const handleConditionChange = async (planId: string, benefitId: string, key: keyof BenefitConditions, value: any) => {
        try {
            const response = await api.patch(`/plans/${planId}/benefits/${benefitId}/conditions`, {
                [key]: value
            });
            if (response.status === 200) {
                queryClient.invalidateQueries(['premiumplans', user?.sub]);
            }
        } catch (error) {
            console.error('Error updating condition:', error);
        }
    }

    return (
        <div className={style.Container}>
            {
                isAllowed ? (
                    <div className={style.PageContent}>
                        <h1>Planos de Assinatura</h1>
                        <div className={style.DisplayContent}>
                            <div className={style.TopOptions}>
                                <input type="text" className={style.SearchBox} value={searchValue} placeholder='Pesquise por um plano...' onChange={(e) => setSearchValue(e.target.value)} />
                                <button className={style.AddPlan}><FontAwesomeIcon icon='plus' /> Adicionar Plano</button>
                            </div>
                            <div className={style.Plans}>
                                {
                                    premiumPlans && premiumPlans.length > 0 && premiumPlans.map((plan) => (
                                        <AdminPlan plan={plan} key={plan._id} />
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