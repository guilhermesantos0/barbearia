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
import { Link, useNavigate } from 'react-router-dom';

// @ts-ignore
import { fomratTimeDuration } from '@utils/formatTimeDuration';
// @ts-ignore
import { formatPrice } from '@utils/formatPrice';
// @ts-ignore
import { formatDay } from '@utils/formatDay';
// @ts-ignore
import { useCheckoutStore } from '@store/checkoutStore';

interface BarberData {
    id: string,
    name: string,
    profilePic: string,
    rate: number,
    ratingCount: number
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
    const navigate = useNavigate();

    const [user, setUser] = useState<IUser>();

    const [barbers, setBarbers] = useState<IUser[]>([]);
    const [services, setServices] = useState<IService[]>([]);
    const [days, setDays] = useState<BarberDay[]>([]);
    const [times, setTimes] = useState<string[]>([]);

    const [selectedBarber, setSelectedBarber] = useState<BarberData | null>();
    const [selectedService, setSelectedService] = useState<ServiceData | null>();
    const [selectedDate, setSelectedDate] = useState<Date | null>();
    const [selectedTime, setSelectedTime] = useState<string | null>();

    const [currentStep, setCurrentStep] = useState<1 | 2 | 3 | 4 | 5>(1);

    const steps:Step[] = [
        { id: 1, label: 'Escolher Barbeiro' },
        { id: 2, label: 'Escolher Serviço' },
        { id: 3, label: 'Escolher Data' },
        { id: 4, label: 'Escolher Horário' }
    ]

    const isTimePast = (time: string, date: Date): boolean => {
        const now = new Date();
        if(date.toISOString().split("T")[0] != now.toISOString().split("T")[0]) return false
        
        const [hours, minutes] = time.split(":").map(Number);
        
        const target = new Date();

        target.setHours(hours, minutes, 0, 0);

        return target < now;
    }

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

        const barberDaysResult = await api.get(`/users/barbers/${selectedBarber?.id}/available-days`);
        setDays(barberDaysResult.data);

        setCurrentStep(3);
    }

    const handleSelectDay = async (day: any) => {
        setSelectedDate(day)

        const selectedDate = day.toISOString().split("T")[0];

        const barberTimesResult = await api.get(`/users/barbers/${selectedBarber?.id}/available-slots?date=${selectedDate}&serviceDuration=${selectedService?.duration}`);
        const validTimes = barberTimesResult.data.filter((time: string) => !isTimePast(time, day));
        setTimes(validTimes);

        setCurrentStep(4);
    }

    const handleSelectTime = async (time: any) => {
        setSelectedTime(time);
        setCurrentStep(5);
    }

    const handleCheckout = async () => {
        const discountResult = await api.get(`/users/checkout/discount?userId=${user?._id}&serviceId=${selectedService?.id}`);
        const discount = discountResult.data;

        const productObj = {
            name: selectedService?.name,
            data: {
                duration: fomratTimeDuration(selectedService?.duration),
                date: formatDay(selectedDate, false),
                time: selectedTime,
                barber: {
                    name: selectedBarber?.name,
                    profilePic: selectedBarber?.profilePic,
                    rate: `${selectedBarber?.rate} (${selectedBarber?.ratingCount} avaliações)`
                }
            }
        };

        console.log(productObj)

        const price = selectedService?.price;

        useCheckoutStore.getState().setCheckout({
            price,
            product: productObj,
            discount,
            type: "appointment"
        })

        navigate('/agendar-servico/pagamento')
    }

    return (
        <div className={style.Container}>
            <Link to='/home/cliente/agendamentos' className={style.Return}>
                <FontAwesomeIcon icon='arrow-left' />
                <p>Ver Meus Agendamentos</p>
            </Link>
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
                                                        <FontAwesomeIcon icon="check" className={style.Icon} />
                                                    ) : (
                                                        <p className={style.number}>
                                                            { step.id }
                                                        </p>
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
                                    <div className={style.RightContent}>
                                        {
                                            currentStep > 2 && selectedService && (
                                                <div className={style.ServiceDetails}>
                                                    <span className={style.ServiceName}>{selectedService.name}</span>
                                                    <span className={style.ServiceInfos}>{fomratTimeDuration(selectedService.duration)} {formatPrice(selectedService.price)}</span>
                                                </div>
                                            )
                                        }
                                        {
                                            currentStep > 3 && selectedDate && (
                                                <span className={style.AppointmentDate}>{formatDay(selectedDate, false)}</span>
                                            )
                                        }
                                    </div>
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
                                    <>
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
                                        <div className={style.ButtonsContainer}>
                                            <button className={style.PreviousStep} onClick={() => {setCurrentStep(1); setSelectedService(null)}}>&larr; Voltar Etapa</button>
                                        </div>
                                    </>
                                )
                            }
                            {
                                currentStep === 3 && (
                                    <div className={style.HorizontalCentralize}>
                                        <div className={`${style.StepContent} ${style.CalendarContent}`}>
                                            <CalendarDatePicker days={days} selected={handleSelectDay} />
                                        </div>
                                        <div className={style.ButtonsContainer}>
                                            <button className={style.PreviousStep} onClick={() => {setCurrentStep(2); setSelectedDate(null)}}>&larr; Voltar Etapa</button>
                                        </div>
                                    </div>
                                )
                            }
                            {
                                (currentStep === 4 || currentStep === 5) && (
                                    <div className={`${style.StepContent} ${style.TimePickerContent}`}>
                                        {
                                            times && times.length > 0 ? (
                                                <div className={style.TimesContainer}>
                                                    {
                                                        times.map((time, idx) => (
                                                            <div className={`${style.Time} ${selectedTime === time ? style.Selected : ''}`} key={idx} onClick={() => handleSelectTime(time)}>
                                                                {time}
                                                            </div>
                                                        ))
                                                    }
                                                </div>
                                            ) : (
                                                <div>sem tempo irmão</div>
                                            )
                                        }

                                        {
                                            currentStep === 5 && (
                                                <>
                                                    <div className={style.Resume}>
                                                        <h3>Resumo do Agendamento</h3>
                                                        <div className={style.ResumeDetails}>
                                                            <span className={style.Detail}><p className={style.DetailLabel}>Barbeiro</p><p className={style.DetailValue}>{selectedBarber?.name}</p></span>
                                                            <span className={style.Detail}><p className={style.DetailLabel}>Serviço</p><p className={style.DetailValue}>{selectedService?.name}</p></span>
                                                            <span className={style.Detail}><p className={style.DetailLabel}>Data</p><p className={style.DetailValue}>{formatDay(selectedDate)}</p></span>
                                                            <span className={style.Detail}><p className={style.DetailLabel}>Horário</p><p className={style.DetailValue}>{selectedTime}</p></span>
                                                            <span className={style.Detail}><p className={style.DetailLabel}>Duração</p><p className={style.DetailValue}>{fomratTimeDuration(selectedService?.duration)}</p></span>
                                                            <div className={style.DivisorLine}></div>
                                                            <span className={style.Detail}><p className={style.DetailLabel}>Preço Total</p><p className={style.DetailValue}>{formatPrice(selectedService?.price)}</p></span>
                                                        </div>
                                                    </div>
                                                    
                                                </>
                                            )
                                        }
                                        <div className={style.ButtonsContainer}>
                                            <button className={style.PreviousStep} onClick={() => {setCurrentStep(3); setSelectedTime(null)}}>&larr; Voltar Etapa</button>
                                            { currentStep === 5 && (<button className={style.Payment} onClick={handleCheckout}><FontAwesomeIcon icon='credit-card' />Ir Para o Pagamento</button>) }
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