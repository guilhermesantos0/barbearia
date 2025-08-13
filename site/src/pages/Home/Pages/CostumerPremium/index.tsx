import { useEffect, useState } from 'react';
import style from './CostumerPlan.module.scss';

// @ts-ignore
import { IUser } from '@types/User';
// @ts-ignore
import api from '../../../../services/api';
// @ts-ignore
import { IPlan } from '@types/Plan';
import PlanCard from '@components/PlanCard';
// @ts-ignore
import { formatDay } from '@utils/formatDay';

const CostumerPlan = () => {
    const [user, setUser] = useState<IUser | null>(null);
    const [sortedPlans, setSortedPlans] = useState<IPlan[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const userResult = await api.get('/users/plan');
                setUser(userResult.data);

                console.log(userResult)

                const planResult = await api.get('/plantiers');
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
            {user?.plan?.tier === 0 ? (
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
            ) : (
                <div className={style.PageContent}>
                    <div className={style.Header}>
                        <div className={style.LeftContent}>
                            <h2>Bem vindo, {user?.name}</h2>
                            <h3>Membro {user?.plan?.plan.name}</h3>
                        </div>
                        <div className={style.RightContent}>
                            <p>Ativo até</p>
                            <p>{formatDay(new Date(user?.plan?.expireAt))}</p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CostumerPlan;
