import { useEffect, useState } from 'react';
import style from './Checkout.module.scss';
// @ts-ignore
import { formatPrice } from '@utils/formatPrice';
// @ts-ignore
import { useCheckoutStore } from '@store/checkoutStore';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const Checkout = () => {
    const { price, product, discount, type, clearCheckout } = useCheckoutStore();

    if (!price || !product || !discount || !type || !clearCheckout) return <div>deu pau aqui</div>

    const [finalPrice, setFinalPrice] = useState<number>(price);
    const [discountApplied, setDiscountApplied] = useState<number>(0);

    useEffect(() => {
        if (discount) {
            const multiplier = discount / 100;
            const discountValueApplied = price * multiplier;

            const newPrice = price - discountValueApplied;

            setDiscountApplied(discountValueApplied)
            setFinalPrice(newPrice);
            // const multiplier = 1 - (discount / 100);
            // const newPrice = price * multiplier;
        }
    },[discount])

    const typeLabels:Record<string, string> = {
        'appointment': 'do Agendamento',
        'subscription': 'da Inscrição'
    }

    return(
        <div className={style.Container}>
            <div className={style.PageContent}>
                <div className={style.LeftArea}>
                    <div className={style.TopContent}>
                        <h2>Detalhes {typeLabels[type]}</h2>
                        {
                            type === "appointment" && (
                                <div className={style.Details}>
                                    <span className={style.Detail}><p className={style.DetailLabel}>Serviço</p><p className={style.DetailValue}>{product.name}</p></span>
                                    <span className={style.Detail}><p className={style.DetailLabel}>Data</p><p className={style.DetailValue}>{product.data?.date}</p></span>
                                    <span className={style.Detail}><p className={style.DetailLabel}>Horário</p><p className={style.DetailValue}>{product.data?.time}</p></span>
                                    <span className={style.Detail}><p className={style.DetailLabel}>Duração</p><p className={style.DetailValue}>{product.data?.duration}</p></span>
                                </div>
                            )
                        }
                    </div>
                    <div className={style.BottomContent}>
                        <h2>Preço</h2>
                        <div className={style.Details}>
                            <span className={style.Detail}><p className={style.DetailLabel}>Preço Total</p><p className={style.DetailValue}>{formatPrice(price)}</p></span>
                            <span className={style.Detail}><p className={style.DetailLabel}>Desconto Aplicado</p><p className={style.DetailValue}><span className={style.DiscountPercentage}>{discount}%</span><span className={style.DiscountValue}>{formatPrice(discountApplied)}</span></p></span>
                            <div className={style.DivisorLine}></div>
                            <span className={style.Detail}><p className={style.DetailLabel}>Preço Final</p><p className={style.DetailValue}>{formatPrice(finalPrice)}</p></span>
                        </div>   
                    </div>
                </div>
                <div className={style.RightArea}>
                    <h2>Método de Pagamento</h2>
                    <div className={style.PaymentMethods}>
                        <div className={style.PaymentMethod}>
                            <div className={style.IconContainer}>
                                <FontAwesomeIcon icon="question" />
                                <div className={style.Text}>
                                    <h3 className={style.Title}>PIX</h3>
                                    <p>Pagamento instantâneo via PIX</p>
                                </div>
                            </div>
                        </div>

                        <div className={style.PaymentMethod}>
                            <div className={style.IconContainer}>
                                <FontAwesomeIcon icon={['far', "credit-card"]} />
                                <div className={style.Text}>
                                    <h3 className={style.Title}>Cartão de Crédito/Débito</h3>
                                    <p>Pague com Visa, Mastercard ou Elo</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className={style.PixQrCode}>
                    </div>
                    <div className={style.ButtonsContainer}>
                        <button><FontAwesomeIcon icon='lock' />Finalizar Pagamento</button>
                        <button>Cancelar</button>
                    </div>
                    <div className={style.Security}>
                        <FontAwesomeIcon icon="shield-halved" />
                        <div className={style.SecurityText}>
                            <h3>Pagamento seguro</h3>
                            <p>As informações de pagamento são totalmente criptografadas e seguras</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Checkout;