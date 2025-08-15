import { useEffect, useState } from 'react';
import style from './CostumerPremium.module.scss';

// @ts-ignore
import { IUser } from '@types/User';
// @ts-ignore
import api from '../../../../services/api';
// @ts-ignore
import { IPlan, IBenefit } from '@types/Plan';
import PlanCard from '@components/PremiumCard';
// @ts-ignore
import { formatDay } from '@utils/formatDay';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IconProp } from '@fortawesome/fontawesome-svg-core';

import PercentageIcon from '@assets/icons/percentage.svg?react';
import PumpSoapIcon from '@assets/icons/pump-soap.svg?react';
// @ts-ignore
import { IScheduledService } from '@types/ScheduledService';

const CostumerPlan = () => {
    const [user, setUser] = useState<any | null>(null);
    const [sortedPlans, setSortedPlans] = useState<IPlan[]>([]);
    const [userHistory, setUserHistory] = useState<IScheduledService[]>([]);

    const [hasPremiumSignature, setHasPremiumSignature] = useState<boolean>(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const userResult = await api.get('/users/plan');
                setUser(userResult.data);

                const userHistoryResult = await api.get('/users/history');
                setUserHistory(userHistoryResult.data)

                const planResult = await api.get('/plans');
                const sorted = [...planResult.data].sort((a, b) => a.position - b.position);
                setSortedPlans(sorted);
            } catch (err) {
                console.error('Erro ao carregar dados', err);
            }
        };

        fetchData();
    }, []);

    return (
        <div className={style.Container}>
            {user ? (
                <div className={style.PageContent}>
                    <div className={style.Header}>
                        <div className={style.LeftContent}>
                            <h2>Bem vindo, {user.userId.name}</h2>
                            <h3>Membro {user.planId.name}</h3>
                        </div>
                        <div className={style.RightContent}>
                            <p>Ativo até</p>
                            <p>{formatDay(new Date(user.endDate))}</p>
                        </div>
                    </div>
                    <div className={style.Benefits}>
                        {
                            user.planId.benefits.map((benefit: IBenefit) => (
                                <div className={style.Benefit}>
                                    <FontAwesomeIcon 
                                        icon={{
                                            'fixed_value': 'dollar-sign' as IconProp,
                                            'free_service': 'scissors' as IconProp,
                                            'free_courtesy': 'gift' as IconProp,
                                            'free_extra_service': 'star' as IconProp,
                                            'other_plan_benefits' : 'medal' as IconProp,
                                            'free_barbershop_products': 'pump-soap' as IconProp
                                        }[benefit.type] || 'question'}
                                    />

                                    {
                                        benefit.type === 'percentage' && <PercentageIcon />
                                    }
                                    
                                    <p>{benefit.label}</p>
                                </div>
                            ))
                        }
                    </div>
                    <div className={style.GridSection}>
                        <div className={style.QuickActions}>
                            <h2 className={style.QuickActionsTitle}>Ações Rápidas</h2>
                            <div className={style.QuickActionCard}>
                                <FontAwesomeIcon icon='calendar' className={style.QuickActionCardIcon} />
                                <h3 className={style.QuickActionCardTitle}>Agendar Serviço</h3>
                                <h5 className={style.QuickActionCardSubtitle}>Agende seu próximo serviço com seus benefícios exclusivos!</h5>
                            </div>
                            <div className={style.QuickActionCard}>
                                <FontAwesomeIcon icon='people' className={style.QuickActionCardIcon} />
                                <h3 className={style.QuickActionCardTitle}>Nossos Profissionais</h3>
                                <h5 className={style.QuickActionCardSubtitle}>Veja nossos profissionais!</h5>
                            </div>
                        </div>
                        <div>
                            <h2>Ações Recentes</h2>
                        </div>
                    </div>
                </div>
            ) : (
                <div className={style.PageContent}>
                    <h1>Planos de Assinatura</h1>

                    <div className={style.Plans}>
                        {sortedPlans.map((plan) => {

                            return (
                                <div key={plan._id} className={style.CardWrapper}>
                                    <PlanCard data={plan} />
                                </div>
                            );
                        })}
                    </div>
                </div>
                
            )}
        </div>
    );
};

export default CostumerPlan;
