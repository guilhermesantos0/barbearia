import { useEffect, useState } from 'react';
import style from './CostumerPremium.module.scss';

// @ts-ignore
import { IUser } from '@types/User';
// @ts-ignore
import api from '../../../../services/api';
// @ts-ignore
import { IPremium } from '@types/Premium';
import PremiumCard from '@components/PremiumCard';
// @ts-ignore
import { formatDay } from '@utils/formatDay';

const CostumerPremium = () => {
    const [user, setUser] = useState<IUser | null>(null);
    const [sortedPremiums, setSortedPremiums] = useState<IPremium[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const userResult = await api.get('/users/premium');
                setUser(userResult.data);

                console.log(userResult)

                const premiumResult = await api.get('/premiumtiers');
                const sorted = [...premiumResult.data].sort((a, b) => a.position - b.position);
                setSortedPremiums(sorted);
            } catch (err) {
                console.error('Erro ao carregar dados', err);
            }
        };

        fetchData();
    }, []);

    return (
        <div className={style.Container}>
            {user?.premium?.tier === 0 ? (
                <div className={style.PageContent}>
                    <h1>Planos de Assinatura</h1>
                    <p className={style.Subtitle}>
                        Escolha o plano que mais combina com você e aproveite benefícios exclusivos.
                    </p>

                    <div className={style.Plans}>
                        {sortedPremiums.map((premium) => {

                            return (
                                <div key={premium._id} className={style.CardWrapper}>
                                    <PremiumCard data={premium} />
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
                            <h3>Membro {user?.premium?.plan.name}</h3>
                        </div>
                        <div className={style.RightContent}>
                            <p>Ativo até</p>
                            <p>{formatDay(new Date(user?.premium?.expireAt))}</p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CostumerPremium;
