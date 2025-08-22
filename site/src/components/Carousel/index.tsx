import "swiper/css";
import "swiper/css/navigation";

import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import PercentageIcon from "@assets/icons/percentage.svg?react";
import style from "./Carousel.module.scss";

// @ts-ignore
import { IBenefit } from "@types/Plan";
import { IconProp } from "@fortawesome/fontawesome-svg-core";

export default function Carousel({ benefits }: { benefits: IBenefit[] }) {
    return (
        <div className={style.CarouselContainer}>
            <Swiper
                modules={[Navigation]}
                spaceBetween={16}
                slidesPerView={4}
                // navigation
                className={style.Swiper}
            >
                {benefits.map((benefit, i) => (
                    <SwiperSlide key={i} className={style.Slide}>
                        <div className={style.Item}>
                            {benefit.type === "percentage" ? (
                                <PercentageIcon className={style.Icon} />
                            ) : (
                                <FontAwesomeIcon 
                                    icon={{
                                        'fixed_value': 'dollar-sign' as IconProp,
                                        'free_service': 'scissors' as IconProp,
                                        'free_courtesy': 'gift' as IconProp,
                                        'free_extra_service': 'star' as IconProp,
                                        'other_plan_benefits' : 'medal' as IconProp,
                                        'free_barbershop_products': 'pump-soap' as IconProp
                                    }[benefit.type] || 'question'}

                                    className={style.Icon}
                                />
                            )}
                            <p className={style.Label}>{benefit.label}</p>
                        </div>
                    </SwiperSlide>
                ))}
            </Swiper>
        </div>
    );
}
