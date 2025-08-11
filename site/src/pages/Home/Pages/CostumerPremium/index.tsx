import { useEffect, useState } from 'react';
import style from './CostumerPremium.module.scss';

// @ts-ignore
import { IUser } from '@types/User';
// @ts-ignore
import api from '../../../../services/api';
// @ts-ignore
import { IPremium } from '@types/Premium';
import PremiumCard from '@components/PremiumCard';

const CostumerPremium = () => {
    const [user, setUser] = useState<IUser | null>(null);
    const [sortedPremiums, setSortedPremiums] = useState<IPremium[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const userResult = await api.get('/users/me');
                setUser(userResult.data);

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
                    <p>🎉 Parabéns pelo seu plano! Em breve você verá a página exclusiva para assinantes.</p>
                </div>
            )}
        </div>
    );
};

export default CostumerPremium;
