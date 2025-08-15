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
// @ts-ignore
import { IScheduledService } from '@types/ScheduledService';
import { formatDate } from '@utils/formatDate';
import { formatDayNumbers } from '@utils/formatDayNumbers';

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
                console.log(userHistoryResult)
                setUserHistory(userHistoryResult.data.history)

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
                            <h2 className={style.Welcome}>Bem vindo, {user.userId.name}</h2>
                            <h3 className={style.UserPlan}>Membro {user.planId.name}</h3>
                        </div>
                        <div className={style.RightContent}>
                            <p className={style.Label}>Ativo até</p>
                            <p className={style.Value}>{formatDay(new Date(user.endDate))}</p>
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
                                <FontAwesomeIcon icon='clock' className={style.QuickActionCardIcon} />
                                <h3 className={style.QuickActionCardTitle}>Nossos Profissionais</h3>
                                <h5 className={style.QuickActionCardSubtitle}>Veja nossos profissionais!</h5>
                            </div>
                        </div>
                        <div className={style.RecentActions}>
                            <h2>Ações Recentes</h2>
                            {
                                userHistory && userHistory.map((scheduledService) => (
                                    <div className={style.HistotryService}>
                                        <div className={style.LeftContent}>
                                            <img src={scheduledService.barber.profilePic} alt={scheduledService.barber.name} />
                                            <div className={style.ServiceDetails}>
                                                <h3>{scheduledService.service.name}</h3>
                                                com {scheduledService.barber.name} &#8226; {formatDate(scheduledService.date)}
                                            </div>
                                        </div>
                                        <div className={style.RightContent}>
                                            <span>{scheduledService.discountApplied}% OFF</span>
                                            <FontAwesomeIcon icon='trash' />
                                        </div>
                                    </div>
                                ))
                            }
                        </div>
                        <div className={style.Dashboard} >
                            <h3>Painel de Assinatura</h3>
                            <div className={style.DashboardContent}>
                                <h3>Status da Assinatura</h3>
                                <FontAwesomeIcon icon={{
                                    'active': 'crown' as IconProp,
                                    'paused': 'pause' as IconProp
                                }[user.status]} />
                            </div>
                        </div>
                        <div className={style.MonthSaving}>
                            <h3>Esse mês</h3>
                            <div className={style.MonthSavingContent}>
                                <span><p>Serviços Agendados</p><p>12</p></span>
                                <span><p>Valor Economizado</p><p>12.00</p></span>
                                <span><p>Valor Pago</p><p>230.00</p></span>
                            </div>
                        </div>
                        <div className={style.AccountInformation}>
                            <span><p>Membro desde</p><p>{formatDayNumbers(user.userId.createdAt)}</p></span>
                            <span><p>Primeiro serviço</p><p>{formatDayNumbers(user.userId.updatedAt)}</p></span>
                            <span><p>Total de serviços</p><p>121</p></span>
                            <span><p>Serviço mais agendado</p><p>Corte Degradê</p></span>
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
