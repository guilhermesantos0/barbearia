import { useEffect, useState } from 'react';
import style from './EditProfile.module.scss';
// @ts-ignore
import { IUser } from '@types/User';
// @ts-ignore
import { IService } from '@types/Service';
// @ts-ignore
import api from '@services/api';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// @ts-ignore
import { formatPhoneNumber } from '@utils/formatPhoneNumber';
import { CheckIcon, LockClosedIcon, ChevronDownIcon, ChevronUpIcon } from '@radix-ui/react-icons';

import * as Checkbox from '@radix-ui/react-checkbox';
import * as Select from '@radix-ui/react-select';
import Modal from '@components/Modal';
import { toast } from 'react-toastify';
import TimeInput from '@components/TimePicker';

// import TestTimeInput from '@components/TimePicker';

interface TimeSelectProps {
    value: string | undefined;
    onChange: (value: string) => void;
    options: string[];
    placeholder?: string;
    label?: string;
}

const EditProfile = () => {
    const [userData, setUserData] = useState<IUser>();
    const [services, setServices] = useState<IService[]>();

    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const [newIntervalName, setNewIntervalName] = useState<string>('');
    const [newIntervalStart, setNewIntervalStart] = useState<string>('');
    const [newIntervalEnd, setNewIntervalEnd] = useState<string>('');

    const handleSaveInterval = () => {
        if (!newIntervalName || !newIntervalStart || !newIntervalEnd) {
            toast.error('Por favor, preencha todos os campos do novo intervalo.');
            return;
        }

        console.log(newIntervalName, newIntervalStart, newIntervalEnd);
    }

    useEffect(() => {
        const fetchData = async () => {
            const userResult = await api.get('/users/me');
            const servicesResult = await api.get('/services');

            console.log(userResult.data);

            setUserData(userResult.data);
            setServices(servicesResult.data);
        };

        fetchData();
    }, []);

    const calcAge = (bornDate: string | Date): number => {
        const today = new Date();
        const birthDate = new Date(bornDate);

        let age = today.getFullYear() - birthDate.getFullYear();

        const actualMonth = today.getMonth();
        const actualDate = today.getDate();

        const birthMonth = birthDate.getMonth();
        const birthDay = birthDate.getDate();

        if (actualMonth < birthMonth || (actualMonth === birthMonth && actualDate < birthDay)) {
            age--;
        }

        return age;
    };

    const generateTimeOptions = (minH: number = 0, maxH: number = 24, minM: number = 0, maxM: number = 60) => {
        const times: string[] = [];
        for (let h = minH; h < maxH; h++) {
            for (let m = minM; m < maxM; m += 30) {
                const hour = h.toString().padStart(2, '0');
                const minute = m.toString().padStart(2, '0');
                times.push(`${hour}:${minute}`);
            }
        }
        return times;
    };

    const handleTimeChange = (
        field: 'start' | 'end',
        value: string,
        intervalIdx?: number
    ) => {
        if (!userData) return;

        setUserData((prev) => {
            if (!prev) return prev;

            if (typeof intervalIdx === 'number' && prev.work?.time?.intervals) {
                const updatedIntervals = [...prev.work.time.intervals];
                updatedIntervals[intervalIdx] = {
                    ...updatedIntervals[intervalIdx],
                    [field]: value,
                };

                return {
                    ...prev,
                    work: {
                        ...prev.work,
                        time: {
                            ...prev.work.time,
                            intervals: updatedIntervals,
                        },
                    },
                };
            }

            return {
                ...prev,
                work: {
                    ...prev.work,
                    time: {
                        ...prev.work?.time,
                        [field]: value,
                    },
                },
            };
        });
    };

    const handleDayToggle = (day: string) => {
        if (!userData) return;

        setUserData((prev) => {
            if (!prev) return prev;

            const currentDays = prev.work?.days || [];
            const updatedDays = currentDays.includes(day)
                ? currentDays.filter((d) => d !== day) 
                : [...currentDays, day];

            return {
                ...prev,
                work: {
                    ...prev.work,
                    days: updatedDays,
                },
            };
        });
    };

    const handleServiceToggle = (serviceId: string) => {
        if (!userData) return;

        setUserData((prev) => {
            if (!prev) return prev;

            const currentServices = prev.work?.services || [];
            const updatedServices = currentServices.includes(serviceId)
                ? currentServices.filter((id) => id !== serviceId) 
                : [...currentServices, serviceId];

            return {
                ...prev,
                work: { ...prev.work, services: updatedServices },
            };
        });
    }

    const handleOpenModal = () => {
        setIsModalOpen(true);
    }

    const daysOfWeek = [
        'segunda-feira',
        'terça-feira',
        'quarta-feira',
        'quinta-feira',
        'sexta-feira',
        'sábado',
        'domingo',
    ];

    return (
        <>
            <div className={style.Container}>
                <h1>Editar Perfil</h1>
                {userData && (
                    <div className={style.PageContent}>
                        <div className={style.TopArea}>
                            <div className={style.Section}>
                                <img src={userData.profilePic} alt={userData.name} className={style.ProfilePic} />
                                <button className={`${style.Button} ${style.ChangePhoto}`}><FontAwesomeIcon icon={['far', 'camera']} className={style.Icon} /> Alterar Foto</button>
                            </div>

                            <div className={style.Section}>
                                <div className={style.TopInfos}>
                                    <h2 className={style.Name}>{userData.name}</h2>
                                    <h3 className={style.Age}>{calcAge(userData.bornDate)} anos</h3>
                                </div>

                                <div className={style.BottomInfos}>
                                    <p className={style.Info}>
                                        <FontAwesomeIcon className={style.LabelIcon} icon="envelope" />
                                        {userData.email}
                                        <FontAwesomeIcon className={style.ValueIcon} icon="pencil" />
                                    </p>
                                    <p className={style.Info}>
                                        <FontAwesomeIcon className={style.LabelIcon} icon="phone" />
                                        {formatPhoneNumber(userData.phone)}
                                        <FontAwesomeIcon className={style.ValueIcon} icon="pencil" />
                                    </p>
                                </div>
                            </div>

                            <div className={style.Section}>
                                <button className={`${style.Button} ${style.ChangePassword}`}>
                                    <LockClosedIcon className={style.Icon} /> Alterar Senha
                                </button>
                                <button className={`${style.Button} ${style.Save}`}>
                                    <FontAwesomeIcon icon="save" /> Salvar Alterações
                                </button>
                                <button className={`${style.Button} ${style.Cancel}`}>
                                    <FontAwesomeIcon icon="xmark-circle" /> Cancelar
                                </button>
                            </div>
                        </div>

                        <div className={style.BottomArea}>
                            <div className={style.Section}>
                                <h3 className={style.Title}>Dias da Semana</h3>
                                <div className={style.Checkboxes}>
                                    {daysOfWeek.map((day, idx) => (
                                        <div key={idx} className={style.Checkbox}>
                                        <Checkbox.Root
                                            className={style.CheckboxRoot}
                                            id={`day-${idx}`}
                                            name={`day-${idx}`}
                                            checked={userData.work?.days.includes(day)}
                                            onCheckedChange={() => handleDayToggle(day)}
                                        >
                                            <Checkbox.Indicator className={style.CheckboxIndicator}>
                                                <CheckIcon width={16} height={16} />
                                            </Checkbox.Indicator>
                                        </Checkbox.Root>

                                        <label htmlFor={`day-${idx}`} className={style.Label}>
                                            {day
                                                .toLowerCase()
                                                .split('-')
                                                .map(
                                                    (word) =>
                                                        word.charAt(0).toUpperCase() +
                                                        word.slice(1)
                                                )
                                                .join('-')}
                                        </label>
                                    </div>
                                    ))}
                                </div>
                            </div>

                            <div className={style.Section}>
                                <h3 className={style.Title}>Horários de Atendimento</h3>

                                <div className={style.Times}>
                                    <div className={style.TimesShow}>
                                        <TimeInput
                                            label="Entrada"
                                            value={userData.work?.time.start}
                                            onChange={(val) => handleTimeChange('start', val)}
                                            minH={6}
                                            maxH={10}
                                        />

                                        <TimeInput
                                            label="Saída"
                                            value={userData.work?.time.end}
                                            onChange={(val) => handleTimeChange('end', val)}
                                            minH={16}
                                            maxH={20}
                                        />

                                    </div>

                                    <div className={style.Intervals}>
                                        {userData.work?.time.intervals.map((interval, idx) => (
                                            <div key={idx} className={style.Interval}>
                                                <h4 className={style.IntervalName}>{interval.name}</h4>
                                                <div className={style.TimesShow}>
                                                    <TimeInput 
                                                        label="Início"
                                                        value={interval.start}
                                                        onChange={(val) => handleTimeChange('start', val, idx)}
                                                        minH={Number(userData.work?.time.start.split(':')[0])}
                                                        minM={Number(userData.work?.time.start.split(':')[1])}
                                                        maxH={Number(userData.work?.time.end.split(':')[0])}
                                                    />

                                                    <TimeInput 
                                                        label="Final"
                                                        value={interval.start}
                                                        onChange={(val) => handleTimeChange('start', val, idx)}
                                                        minH={Number(interval.start.split(':')[0])}
                                                        minM={Number(interval.start.split(':')[1])}
                                                        maxH={Number(userData.work?.time.end.split(':')[0])}
                                                    />
                                                </div>
                                            </div>
                                        ))}

                                        <button
                                            className={style.AddInterval}
                                            onClick={() => setIsModalOpen(true)}
                                        >
                                            <FontAwesomeIcon icon="plus" className={style.Icon} />
                                        </button>
                                    </div>
                                </div>
                            </div>

                            <div className={style.Section}>
                                <h3 className={style.Title}>Serviços</h3>
                                <div className={style.Services}>
                                    {services &&
                                        services.map((service, idx) => (
                                            <div key={idx} className={style.Checkbox}>
                                                <Checkbox.Root
                                                    className={style.CheckboxRoot}
                                                    id={`service-${service._id}`}
                                                    checked={userData.work?.services?.includes(service._id)}
                                                    onCheckedChange={() => handleServiceToggle(service._id)}
                                                >
                                                    <Checkbox.Indicator className={style.CheckboxIndicator}>
                                                        <CheckIcon width={16} height={16} />
                                                    </Checkbox.Indicator>
                                                </Checkbox.Root>

                                                <label
                                                    htmlFor={`service-${service._id}`}
                                                    className={style.Label}
                                                >
                                                    {service.name}
                                                </label>
                                            </div>
                                        ))}
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
            <Modal open={isModalOpen} onOpenChange={setIsModalOpen} trigger={<></>}>
                <div id="modal-root" className={style.Modal}>
                    <h2 className={style.ModalTitle}>Adicionar Intervalo</h2>

                    <div className={style.ModalContent}>
                        <div className={style.InputGroup}>
                            <label className={style.Label}>Nome do Intervalo</label>
                            <input
                                type="text"
                                className={style.Input}
                                placeholder="Ex: Almoço"
                                value={newIntervalName}
                                onChange={(e) => setNewIntervalName(e.target.value)}
                            />
                        </div>

                        <TimeInput 
                            label="Início"
                            value={newIntervalStart}
                            onChange={setNewIntervalStart}
                            minH={Number(userData?.work?.time.start.split(':')[0])}
                            minM={Number(userData?.work?.time.start.split(':')[1])}
                            maxH={Number(userData?.work?.time.end.split(':')[0])}
                        />

                        <TimeInput 
                            label="Final"
                            value={newIntervalEnd}
                            onChange={setNewIntervalEnd}
                            minH={Number(newIntervalStart.split(':')[0])}
                            minM={Number(newIntervalStart.split(':')[1])}
                            maxH={Number(userData?.work?.time.end.split(':')[0])}
                        />

                    </div>

                    <div className={style.ModalActions}>
                        <button className={style.ButtonCancel} onClick={() => setIsModalOpen(false)}>Cancelar</button>
                        <button className={style.ButtonSave} onClick={handleSaveInterval}>Salvar</button>
                    </div>
                </div>
            </Modal>
            {/* <Modal open={isModalOpen} onOpenChange={setIsModalOpen} trigger={<></>}>
                <div id="modal-root" className={style.Modal}>
                    <h2 className={style.ModalTitle}>Adicionar Intervalo</h2>

                    <div className={style.ModalContent}>
                        <div className={style.InputGroup}>
                            <label className={style.Label} htmlFor="interval-name">
                                Nome do Intervalo
                            </label>
                            <input
                                type="text"
                                id="interval-name"
                                placeholder="Ex: Almoço"
                                className={style.Input}
                                value={newIntervalName}
                                onChange={(e) => setNewIntervalName(e.target.value)}
                            />
                        </div>

                        <div className={style.Field}>
                            <p className={style.Label}>Início</p>
                            <SelectTimeComponent
                                value={newIntervalStart}
                                onChange={setNewIntervalStart}
                                options={generateTimeOptions(
                                    Number(userData?.work?.time.start.split(':')[0]),
                                    Number(userData?.work?.time.end.split(':')[0])
                                )}
                                placeholder="Escolha um horário"
                                portalContainer={document.getElementById("modal-root")}
                            />
                        </div>

                        <div className={style.Field}>
                            <p className={style.Label}>Final</p>
                            <SelectTimeComponent
                                value={newIntervalEnd}
                                onChange={setNewIntervalEnd}
                                options={generateTimeOptions(
                                    Number(newIntervalStart.split(':')[0]),
                                    Number(userData?.work?.time.end.split(':')[0]),
                                    Number(newIntervalStart.split(':')[1])
                                )}
                                placeholder="Escolha um horário"
                                portalContainer={document.getElementById("modal-root")}
                            />
                        </div>
                    </div>

                    <div className={style.ModalActions}>
                        <button
                            className={style.ButtonCancel}
                            onClick={() => setIsModalOpen(false)}
                        >
                            Cancelar
                        </button>
                        <button className={style.ButtonSave} onClick={handleSaveInterval}>
                            Salvar
                        </button>
                    </div>
                </div>
            </Modal> */}

        </>
    );
};

export default EditProfile;