import style from './SideBar.module.scss';

import { ChevronRightIcon, ExitIcon } from '@radix-ui/react-icons';

import { useUser } from '../../contexts/UserContext';
import * as Collapsible from '@radix-ui/react-collapsible';
import { useEffect, useState } from 'react';

import { useNavigate } from 'react-router-dom';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import Pencil from '@assets/icons/pencil.svg?react';
import Badge from '@assets/icons/badge.svg?react'
import ConfirmSchedule from '@assets/icons/confirm-schedule.svg?react';
import BarbersList from '@assets/icons/barbers-list.svg?react';

import { useQuery } from '@tanstack/react-query';

// @ts-ignore
import api from '@services/api';

interface Props {
    setOpenedTab: (tab: string) => void;
}

const Sidebar: React.FC<Props> = ({ setOpenedTab }) => {

    const [roleType, setRoleType] = useState<string>('');
    // const [unconfirmedSchedulesAmount, setUnconfirmedSchedulesAmount] = useState<number>(0);

    const { logout, user } = useUser()
    const [isExpanded, setIsExpanded] = useState(false);

    const navigate = useNavigate();

    useEffect(() => {
        if(!user) return

        const fetchData = async () => {
            const isBarberResult = await api.get(`/roles/${user?.role}/type`);
            setRoleType(isBarberResult.data);

            
        }

        
        fetchData()
        
    }, [user])

    const { data: unConfirmedSchedules } = useQuery({
        // @ts-ignore
        queryKey: ['unconfirmedSchedules', user?.sub],
        queryFn: async () => {
            const response = await api.get(`/scheduledservices/${(user as any).sub}/unconfirmed`);
            return response.data;
        },
        enabled: !!user && roleType === 'barbeiro'
    })

    return (
        <Collapsible.Root
        open={isExpanded}
        onOpenChange={setIsExpanded}
        className={`${style.Container} ${isExpanded ? style.Expanded : style.Collapsed}`}
        >

            <Collapsible.Trigger asChild>
                <div className={style.ToggleButton}>
                    <Collapsible.Content>
                        <span className={style.Label}>BarberPrime</span>
                    </Collapsible.Content>
                    <ChevronRightIcon className={`${style.Icon} ${style.ToggleIcon}`} />
                </div>
            </Collapsible.Trigger>

            <nav className={style.NavMenu}>
                {
                    user && roleType === 'cliente' && (
                        <ul className={style.NavList}>
                            <li className={style.Option} onClick={() => navigate('/home/cliente/agendamentos')}>
                                <FontAwesomeIcon icon={['far', 'calendar']} className={style.Icon} />
                                <Collapsible.Content asChild>
                                    <span className={style.Label}>Agendamentos</span>
                                </Collapsible.Content>
                            </li>

                            <li className={style.Option} onClick={() => navigate('/home/cliente/barbeiros-favoritos')}>
                                <FontAwesomeIcon icon={['far', 'user']} className={style.Icon} />
                                <Collapsible.Content asChild>
                                    <span className={style.Label}>Barbeiros Favoritos</span>
                                </Collapsible.Content>
                            </li>

                            <li className={style.Option} onClick={() => navigate('/home/cliente/historico')}>
                                <FontAwesomeIcon icon={['far', 'clock']} className={style.Icon} />
                                <Collapsible.Content asChild>
                                    <span className={style.Label}>Histórico</span>
                                </Collapsible.Content>
                            </li>

                            <li className={style.Option} onClick={() => navigate('/home/cliente/editar-perfil')}>
                                <Pencil className={`${style.Icon} ${style.Pencil}`} />
                                <Collapsible.Content asChild>
                                    <span className={style.Label}>Editar Perfil</span>
                                </Collapsible.Content>
                            </li>

                            <li className={style.Option} onClick={() => navigate('/home/cliente/assinaturas')}>
                                <Badge className={style.Icon} />
                                <Collapsible.Content asChild>
                                    <span className={style.Label}>Assinaturas</span>
                                </Collapsible.Content>
                            </li>
                        </ul>
                    )
                }

                {
                    user && roleType === 'barbeiro' && (
                        <ul className={style.NavList}>
                            <li className={style.Option} onClick={() => navigate('/home/barbeiro/confirmar-agendamentos')}>
                                <ConfirmSchedule className={`${style.Icon} ${style.Greater1}`} />
                                { unConfirmedSchedules?.length > 0 && (
                                    <div className={style.NotificationBadge}>
                                        {unConfirmedSchedules.length}
                                    </div>
                                )}
                                <Collapsible.Content asChild>
                                    <span className={style.Label}>Confirmar</span>
                                </Collapsible.Content>
                            </li>

                            <li className={style.Option} onClick={() => navigate('/home/barbeiro/agendamentos')}>
                                <FontAwesomeIcon icon={['far', 'calendar']} className={style.Icon} />
                                <Collapsible.Content asChild>
                                    <span className={style.Label}>Agendamentos</span>
                                </Collapsible.Content>
                            </li>

                            <li className={style.Option} onClick={() => navigate('/home/barbeiro/historico')}>
                                <FontAwesomeIcon icon={['far', 'clock']} className={style.Icon} />
                                <Collapsible.Content asChild>
                                    <span className={style.Label}>Histórico</span>
                                </Collapsible.Content>
                            </li>

                            <li className={style.Option} onClick={() => navigate('/home/barbeiro/estatisticas')}>
                                <FontAwesomeIcon icon='chart-column' className={style.Icon} />
                                <Collapsible.Content asChild>
                                    <span className={style.Label}>Estatísticas</span>
                                </Collapsible.Content>
                            </li>

                            <li className={style.Option} onClick={() => navigate('/home/barbeiro/editar-perfil')}>
                                <Pencil className={`${style.Icon} ${style.Pencil}`} />
                                <Collapsible.Content asChild>
                                    <span className={style.Label}>Editar Perfil</span>
                                </Collapsible.Content>
                            </li>
                        </ul>
                    )
                }

                {
                    user && roleType === 'admin' && (
                        <ul className={style.NavList}>
                            <li className={style.Option} onClick={() => navigate('/home/admin/estatisticas')}>
                                <FontAwesomeIcon icon='chart-line' className={style.Icon} />
                                <Collapsible.Content asChild>
                                    <span className={style.Label}>Estatísticas</span>
                                </Collapsible.Content>
                            </li>

                            <li className={style.Option} onClick={() => navigate('/home/admin/agendamentos')}>
                                <FontAwesomeIcon icon={['far', 'calendar']} className={style.Icon} />
                                <Collapsible.Content asChild>
                                    <span className={style.Label}>Agendamentos</span>
                                </Collapsible.Content>
                            </li>

                            <li className={style.Option} onClick={() => navigate('/home/admin/servicos')}>
                                <FontAwesomeIcon icon='scissors' className={style.Icon} />
                                <Collapsible.Content asChild>
                                    <span className={style.Label}>Seriços</span>
                                </Collapsible.Content>
                            </li>

                            <li className={style.Option} onClick={() => navigate('/home/admin/barbeiros')}>
                                <BarbersList className={style.Icon} />
                                <Collapsible.Content asChild>
                                    <span className={style.Label}>Barbeiros</span>
                                </Collapsible.Content>
                            </li>

                            <li className={style.Option} onClick={() => navigate('/home/admin/clientes')}>
                                <FontAwesomeIcon icon='users' className={style.Icon} />
                                <Collapsible.Content asChild>
                                    <span className={style.Label}>Clientes</span>
                                </Collapsible.Content>
                            </li>

                            <li className={style.Option} onClick={() => navigate('/home/admin/horarios')}>
                                <FontAwesomeIcon icon={['far', 'clock']} className={style.Icon} />
                                <Collapsible.Content asChild>
                                    <span className={style.Label}>Horários</span>
                                </Collapsible.Content>
                            </li>

                            <li className={style.Option} onClick={() => navigate('/home/admin/planos')}>
                                <Badge className={style.Icon} />
                                <Collapsible.Content asChild>
                                    <span className={style.Label}>Assinatura</span>
                                </Collapsible.Content>
                            </li>

                        </ul>
                    )
                }

                <div className={style.BottomOption} onClick={() => logout()}>
                    <ExitIcon className={style.Icon} />
                    <Collapsible.Content asChild>
                        <span className={style.Label}>Encerrar Sessão</span>
                    </Collapsible.Content>
                </div>
            </nav>
        </Collapsible.Root>
    )
}

export default Sidebar