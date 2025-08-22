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

// @ts-ignore
import { IScheduledService } from '@types/ScheduledService';
// @ts-ignore
import { formatDate } from '@utils/formatDate';
// @ts-ignore
import { formatDayNumbers } from '@utils/formatDayNumbers';

import Carousel from '@components/Carousel';
// @ts-ignore
import { formatPrice } from '@utils/formatPrice';
import { Link } from 'react-router-dom';

interface IResult {
    _id: string,
    userId: IUser,
    planId: IPlan,
    startDate: Date,
    nextBillingDate: Date,
    endDate: Date,
    status: string,
    autoRenew: boolean
}

const CostumerPlan = () => {
    const [user, setUser] = useState<IResult | null>(null);
    const [sortedPlans, setSortedPlans] = useState<IPlan[]>([]);
    const [userHistory, setUserHistory] = useState<IScheduledService[]>([]);

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
                        <Carousel benefits={user.planId.benefits}  />
                    </div>
                    <div className={style.GridSection}>
                        <div className={style.QuickActions}>
                            <h2 className={style.QuickActionsTitle}>Ações Rápidas</h2>
                            <div className={style.QuickActionsCardsContainer}>
                                <Link to='/agendar-servico' className={style.QuickActionCard} >
                                    <FontAwesomeIcon icon='calendar' className={style.QuickActionCardIcon} />
                                    <h3 className={style.QuickActionCardTitle}>Agendar Serviço</h3>
                                    <h5 className={style.QuickActionCardSubtitle}>Agende seu próximo serviço com seus benefícios exclusivos!</h5>
                                </Link>
                                <div className={style.QuickActionCard}>
                                    <FontAwesomeIcon icon='clock' className={style.QuickActionCardIcon} />
                                    <h3 className={style.QuickActionCardTitle}>Nossos Profissionais</h3>
                                    <h5 className={style.QuickActionCardSubtitle}>Veja nossos profissionais!</h5>
                                </div>
                            </div>
                        </div>
                        <div className={style.RecentActions}>
                            <h2 className={style.RecentActionsTitle}>Ações Recentes</h2>
                            <div className={style.UserHistory}>
                                {
                                    userHistory && userHistory.map((scheduledService) => (
                                        <div className={style.HistotryService}>
                                            <div className={style.LeftContent}>
                                                <img src={scheduledService.barber.profilePic} alt={scheduledService.barber.name} className={style.BarberProfilePic} />
                                                <div className={style.TextArea}>
                                                    <div className={style.ServiceDetails}>
                                                        <h3 className={style.ServiceTitle}>{scheduledService.service.name}</h3>
                                                        <h4 className={style.ServiceDescription}>com {scheduledService.barber.name} &#8226; {formatDate(scheduledService.date)}</h4>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className={style.RightContent}>
                                                <span className={style.DiscountApplied} >{scheduledService.discountApplied}% OFF</span>
                                                <FontAwesomeIcon icon='trash' className={style.Trash} />
                                            </div>
                                        </div>
                                    ))
                                }
                            </div>
                        </div>
                        <div className={`${style.Dashboard} ${style.SideCard}`} >
                            <h3 className={style.SideCardTitle}>Painel de Assinatura</h3>
                            <div className={style.SideCardContent}>
                                <h3 className={style.SideCardContentTitle}>
                                    <span>Status da Assinatura </span>
                                    <FontAwesomeIcon icon={{
                                        'active': 'crown' as IconProp,
                                        'paused': 'pause' as IconProp
                                    }[user.status] || 'question'}
                                    className={style.Icon} />
                                </h3>
                                <div className={style.SideCardDetails}>
                                    <span className={style.Detail} ><p className={style.DetailLabel}>Plano</p><p className={style.DetailValue}>{user.planId.name}</p></span>
                                    <span className={style.Detail}><p className={style.DetailLabel}>Próximo Pagamento</p><p className={style.DetailValue}>{formatDayNumbers(user.nextBillingDate)}</p></span>
                                    <span className={style.Detail}><p className={style.DetailLabel}>Preço</p><p className={style.DetailValue}>{formatPrice(user.planId.price)}</p></span>
                                </div>

                                <button className={style.Button}>Alterar Plano</button>
                            </div>
                        </div>
                        <div className={`${style.MonthSaving} ${style.SideCard}`}>
                            <div className={style.SideCardContent}>
                                <h3 className={style.SideCardContentTitle}>Esse mês</h3>
                                <div className={style.SideCardDetails}>
                                    <span className={style.Detail}><p className={style.DetailLabel}>Serviços Agendados</p><p className={style.DetailValue}>12</p></span>
                                    <span className={style.Detail}><p className={style.DetailLabel}>Valor Economizado</p><p className={style.DetailValue}>12.00</p></span>
                                    <span className={style.Detail}><p className={style.DetailLabel}>Valor Pago</p><p className={style.DetailValue}>230.00</p></span>
                                </div>
                            </div>
                        </div>
                        <div className={`${style.AccountInformation} ${style.SideCard}`}>
                            <div className={style.SideCardContent}>
                                <h3 className={style.SideCardContentTitle}>Informações da Conta</h3>
                                <div className={style.SideCardDetails}>
                                    <span className={style.Detail}><p className={style.DetailLabel}>Membro desde</p><p className={style.DetailValue}>{formatDayNumbers(user.userId.createdAt)}</p></span>
                                    <span className={style.Detail}><p className={style.DetailLabel}>Primeiro serviço</p><p className={style.DetailValue}>{formatDayNumbers(user.userId.updatedAt)}</p></span>
                                    <span className={style.Detail}><p className={style.DetailLabel}>Total de serviços</p><p className={style.DetailValue}>121</p></span>
                                    <span className={style.Detail}><p className={style.DetailLabel}>Serviço mais agendado</p><p className={style.DetailValue}>Corte Degradê</p></span>
                                </div>
                            </div>
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
