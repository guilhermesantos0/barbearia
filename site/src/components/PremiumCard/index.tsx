// @ts-ignore
import { IPremium } from "@types/Premium";

import style from './PremiumCard.module.scss';
import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { formatPrice } from "@utils/formatPrice";

interface PremiumCardProps {
    data: IPremium
}

const PremiumCard: React.FC<PremiumCardProps> = ({ data }) => {

    const [sortedPremiumBenefits, setSortedPremiumBenefits] = useState();

    useEffect(() => {
        if (!data.benefits) return;

        const sortedBenefits = [...data.benefits].sort((a, b) => a.pos - b.pos);
        setSortedPremiumBenefits(sortedBenefits)
    }, [data])

    return (
        <div className={style.Container}>
            <p className={style.Title}>{data.name}</p>
            <p className={style.Price}>{formatPrice(data.price)}</p>
            <p className={style.Description}>{data.description}</p>
            <div className={style.Benefits}>
                {
                    sortedPremiumBenefits && sortedPremiumBenefits.map((benefit) => (
                        <div className={style.Benefit}><FontAwesomeIcon icon={['far', 'circle-check']} className={style.Icon} />{benefit.description}</div>
                    ))
                }
            </div>
            <div className={style.ButtonContainer}>
                <button className={style.Button}>Assinar</button>
            </div>
        </div> 
    )
}

export default PremiumCard