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

                <h2 className={style.Title}>Pagamento não concluído</h2>
                <p className={style.Subtitle}>
                    Algo deu errado durante o processamento do seu pagamento.
                </p>

                <div className={style.ShopDetails}>
                    <h3 className={style.SectionTitle}>Detalhes da Tentativa</h3>
                    
                    {state.type === 'premium' && (
                        <div className={style.Details}>
                            <span className={style.Detail}>
                                <p className={style.DetailLabel}>Plano:</p>
                                <p className={style.DetailValue}>{state.planName}</p>
                            </span>
                            <span className={style.Detail}>
                                <p className={style.DetailLabel}>Total:</p>
                                <p className={style.DetailValue}>{formatPrice(state.totalPrice ?? 0)}</p>
                            </span>
                            {state.discount && (
                                <span className={style.Detail}>
                                    <p className={style.DetailLabel}>Desconto:</p>
                                    <p className={style.DetailValue}>- {formatPrice(state.discount)}</p>
                                </span>
                            )}
                        </div>
                    )}

                    {state.type === 'service' && state.service && (
                        <div className={style.Details}>
                            <span className={style.Detail}>
                                <p className={style.DetailLabel}>Serviço:</p>
                                <p className={style.DetailValue}>{state.service.title}</p>
                            </span>
                            <span className={style.Detail}>
                                <p className={style.DetailLabel}>Barbeiro:</p>
                                <p className={style.DetailValue}>{state.service.barber}</p>
                            </span>
                            <span className={style.Detail}>
                                <p className={style.DetailLabel}>Data e Hora:</p>
                                <p className={style.DetailValue}>{state.service.dateTime}</p>
                            </span>
                        </div>
                    )}

                    <div className={style.Details}>
                        <span className={style.Detail}>
                            <p className={style.DetailLabel}>Método de Pagamento:</p>
                            <p className={style.DetailValue}>{paymentMethodLabels[state.paymentMethod]}</p>
                        </span>
                        <span className={style.Detail}>
                            <p className={style.DetailLabel}>Valor Final:</p>
                            <p className={style.DetailValue}>{formatPrice(state.finalPrice)}</p>
                        </span>
                    </div>

                    {state.errorMessage && (
                        <div className={style.ErrorBox}>
                            <span className={style.Detail}>
                                <p className={style.DetailLabel}>Erro:</p>
                                <p className={style.DetailValue}>{state.errorMessage}</p>
                            </span>
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
