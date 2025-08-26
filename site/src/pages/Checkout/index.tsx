import { useEffect, useState } from 'react';
import style from './Checkout.module.scss';
// @ts-ignore
import { formatPrice } from '@utils/formatPrice';
// @ts-ignore
import { useCheckoutStore } from '@store/checkoutStore';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import PixIcon from '@assets/icons/pix.svg?react';
import { IconProp } from '@fortawesome/fontawesome-svg-core';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';

const Checkout = () => {
    const navigate = useNavigate();
    const { price, product, discount, type, userId, clearCheckout } = useCheckoutStore();

    if (!price || !product || !discount || !type || !userId || !clearCheckout) return <div>deu pau aqui</div>

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

    const __Test__handleCompletePayment = async () => {

        const scheduledServicePayload = {
            costumer: userId,
            barber: product.data.barber.id,
            service: product.data.id,
            date: product.data.rawDateTime,
            discountApplied: discount
        }

        console.log(scheduledServicePayload)
        const createdAppointment = await api.post('/scheduledservices', scheduledServicePayload);
        console.log(createdAppointment);

        navigate('/agendar-servico/pagamento/sucesso', { state: {
            "type": 'service',
            "finalPrice": finalPrice,
            "paymentMethod": selectedPaymentMethod,
            "planName": "Teste Ainda",
            "totalPrice": price,
            "discount": discount,
            "service": {
                "title": product.name,
                "barber": product.data.barber.name,
                "dateTime": `${product.data.date} às ${product.data.time}`
            }
        } })
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
                                className={style.CustomRadio}
                            />
                        </label>

                        <label className={`${style.PaymentMethod} ${(selectedPaymentMethod === 'card' || selectedPaymentMethod === 'credit' || selectedPaymentMethod === 'debit') ? style.Selected : ''}`}>
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
                                checked={(selectedPaymentMethod === 'card' || selectedPaymentMethod === 'credit' || selectedPaymentMethod === 'debit')} 
                                onChange={() => setSelectedPaymentMethod('card')}
                                className={style.CustomRadio}
                            />
                        </label>
                    </div>
                    <div className={style.DivisorLine}></div>
                    <div className={style.PaymentMethodArea}>
                        {
                            selectedPaymentMethod === 'pix' && (
                                <div className={style.PixContainer}>
                                    {
                                        qrCode ? (
                                            <div className={style.QrCodeContainer}>
                                                <img className={style.QrCode} src={qrCode} alt="" />
                                            </div>
                                        ) : (
                                            <button className={style.QrCodeButton} onClick={handleGenerateQRCode}>Gerar QR Code</button>
                                        )
                                    }
                                </div>
                            )
                        }
                        {
                            (selectedPaymentMethod === 'card' || selectedPaymentMethod === 'credit' || selectedPaymentMethod === 'debit') && (
                                <div className={style.CardContainer}>
                                    <div className={`${style.CardTypeSelector} ${selectedPaymentMethod === 'debit' ? style.debit : ''}`}>
                                        <span className={style.CardType} onClick={() => setSelectedPaymentMethod('credit')}> Crédito </span>
                                        <span className={style.CardType} onClick={() => setSelectedPaymentMethod('debit')}> Débito </span>
                                    </div>
                                    <div className={style.CardInfosInputs}>
                                        <div className={`${style.InputContainer} ${style.CardNumberGridArea}`}>
                                            <label className={style.Label} htmlFor="cardNumber">Número do Cartão</label>
                                            <input className={style.Input} type="text" name="cardNumber" />
                                        </div>
                                        <div className={`${style.InputContainer} ${style.CardNameGridArea}`}>
                                            <label className={style.Label} htmlFor="cardName">Nome do Titular</label>
                                            <input className={style.Input} type="text" name="cardName" />
                                        </div>
                                        <div className={`${style.InputContainer} ${style.CardExpDateGridArea}`}>
                                            <label className={style.Label} htmlFor="expireDate">Validade</label>
                                            <input className={style.Input} type="text" name='expireDate' />
                                        </div>
                                        <div className={`${style.InputContainer} ${style.CardCVVGridArea}`}>
                                            <label className={style.Label} htmlFor="cvv">CVV</label>
                                            <input className={style.Input} type="text" name="cvv" />
                                        </div>
                                        <div className={`${style.InputContainer} ${style.CardCPFGridArea}`}>
                                            <label className={style.Label} htmlFor="cpf">CPF do Proprietário</label>
                                            <input className={style.Input} type="text" name='cpf' />
                                        </div>
                                    </div>
                                </div>
                            )
                        }
                    </div>
                    <div className={style.ButtonsContainer}>
                        <button className={`${style.Button} ${style.PayButton}`} disabled={selectedPaymentMethod === 'pix' && !qrCode} onClick={__Test__handleCompletePayment}><FontAwesomeIcon icon={{'pix': 'copy' as IconProp}[selectedPaymentMethod] || 'lock'} />{ selectedPaymentMethod === 'pix' ? 'Copiar Código' : 'Finalizar Pagamento' }</button>
                        <button className={`${style.Button} ${style.CancelButton}`}>Cancelar</button>
                    </div>
                    <div className={style.Security}>
                        <FontAwesomeIcon icon="shield-halved" className={style.Icon} />
                        <div className={style.SecurityText}>
                            <p className={style.Title}>Pagamento seguro</p>
                            <p className={style.Text}>As informações de pagamento são totalmente criptografadas e seguras</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Checkout;