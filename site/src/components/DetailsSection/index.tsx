import { ReactNode } from 'react';
import style from './DetailsSection.module.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IconProp } from '@fortawesome/fontawesome-svg-core';

interface Detail {
    label: string,
    value: string | number | ReactNode,
    icon?: string | ReactNode
}

interface DetailsSectionProps {
    details: Detail[],
    className?: string
}

const DetailsSection:React.FC<DetailsSectionProps> = ({ details, className }) => {
    return (
        <div className={`${style.Container} ${className ? className : ''}`}>
            {
                details.map((detail, idx) => (
                    <span key={idx} className={style.Detail}>
                        <p className={style.DetailLabel}>
                            {detail.icon && (
                                typeof detail.icon === 'string' ? <FontAwesomeIcon icon={detail.icon as IconProp} /> : detail.icon
                            )}
                            {detail.label}
                        </p> 
                        <p className={style.DetailValue}>{detail.value}</p>
                    </span>
                ))
            }
        </div>
    )
}

export default DetailsSection;