import { useLocation } from 'react-router-dom';
import style from './Success.module.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// @ts-ignore
import { formatPrice } from '@utils/formatPrice';

interface LocationState {
    type: 'service' | 'premium',
    finalPrice: number,
    paymentMethod: string,
    planName?: string,
    totalPrice?: number,
    discount?: number,
    service?: {
        title: string,
        barber: string,
        dateTime: string
    }
}

const Success = () => {
    const location = useLocation();
    const state = location.state as LocationState;

    const paymentMethodLables: Record<string, string> = {
        'pix': 'Pix',
        'card': 'Cartão',
        'credit': 'Cartão de Crédito',
        'debit': 'Cartão de Débito'
    }

    return (
        <div className={style.Container}>
            <div className={style.PageContent}>
                <FontAwesomeIcon icon="check-circle" className={style.Icon} />

                <h2 className={style.Title}>Pagamento Confirmado!</h2>
                <p className={style.Subtitle}>
                    Obrigado por confiar na BarberPrime
                </p>

                <div className={style.ShopDetails}>
                    <h3 className={style.SectionTitle}>Detalhes do Pedido</h3>
                    
                    {state.type === 'premium' && (
                        <div className={style.Details}>
                            <span className={style.Detail}><p className={style.DetailLabel}>Plano:</p> <p className={style.DetailValue}>{state.planName}</p></span>
                            <span className={style.Detail}><p className={style.DetailLabel}>Total:</p> R$ {state.totalPrice?.toFixed(2)}</span>
                            {state.discount && (
                                <span className={style.Detail}><strong>Desconto:</strong> - R$ {state.discount.toFixed(2)}</span>
                            )}
                        </div>
                    )}

                    {state.type === 'service' && state.service && (
                        <div className={style.Details}>
                            <span className={style.Detail}><p className={style.DetailLabel}>Serviço:</p> <p className={style.DetailValue}>{state.service.title}</p></span>
                            <span className={style.Detail}><p className={style.DetailLabel}>Barbeiro:</p> <p className={style.DetailValue}>{state.service.barber}</p></span>
                            <span className={style.Detail}><p className={style.DetailLabel}>Data e Hora:</p> <p className={style.DetailValue}>{state.service.dateTime}</p></span>
                        </div>
                    )}

                    <div className={style.Details}>
                        <span className={style.Detail}><p className={style.DetailLabel}>Método de Pagamento:</p> <p className={style.DetailValue}>{paymentMethodLables[state.paymentMethod]}</p></span>
                        <span className={style.Detail}><p className={style.DetailLabel}>Valor Final:</p> <p className={style.DetailValue}>{formatPrice(state.finalPrice)}</p></span>
                    </div>
                </div>

                <button 
                    className={style.BackButton}
                    onClick={() => window.location.href = '/home/cliente/agendamentos'}
                >
                    Voltar para Início
                </button>
            </div>
        </div>
    )
}

export default Success;
