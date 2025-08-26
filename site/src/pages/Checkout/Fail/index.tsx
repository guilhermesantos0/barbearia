import { useLocation } from 'react-router-dom';
import style from './Failed.module.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
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
    },
    errorMessage?: string
}

const Failed = () => {
    const location = useLocation();
    const state = location.state as LocationState;

    const paymentMethodLabels: Record<string, string> = {
        'pix': 'Pix',
        'card': 'Cartão',
        'credit': 'Cartão de Crédito',
        'debit': 'Cartão de Débito'
    }

    return (
        <div className={style.Container}>
            <div className={style.PageContent}>
                <FontAwesomeIcon icon="times-circle" className={style.Icon} />

                <h2 className={style.Title}>Pagamento não concluído 😕</h2>
                <p className={style.Subtitle}>
                    Algo deu errado durante o processamento do seu pagamento.
                </p>

                <div className={style.ShopDetails}>
                    <h3 className={style.SectionTitle}>Detalhes da Tentativa</h3>
                    
                    {state.type === 'premium' && (
                        <div className={style.DetailBox}>
                            <p><strong>Plano:</strong> {state.planName}</p>
                            <p><strong>Total:</strong> R$ {state.totalPrice?.toFixed(2)}</p>
                            {state.discount && (
                                <p><strong>Desconto:</strong> - R$ {state.discount.toFixed(2)}</p>
                            )}
                        </div>
                    )}

                    {state.type === 'service' && state.service && (
                        <div className={style.DetailBox}>
                            <p><strong>Serviço:</strong> {state.service.title}</p>
                            <p><strong>Barbeiro:</strong> {state.service.barber}</p>
                            <p><strong>Data e Hora:</strong> {state.service.dateTime}</p>
                        </div>
                    )}

                    <div className={style.DetailBox}>
                        <p><strong>Método de Pagamento:</strong> {paymentMethodLabels[state.paymentMethod]}</p>
                        <p className={style.FinalPrice}>
                            <strong>Valor Final:</strong> {formatPrice(state.finalPrice)}
                        </p>
                    </div>

                    {state.errorMessage && (
                        <div className={style.ErrorBox}>
                            <p><strong>Erro:</strong> {state.errorMessage}</p>
                        </div>
                    )}
                </div>

                <div className={style.Buttons}>
                    <button 
                        className={style.RetryButton}
                        onClick={() => window.location.href = '/agendar-servico/pagamento'}
                    >
                        Tentar Novamente
                    </button>
                    <button 
                        className={style.BackButton}
                        onClick={() => window.location.href = '/home/cliente/agendamentos'}
                    >
                        Voltar para Início
                    </button>
                </div>
            </div>
        </div>
    )
}

export default Failed;
