import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import style from './AdminBarber.module.scss';
import { IService } from "../../../types/Service";
import { IUser } from "../../../types/User";
import { formatPhoneNumber } from '@utils/formatPhoneNumber';
import { useState } from 'react';
import { SelectMenu } from '@components/SelectMenu';
import Modal from '@components/Modal';
import Camera from '@assets/icons/camera.svg?react';
import api from '@services/api';
import { toast } from 'react-toastify';
import { CheckIcon } from '@radix-ui/react-icons';
import * as Checkbox from '@radix-ui/react-checkbox';
import TimePicker from '@components/TimePicker';

interface AdminBarberProps {
    barber: IUser;
    services: IService[];
    roles: any[];
    times: { start: string, end: string, openDays: string[] };
}   

const AdminBarber: React.FC<AdminBarberProps> = ({ barber, services, roles, times }) => {

    const [isExpanded, setIsExpanded] = useState<boolean>(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false);


    console.log(barber.work?.services);
    console.log(services)

    barber.work?.services.forEach(service => {
        const serviceData = services.find(s => s._id === service._id);
        console.log(serviceData);
    });

    const [editingData, setEditingData] = useState<{
        name: string,
        gender: string,
        profilePic: string,
        role: number,
        work: {
            days: string[],
            time: {
                start: string,
                end: string,
                intervals: Array<{
                    name: string,
                    start: string,
                    end: string
                }>
            },
            services: string[]
        }
    }>({
        name: barber.name,
        gender: barber.gender || 'Prefiro não informar',
        profilePic: barber.profilePic,
        role: typeof barber.role === 'number' ? barber.role : 0,
        work: {
            days: barber.work?.days || [],
            time: {
                start: barber.work?.time?.start || '08:00',
                end: barber.work?.time?.end || '18:00',
                intervals: barber.work?.time?.intervals || []
            },
            services: barber.work?.services || []
        }
    });

    const calculateStatus = () => {
        if (!barber.history || barber.history.length === 0) {
            return { status: 'Inativo', color: 'red' };
        }

        const lastService = barber.history.reduce((latest, current) =>
            new Date(current.date) > new Date(latest.date) ? current : latest
        );

        const lastServiceDate = new Date(lastService.date);
        const now = new Date();
        const daysDiff = Math.floor((now.getTime() - lastServiceDate.getTime()) / (1000 * 60 * 60 * 24));

        if (daysDiff <= 7) {
            return { status: 'Ativo', color: 'green' };
        } else if (daysDiff <= 30) {
            return { status: 'Moderado', color: 'yellow' };
        } else {
            return { status: 'Inativo', color: 'red' };
        }
    };

    const actionOptions = [
        { value: 'edit', label: 'Editar', icon: <FontAwesomeIcon icon='pencil' /> },
        { value: 'profile', label: 'Ver Perfil', icon: <FontAwesomeIcon icon='eye' /> },
        { value: 'disable', label: 'Desativar', icon: <FontAwesomeIcon icon='xmark-circle' />, red: true },
        { value: 'delete', label: 'Excluir', icon: <FontAwesomeIcon icon='trash' />, red: true },
    ];

    const roleOptions = roles.map((role) => ({
        value: role._id.toString(),
        label: role.name
    }));


    const formatTime = (time: string) => {
        return time.substring(0, 5);
    };

    const handleAction = (action: string) => {
        switch (action) {
            case 'edit':
                // Reset editing data with current barber data
                setEditingData({
                    name: barber.name,
                    gender: barber.gender || 'Prefiro não informar',
                    profilePic: barber.profilePic,
                    role: typeof barber.role === 'number' ? barber.role : 0,
                    work: {
                        days: barber.work?.days || [],
                        time: {
                            start: barber.work?.time?.start || '08:00',
                            end: barber.work?.time?.end || '18:00',
                            intervals: barber.work?.time?.intervals || []
                        },
                        services: barber.work?.services || []
                    }
                });
                setIsEditModalOpen(true);
                break;
            case 'disable':
                console.log('Disable barber:', barber._id);
                break;
            case 'delete':
                console.log('Delete barber:', barber._id);
                break;
            case 'profile':
                console.log('View profile:', barber._id);
                break;
        }
    };

    const handleEditName = (newName: string) => {
        setEditingData(prev => ({ ...prev, name: newName }));
    };

    const handleEditGender = (newGender: string | undefined) => {
        setEditingData(prev => ({ ...prev, gender: newGender ?? 'Prefiro não informar' }));
    };

    const handleEditRole = (newRole: string) => {
        setEditingData(prev => ({ ...prev, role: parseInt(newRole) }));
    };

    const handleEditWorkTime = (field: 'start' | 'end', value: string) => {
        setEditingData(prev => ({
            ...prev,
            work: {
                ...prev.work,
                time: { ...prev.work.time, [field]: value }
            }
        }));
    };

    const handleEditIntervals = (newIntervals: Array<{name: string, start: string, end: string}>) => {
        setEditingData(prev => ({
            ...prev,
            work: {
                ...prev.work,
                time: { ...prev.work.time, intervals: newIntervals }
            }
        }));
    };

    const handleSave = async () => {
        setIsEditModalOpen(false);
        try {
            const updateResult = await api.patch(`/users/${barber._id}`, editingData);
            
            if (updateResult.status === 200) {
                toast.success(`${barber.name} atualizado com sucesso!`);
            } else {
                toast.error('Houve um erro ao atualizar o barbeiro!');
            }
        } catch (error) {
            console.error(error);
            toast.error('Houve um erro ao atualizar o barbeiro!');
        }
    };

    const formatWorkDays = (days: string[]) => {
        const dayMap: { [key: string]: string } = {
            'monday': 'Seg',
            'tuesday': 'Ter',
            'wednesday': 'Qua',
            'thursday': 'Qui',
            'friday': 'Sex',
            'saturday': 'Sáb',
            'sunday': 'Dom'
        };
        return days.map(day => dayMap[day] || day).join(', ');
    };

    const daysOfWeek = [
        'segunda-feira',
        'terça-feira',
        'quarta-feira',
        'quinta-feira',
        'sexta-feira',
        'sábado',
        'domingo',
    ];

    const handleDayToggle = (day: string) => {
        if (!editingData) return;

        //@ts-ignore
        setEditingData((prev) => {
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
        if (!editingData) return;

        //@ts-ignore
        setEditingData((prev) => {
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

    const statusInfo = calculateStatus();

    return (
        <>
            <div key={barber._id} className={style.TableRow} onClick={() => setIsExpanded(!isExpanded)}>
                <div className={style.RowContent}>
                    <div className={style.Cell}>
                        <div className={style.ProfilePic}>
                            {barber.profilePic ? (
                                <img src={barber.profilePic} alt={barber.name} />
                            ) : (
                                <FontAwesomeIcon icon="user" />
                            )}
                        </div>
                    </div>
                    
                    <div className={style.Cell}>
                        <span className={style.BarberName}>{barber.name}</span>
                    </div>
                    
                    <div className={style.Cell}>
                        <span className={style.Email}>{barber.email}</span>
                    </div>
                    
                    <div className={style.Cell}>
                        <span className={style.Phone}>{formatPhoneNumber(barber.phone)}</span>
                    </div>
                    
                    <div className={style.Cell}>
                        <span className={`${style.Status} ${style[statusInfo.color]}`}>
                            {statusInfo.status}
                        </span>
                    </div>
                    
                    <div className={style.Cell}>
                        <div className={style.Rating}>
                            <FontAwesomeIcon icon="star" />
                            <span>{barber.averageRating?.toFixed(1) || '0.0'}</span>
                        </div>
                    </div>
                    
                    <div className={style.Cell}>
                        <div className={style.Actions}>
                            <SelectMenu
                                options={actionOptions}
                                placeholder=""
                                value=""
                                onChange={(value) => value && handleAction(value)}
                                className={style.ActionMenu}
                                viewPortClassName={style.ViewPortClassName}
                            />
                        </div>
                    </div>
                </div>

                {isExpanded && (
                    <div className={style.ExpandedContent}>
                        <div className={style.DetailsGrid}>
                            <div className={style.DetailSection}>
                                <h4>Dias de Trabalho</h4>
                                <p>{barber.work?.days ? formatWorkDays(barber.work.days) : 'Não definido'}</p>
                            </div>
                            
                            <div className={style.DetailSection}>
                                <h4>Horário</h4>
                                <p>
                                    {barber.work?.time ? 
                                        `${formatTime(barber.work.time.start)} - ${formatTime(barber.work.time.end)}` : 
                                        'Não definido'
                                    }
                                </p>
                            </div>
                            
                            <div className={style.DetailSection}>
                                <h4>Intervalos</h4>
                                <div className={style.IntervalsList}>
                                    {barber.work?.time?.intervals && barber.work.time.intervals.length > 0 ? (
                                        barber.work.time.intervals.map((interval, index) => (
                                            <div key={index} className={style.IntervalItem}>
                                                <span className={style.IntervalName}>{interval.name}</span>
                                                <span className={style.IntervalTime}>
                                                    {formatTime(interval.start)} - {formatTime(interval.end)}
                                                </span>
                                            </div>
                                        ))
                                    ) : (
                                        <p>Nenhum intervalo definido</p>
                                    )}
                                </div>
                            </div>
                            
                            <div className={style.DetailSection}>
                                <h4>Serviços</h4>
                                <div className={style.ServicesList}>
                                    {barber.work?.services && barber.work.services.length > 0 ? (
                                        <div className={style.ServiceTags}>
                                            {barber.work.services.map((serviceId, index) => {
                                                const service = services.find(s => s._id === serviceId);
                                                return (
                                                    <span key={index} className={style.ServiceTag}>
                                                        {service?.name || serviceId}
                                                    </span>
                                                );
                                            })}
                                        </div>
                                    ) : (
                                        <p>Nenhum serviço associado</p>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            <Modal open={isEditModalOpen} onOpenChange={setIsEditModalOpen} trigger={<></>} close className={style.ModalContainer}>
                <h3>Editar {barber.name}</h3>
                
                <div className={style.ModalContent}>
                    <div className={style.LeftPannel}>
                        <div className={style.ProfilePicContainer}>
                            {editingData.profilePic ? (
                                <img src={editingData.profilePic} alt={editingData.name} />
                            ) : (
                                <FontAwesomeIcon icon="user" />
                            )}

                            <button className={style.UploadPhoto}>
                                <Camera className={style.Icon} /> Alterar Foto
                            </button>

                        </div>
                        
                        <div className={style.EditForm}>
                            <div className={`${style.InputContainer} ${style.Name}`}>
                                <label htmlFor="barberName">Nome</label>
                                <input 
                                    type="text" 
                                    id="barberName" 
                                    value={editingData.name} 
                                    onChange={(e) => handleEditName(e.target.value)} 
                                />
                            </div>

                            <div className={`${style.InputContainer} ${style.Gender}`}>
                                <label htmlFor="barberGender">Sexo</label>
                                <SelectMenu
                                    className={style.Input}
                                    value={editingData.gender}
                                    options={[
                                        { value: 'Masculino', label: 'Masculino' },
                                        { value: 'Feminino', label: 'Feminino' },
                                        { value: 'Outro', label: 'Outro' },
                                        { value: 'Prefiro não informar', label: 'Prefiro não informar' },
                                    ]}
                                    onChange={(val) => handleEditGender(val)}
                                />
                            </div>

                            <div className={`${style.InputContainer} ${style.Role}`}>
                                <label htmlFor="barberRole">Função</label>
                                <SelectMenu
                                    className={style.Input}
                                    value={editingData.role.toString()}
                                    options={roleOptions}
                                    onChange={(val) => handleEditRole(val || '0')}
                                />
                            </div>
                        </div>

                    </div>
                    <div className={style.RightPannel}>
                        <div className={`${style.InputContainer} ${style.WorkDays}`}>
                            <h4>Dias de Trabalho</h4>

                            <div className={style.Checkboxes}>
                                {daysOfWeek.map((day, idx) => (
                                    <div key={idx} className={style.Checkbox}>
                                    <Checkbox.Root
                                        className={style.CheckboxRoot}
                                        id={`day-${idx}`}
                                        name={`day-${idx}`}
                                        checked={editingData.work?.days.includes(day)}
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

                        <div className={`${style.InputContainer} ${style.Time}`}>
                            <div>
                                <label htmlFor="startTime">Início</label>
                                <TimePicker
                                    value={editingData.work.time.start}
                                    onChange={(val) => handleEditWorkTime('start', val)}
                                    inModal={true}
                                    minH={Number(times.start.split(':')[0])}
                                    minM={Number(times.start.split(':')[1])}
                                    maxH={Number(times.end.split(':')[0])}
                                />
                            </div>

                            <div>
                                <label htmlFor="endTime">Fim</label>
                                <TimePicker
                                    value={editingData.work.time.end}
                                    onChange={(val) => handleEditWorkTime('end', val)}
                                    inModal={true}
                                    minH={Number(editingData.work.time.start.split(':')[0])}
                                    minM={Number(editingData.work.time.start.split(':')[1])}
                                    maxH={Number(times.end.split(':')[0])}
                                />
                            </div>
                        </div>

                        <div className={`${style.InputContainer} ${style.Services}`}>
                            <h4>Serviços Oferecidos</h4>
                            <div className={style.ServicesGrid}>
                                {services.map((service, idx) => (
                                    <div key={idx} className={style.Checkbox}>
                                        <Checkbox.Root
                                            className={style.CheckboxRoot}
                                            id={`service-${service._id}`}
                                            checked={editingData.work?.services?.map(s => s._id).includes(service._id)}
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

                        <div className={`${style.InputContainer} ${style.Intervals}`}>
                            <h4>Intervalos</h4>
                            <div className={style.IntervalsContainer}>
                                {editingData.work.time.intervals.map((interval, index) => (
                                    <div key={index} className={style.IntervalRow}>
                                        <input
                                            type="text"
                                            placeholder="Nome do intervalo"
                                            value={interval.name}
                                            onChange={(e) => {
                                                const newIntervals = [...editingData.work.time.intervals];
                                                newIntervals[index].name = e.target.value;
                                                handleEditIntervals(newIntervals);
                                            }}
                                            className={style.IntervalName}
                                        />
                                        <TimePicker
                                            value={interval.start}
                                            onChange={(val) => {
                                                const newIntervals = [...editingData.work.time.intervals];
                                                newIntervals[index].start = val;
                                                handleEditIntervals(newIntervals);
                                            }}
                                            minH={Number(times.start.split(':')[0])}
                                            minM={Number(times.start.split(':')[1])}
                                            maxH={Number(interval.end.split(':')[0])}
                                            className={style.TimePicker}
                                        />
                                        <TimePicker
                                            value={interval.end}
                                            onChange={(val) => {
                                                const newIntervals = [...editingData.work.time.intervals];
                                                newIntervals[index].end = val;
                                                handleEditIntervals(newIntervals);
                                            }}
                                            minH={Number(interval.start.split(':')[0])}
                                            minM={Number(interval.start.split(':')[1])}
                                            maxH={Number(times.end.split(':')[0])}
                                            className={style.TimePicker}
                                        />
                                        <button
                                            type="button"
                                            className={style.RemoveInterval}
                                            onClick={() => {
                                                const newIntervals = editingData.work.time.intervals.filter((_, i) => i !== index);
                                                handleEditIntervals(newIntervals);
                                            }}
                                        >
                                            <FontAwesomeIcon icon="trash" />
                                        </button>
                                    </div>
                                ))}
                            </div>
                            <button
                                type="button"
                                className={style.AddInterval}
                                onClick={() => {
                                    const newIntervals = [...editingData.work.time.intervals, { name: '', start: '12:00', end: '13:00' }];
                                    handleEditIntervals(newIntervals);
                                }}
                            >
                                <FontAwesomeIcon icon="plus" /> Adicionar Intervalo
                            </button>
                        </div>
                    </div>
                </div>
                
                <div className={style.ModalActions}>
                    <button 
                        type="button" 
                        className={style.ButtonCancel}
                        onClick={() => setIsEditModalOpen(false)}
                    >
                        Cancelar
                    </button>
                    <button 
                        type="button" 
                        className={style.ButtonSave}
                        onClick={handleSave}
                    >
                        Salvar
                    </button>
                </div>
            </Modal>
        </>
    )
}

export default AdminBarber;