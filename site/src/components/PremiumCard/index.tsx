// @ts-ignore
import { IBenefit, IPlan } from "@types/Plan";

import style from './PremiumCard.module.scss';
import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

// @ts-ignore
import { formatPrice } from "@utils/formatPrice";

interface PlanCardProps {
    data: IPlan
}

const PlanCard: React.FC<PlanCardProps> = ({ data }) => {

    const [sortedPlanBenefits, setSortedPlanBenefits] = useState<IBenefit[]>();

    useEffect(() => {
        if (!data.benefits) return;

        const sortedBenefits = [...data.benefits].sort((a, b) => a.position - b.position);
        setSortedPlanBenefits(sortedBenefits)
    }, [data])

    return (
        <div className={style.Container}>
            <p className={style.Title}>{data.name}</p>
            <p className={style.Price}>{formatPrice(data.price)}</p>
            <p className={style.Description}>{data.description}</p>
            <div className={style.Benefits}>
                {
                    sortedPlanBenefits && sortedPlanBenefits.map((benefit) => (
                        <div className={style.Benefit}><FontAwesomeIcon icon={['far', 'circle-check']} className={style.Icon} />{benefit.label}</div>
                    ))
                }
            </div>
            <div className={style.ButtonContainer}>
                <button className={style.Button}>Assinar</button>
            </div>
        </div> 
    )
}

export default PlanCard