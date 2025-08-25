import { useEffect, useState } from 'react';
import style from './Checkout.module.scss';
// @ts-ignore
import { formatPrice } from '@utils/formatPrice';
// @ts-ignore
import { useCheckoutStore } from '@store/checkoutStore';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import PixIcon from '@assets/icons/pix.svg?react';

const Checkout = () => {
    const { price, product, discount, type, clearCheckout } = useCheckoutStore();

    if (!price || !product || !discount || !type || !clearCheckout) return <div>deu pau aqui</div>

    const [finalPrice, setFinalPrice] = useState<number>(price);
    const [discountApplied, setDiscountApplied] = useState<number>(0);

    const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<'pix' | 'card' | 'credit' | 'debit'>('pix')

    const [qrCode, setQrCode] = useState<string | null>(null);

    useEffect(() => {
        if (discount) {
            const multiplier = discount / 100;
            const discountValueApplied = price * multiplier;

            const newPrice = price - discountValueApplied;

            setDiscountApplied(discountValueApplied)
            setFinalPrice(newPrice);
        }
    },[discount])

    const typeLabels:Record<string, string> = {
        'appointment': 'do Agendamento',
        'subscription': 'da Inscrição'
    }

    const handleGenerateQRCode = () => {
        setQrCode("https://codigosdebarrasbrasil.com.br/wp-content/uploads/2019/09/codigo_qr-300x300.png");
    }

    return(
        <div className={style.Container}>
            <div className={style.PageContent}>
                <div className={style.LeftArea}>
                    <div className={style.TopContent}>
                        <h3>Detalhes {typeLabels[type]}</h3>
                        {
                            type === "appointment" && (
                                <>
                                    <div className={style.BarberData}>
                                        <img src={product.data.barber.profilePic} alt="" />
                                        <div className={style.BarberDetails}>
                                            <p className={style.BarberName}>{product.data.barber.name}</p>
                                            <p className={style.BarberRating}><FontAwesomeIcon icon="star" />{product.data.barber.rate}</p>
                                        </div>
                                    </div>
                                    <div className={style.DivisorLine}></div>
                                    <div className={style.Details}>
                                        <span className={style.Detail}><p className={style.DetailLabel}>Serviço</p><p className={style.DetailValue}>{product.name}</p></span>
                                        <span className={style.Detail}><p className={style.DetailLabel}>Data</p><p className={style.DetailValue}>{product.data?.date}</p></span>
                                        <span className={style.Detail}><p className={style.DetailLabel}>Horário</p><p className={style.DetailValue}>{product.data?.time}</p></span>
                                        <span className={style.Detail}><p className={style.DetailLabel}>Duração</p><p className={style.DetailValue}>{product.data?.duration}</p></span>
                                    </div>
                                </>
                            )
                        }
                    </div>
                    <div className={style.BottomContent}>
                        <h3>Detalhes do Pagamento</h3>
                        <div className={style.Details}>
                            <span className={style.Detail}><p className={style.DetailLabel}>Preço Total</p><p className={style.DetailValue}>{formatPrice(price)}</p></span>
                            <span className={style.Detail}><p className={style.DetailLabel}>Desconto Aplicado</p><p className={style.DetailValue}><span className={style.DiscountPercentage}>{discount}%</span><span className={style.DiscountValue}>- {formatPrice(discountApplied)}</span></p></span>
                            <div className={style.DivisorLine}></div>
                            <span className={`${style.Detail} ${style.FinalPrice}`}><p className={style.DetailLabel}>Preço Final</p><p className={style.DetailValue}>{formatPrice(finalPrice)}</p></span>
                        </div>   
                    </div>
                </div>
                <div className={style.RightArea}>
                    <h3>Método de Pagamento</h3>
                    <div className={style.PaymentMethods}>
                        <label className={`${style.PaymentMethod} ${selectedPaymentMethod === 'pix' ? style.Selected : ''}`}>
                            <div className={style.PaymentMethodDetails}>
                                <div className={style.IconContainer}>
                                    <PixIcon className={style.Icon} />
                                </div>
                                <div className={style.Text}>
                                    <h4 className={style.Title}>PIX</h4>
                                    <p>Pagamento instantâneo via PIX</p>
                                </div>
                            </div>
                            <input 
                                type="radio" 
                                name="payment"
                                value="pix"
                                checked={selectedPaymentMethod === 'pix'}
                                onChange={() => setSelectedPaymentMethod('pix')}
                                className={style.HiddenInput}
                            />
                        </label>

                        <label className={`${style.PaymentMethod} ${selectedPaymentMethod === 'card' ? style.Selected : ''}`}>
                            <div className={style.PaymentMethodDetails}>
                                <div className={style.IconContainer}>
                                    <FontAwesomeIcon icon={['far', "credit-card"]} className={style.Icon} />
                                </div>
                                <div className={style.Text}>
                                    <h4 className={style.Title}>Cartão de Crédito/Débito</h4>
                                    <p>Pague com Visa, Mastercard ou Elo</p>
                                </div>
                            </div>
                            <input 
                                type="radio"
                                name="payment"
                                value="card"
                                checked={selectedPaymentMethod === 'card'} 
                                onChange={() => setSelectedPaymentMethod('card')}
                                className={style.HiddenInput}
                            />
                        </label>
                    </div>
                    <div className={style.PaymentMethodArea}>
                        {
                            selectedPaymentMethod === 'pix' && (
                                <div className={style.PixContainer}>
                                    {
                                        qrCode ? (
                                            <>
                                                <img className={style.QrCode} src={qrCode} alt="" />
                                                <button className={style.QrCodeButton}>Copiar QR Code</button>
                                            </>
                                        ) : (
                                            <button className={style.QrCodeButton} onClick={handleGenerateQRCode}>Gerar QR Code</button>
                                        )
                                    }
                                </div>
                            )
                        }
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