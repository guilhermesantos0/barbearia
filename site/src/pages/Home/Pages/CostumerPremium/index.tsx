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

const CostumerPlan = () => {
    const [user, setUser] = useState<any | null>(null);
    const [sortedPlans, setSortedPlans] = useState<IPlan[]>([]);

    const [hasPremiumSignature, setHasPremiumSignature] = useState<boolean>(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const userResult = await api.get('/users/plan');
                setUser(userResult.data);

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
                            user.planId.benefits.map((benefit) => (
                                <div className={style.Benefit}>
                                    <FontAwesomeIcon icon{{
                                        'free_service': 'clock' as IconProp
                                    }[benefit.type] } />
                                </div>
                            ))
                        }
                    </div>
                </div>
            ) : (
                <div className={style.PageContent}>
                    <h1>Planos de Assinatura</h1>
                    <p className={style.Subtitle}>
                        Escolha o plano que mais combina com você e aproveite benefícios exclusivos.
                    </p>

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
