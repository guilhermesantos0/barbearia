import { ReactNode, useState } from 'react';
import style from './/RateService.module.scss';

import * as Dialog from '@radix-ui/react-dialog';
import Modal from '@components/Modal';

// @ts-ignore
import { IScheduledService } from '@types/ScheduledService';
// @ts-ignore
import { formatDate } from '@utils/formatDate';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

interface RateServiceProps {
    trigger: ReactNode,
    service: IScheduledService
}

const RateService: React.FC<RateServiceProps> = ({ trigger, service }) => {
    const [rating, setRating] = useState<number>(0);
    const [comment, setComment] = useState<string>('');
    const [confirmOpen, setConfirmOpen] = useState(false);

    const handleRate = () => {
        if (rating < 1) return alert('Você deve avaliar com ao menos 1 estrela');

        if (comment === '') {
            setConfirmOpen(true); // abre modal de confirmação
            return;
        }

        submitRate();
    };

    const submitRate = () => {
        console.log('Avaliação enviada:', { rating, comment });
        // Aqui você chamaria a API
        setConfirmOpen(false); // fecha modal de confirmação se estiver aberto
    };

    return (
        <>
            <Modal trigger={trigger}>
                <div className={style.Container}>
                    <h1 className={style.Title}>{service.service.name}</h1>
                    <div className={style.ServiceData}>
                        <p className={style.BarberName}>
                            <FontAwesomeIcon icon="user" /> {service.barber.name}
                        </p>
                        <p className={style.ServiceDate}>
                            <FontAwesomeIcon icon="clock" /> {formatDate(service.date)}
                        </p>
                    </div>

                    <div className={style.RateArea}>
                        <h3>Avaliação</h3>
                        <div className={style.Stars}>
                            {[1, 2, 3, 4, 5].map(star => (
                                <FontAwesomeIcon
                                    icon={star <= rating ? 'star' : ['far', 'star']}
                                    className={style.Star}
                                    onClick={() => setRating(star)}
                                    key={star}
                                />
                            ))}
                        </div>
                    </div>

                    <div className={style.CommentArea}>
                        <h3>Comentário</h3>
                        <textarea
                            name="comment"
                            id="comment"
                            className={style.CommentText}
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                            placeholder="Deixe um comentário..."
                        />
                    </div>

                    <div className={style.ButtonArea}>
                        <Dialog.Close asChild>
                            <button className={`${style.Button} ${style.Cancel}`}>Cancelar</button>
                        </Dialog.Close>
                        <button className={`${style.Button} ${style.Rate}`} onClick={handleRate}>Avaliar</button>
                    </div>
                </div>
            </Modal>

            {/* Modal de confirmação */}
            <Dialog.Root open={confirmOpen} onOpenChange={setConfirmOpen}>
                <Dialog.Portal>
                    <Dialog.Overlay className={style.ConfirmOverlay} />
                    <Dialog.Content className={style.ConfirmContainer}>
                        <h2>Enviar avaliação sem comentário?</h2>
                        <p>Deseja enviar mesmo assim?</p>
                        <div className={style.ConfirmButtons}>
                            <Dialog.Close asChild>
                                <button className={style.Cancel}>Não</button>
                            </Dialog.Close>
                            <button className={style.Confirm} onClick={submitRate}>Sim</button>
                        </div>
                    </Dialog.Content>
                </Dialog.Portal>
            </Dialog.Root>
        </>
    );
};

export default RateService;
