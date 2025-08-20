import { useEffect, useState } from 'react';
import style from './ScheduleService.module.scss';

// @ts-ignore
import { IUser } from '@types/User';

// @ts-ignore
import api from '../../services/api';
// @ts-ignore
import { IService } from '@types/Service';
import BarberCard from '@components/BarberCard';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const ScheduleService = () => {
    const [user, setUser] = useState<IUser>();
    const [barbers, setBarbers] = useState<IUser[]>([]);
    const [services, setServices] = useState<IService[]>([]);

    const [currentStep, setCurrentStep] = useState<1 | 2 | 3 | 4>(1);

    const steps = [
        { id: 1, label: 'Escolher Barbeiro' },
        { id: 2, label: 'Escolher Serviço' },
        { id: 3, label: 'Escolher Data' },
        { id: 4, label: 'Escolher Horário' }
    ]

    useEffect(() => {
        const fetchData = async () => {
            const userResult = await api.get('/users/me');
            setUser(userResult.data);

            const barbersResult = await api.get('/users/barbers');
            setBarbers(barbersResult.data);
        }

        fetchData();
    },[])


    return (
        <div className={style.Container}>
            <span className={style.Return}>
                <FontAwesomeIcon icon='arrow-left' />
                <p>Voltar</p>
            </span>
            {
                user && barbers && (
                    <div className={style.PageContent}>
                        <div className={style.StepIndicatior}>
                            {   
                                steps.map((step, idx) => (
                                    <>
                                        <div key={step.id} className={`${style.Step} ${currentStep === step.id ? style.CurrentStep: ''} ${currentStep > step.id ? style.CompletedStep : ''} ${currentStep === step.id - 1 ? style.NextStep : ''}`}>
                                            <div className={style.Circle}>
                                                {
                                                    currentStep > step.id ? (
                                                        <FontAwesomeIcon icon="check" />
                                                    ) : (
                                                        <>
                                                            { step.id }
                                                        </>
                                                    )
                                                }
                                            </div>

                                            <span className={style.Text}>{step.label}</span>
                                        </div>
                                        {
                                            idx < steps.length - 1 && (
                                                <div className={style.DivisorLine}></div>
                                            )
                                        }
                                    </>
                                ))
                            }
                        </div>
                            {
                                currentStep === 1 && (
                                    <div className={style.StepContent}>
                                        <h1>Escolha seu Barbeiro</h1>
                                        <div className={style.BarbersContainer}>
                                            {
                                                barbers.map(barber => (
                                                    <BarberCard barber={barber} />
                                                ))
                                            }
                                        </div>
                                    </div>
                                )
                            }
                    </div>
                )
            }
        </div>
    )
}

export default ScheduleService