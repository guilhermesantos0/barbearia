import style from './BarbersList.module.scss';
import { useUser } from '@contexts/UserContext';
import { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// @ts-ignore
import api from '@services/api';
import { useQuery } from '@tanstack/react-query';
// @ts-ignore
import { IUser } from '@types/User';
import { SelectMenu } from '@components/SelectMenu';
// @ts-ignore
import { formatPhoneNumber } from '@utils/formatPhoneNumber';

const BarbersList = () => {
    const { user } = useUser();
    const [isAllowed, setIsAllowed] = useState<boolean>(false);
    const [expandedBarber, setExpandedBarber] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            const roleTypeResult = await api.get(`/roles/${user?.role}/type`);
            const roleType = roleTypeResult.data;
            setIsAllowed(roleType === 'admin' || roleType === 'barbeiro-admin');
        };
        fetchData();
    }, [user]);

    const { data: barbers } = useQuery({
        queryKey: ['allBarbers', user?.sub],
        queryFn: async () => {
            const barbersResult = await api.get('/users/barbers/admin');
            return barbersResult.data;
        },
        enabled: isAllowed
    });

    const calculateStatus = (barber: IUser) => {
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

    const formatTime = (time: string) => {
        return time.substring(0, 5);
    };

    const actionOptions = [
        { value: 'edit', label: 'Editar', icon: <FontAwesomeIcon icon='pencil' /> },
        { value: 'profile', label: 'Ver Perfil', icon: <FontAwesomeIcon icon='eye' /> },
        { value: 'disable', label: 'Desativar', icon: <FontAwesomeIcon icon='xmark-circle' />, red: true },
        { value: 'delete', label: 'Excluir', icon: <FontAwesomeIcon icon='trash' />, red: true },
    ];

    const handleAction = (action: string, barber: IUser) => {
        switch (action) {
            case 'edit':
                console.log('Edit barber:', barber._id);
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

    return (
        <>
            <div className={style.Container}>
                {
                    isAllowed ? (
                        <div className={style.PageContent}>
                            <div className={style.TopArea}>
                                <h1 className={style.Title}>Lista de Barbeiros</h1>
                                <button className={style.AddBarber}><FontAwesomeIcon icon='plus' /> Adicionar Barbeiro</button>
                            </div>
                            
                            <div className={style.TableContainer}>
                                <div className={style.TableHeader}>
                                    <div className={style.HeaderCell}>Foto</div>
                                    <div className={style.HeaderCell}>Nome</div>
                                    <div className={style.HeaderCell}>Email</div>
                                    <div className={style.HeaderCell}>Telefone</div>
                                    <div className={style.HeaderCell}>Status</div>
                                    <div className={style.HeaderCell}>Avaliação</div>
                                    <div className={style.HeaderCell}>Ações</div>
                                </div>

                                <div className={style.TableBody}>
                                    {barbers && barbers.map((barber: IUser) => {
                                        const statusInfo = calculateStatus(barber);
                                        const isExpanded = expandedBarber === barber._id;
                                        
                                        return (
                                            <div key={barber._id} className={style.TableRow} onClick={() => setExpandedBarber(isExpanded ? null : barber._id)}>
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
                                                                onChange={(value) => value && handleAction(value, barber)}
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
                                                                            {barber.work.services.map((service, index) => (
                                                                                <span key={index} className={style.ServiceTag}>
                                                                                    {service.name}
                                                                                </span>
                                                                            ))}
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
                                        );
                                    })}
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className={style.AccessDenied}>
                            <FontAwesomeIcon icon="lock" size="3x" />
                            <p>Você não tem permissão para acessar esta página.</p>
                        </div>
                    )
                }
            </div>
        </>
    )
}

export default BarbersList;