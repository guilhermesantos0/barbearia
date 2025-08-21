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
import ServiceCard from '@components/ServiceCard';
import CalendarDatePicker from '@components/CalendarDatePicker';
import { Link } from 'react-router-dom';

// @ts-ignore
import { fomratTimeDuration } from '@utils/formatTimeDuration';
// @ts-ignore
import { formatPrice } from '@utils/formatPrice';

interface BarberData {
    id: string,
    name: string,
    profilePic: string,
    rate: number
}

interface ServiceData {
    id: string,
    name: string,
    price: number,
    duration: number
}

interface BarberDay {
    day: string,
    available: boolean
}

interface Step {
    id: 1 | 2 | 3 | 4,
    label: string
}

const ScheduleService = () => {
    const [user, setUser] = useState<IUser>();

    const [barbers, setBarbers] = useState<IUser[]>([]);
    const [services, setServices] = useState<IService[]>([]);
    const [days, setDays] = useState<BarberDay[]>([]);

    const [selectedBarber, setSelectedBarber] = useState<BarberData | null>();
    const [selectedService, setSelectedService] = useState<ServiceData | null>();

    const [currentStep, setCurrentStep] = useState<1 | 2 | 3 | 4>(1);

    const steps:Step[] = [
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

    const handleSelectBarber = async (barberData: BarberData) => {
        setSelectedBarber(barberData);

        const servicesResult = await api.get(`/users/barbers/${barberData.id}/services`)
        setServices(servicesResult.data.work.services);

        setCurrentStep(2);
    }

    const handleSelectService = async (serviceData: ServiceData) => {
        setSelectedService(serviceData)

        console.log(selectedBarber)

        const barberDaysResult = await api.get(`/users/barbers/${selectedBarber?.id}/available-days`);
        setDays(barberDaysResult.data);

        setCurrentStep(3);
    }

    const handleSelectDay = async (day: any) => {
        console.log(day)
    }

    return (
        <div className={style.Container}>
            <Link to='/home/cliente/agendamentos' className={style.Return}>
                <FontAwesomeIcon icon='arrow-left' />
                <p>Voltar</p>
            </Link>
            {
                user && barbers && (
                    <div className={style.PageContent}>
                        <div className={style.StepIndicatior}>
                            {   
                                steps.map((step, idx) => (
                                    <>
                                        <div key={step.id} onClick={() => setCurrentStep(step.id)} className={`${style.Step} ${currentStep === step.id ? style.CurrentStep: ''} ${currentStep > step.id ? style.CompletedStep : ''} ${currentStep === step.id - 1 ? style.NextStep : ''}`}>
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
                                            {
                                                idx < steps.length - 1 && (
                                                    <span className={`${style.DivisorLine} ${idx + 1 < currentStep ? style.CompletedStep : ''}`}></span>
                                                )
                                            }
                                        </div>
                                    </>
                                ))
                            }
                        </div>
                        {
                            currentStep > 1 && (
                                <div className={style.AppointmentDetails}>
                                    {
                                        selectedBarber && (
                                            <div className={style.BarberDetails}>
                                                <img src={selectedBarber.profilePic} alt={selectedBarber.name} />
                                                <div className={style.BarberData}>
                                                    <span className={style.BarberName}>{selectedBarber.name}</span>
                                                    <span className={style.BarberRate}>{selectedBarber.rate} <FontAwesomeIcon icon="star" /></span>
                                                </div>
                                            </div>
                                        )
                                    }
                                    {
                                        currentStep > 2 && selectedService && (
                                            <div className={style.ServiceDetails}>
                                                <span className={style.ServiceName}>{selectedService.name}</span>
                                                <span className={style.ServiceInfos}>{fomratTimeDuration(selectedService.duration)} {formatPrice(selectedService.price)}</span>
                                            </div>
                                        )
                                    }
                                </div>
                            )
                        }
                            {
                                currentStep === 1 && (
                                    <div className={style.StepContent}>
                                        <h1>Escolha seu Barbeiro</h1>
                                        <div className={style.BarbersContainer}>
                                            {
                                                barbers.map(barber => (
                                                    <BarberCard barber={barber} selected={handleSelectBarber} />
                                                ))
                                            }
                                        </div>
                                    </div>
                                )
                            }
                            {
                                currentStep === 2 && (
                                    <div className={style.StepContent}>
                                        {
                                            services.length > 0 ? (
                                                <>
                                                    <h1>Escolha seu Serviço</h1>
                                                    <div className={style.ServicesContainer}>
                                                        {
                                                            services.map(service => (
                                                                <ServiceCard service={service} selected={handleSelectService} />
                                                            ))
                                                        }
                                                    </div>
                                                </>
                                            ) : (
                                                <span>Selecione um barbeiro primeiro</span>
                                            )
                                        }
                                    </div>
                                )
                            }
                            {
                                currentStep === 3 && (
                                    <div className={`${style.StepContent} ${style.CalendarContent}`}>
                                        <CalendarDatePicker days={days} selected={handleSelectDay} />
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