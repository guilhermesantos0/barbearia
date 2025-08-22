import style from './Checkout.module.scss';

interface AdditionalData {
    name: string;
    data?: Record<string, any>;
}

interface CheckoutParams {
    price: number,
    product?: AdditionalData;
    type: 'appointment' | 'subscription'
}

const Checkout:React.FC<CheckoutParams> = ({ price, product, type }) => {

    const typeLabels = {
        'appointment': 'do Agendamento',
        'subscription': 'da Inscrição'
    }

    return(
        <div className={style.Container}>
            <div className={style.PageContent}>
                <div className={style.LeftArea}>
                    <div className={style.TopContent}>
                        <h2>Detalhes {typeLabels[type]}</h2>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Checkout;