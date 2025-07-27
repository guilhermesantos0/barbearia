import style from './SideBar.module.scss';

import { ChevronRightIcon, CalendarIcon, AvatarIcon, ClockIcon, Pencil1Icon, BadgeIcon, ExitFullScreenIcon, ChevronLeftIcon, DashboardIcon, ExitIcon } from '@radix-ui/react-icons';

import { useUser } from '../../contexts/UserContext';
import * as Collapsible from '@radix-ui/react-collapsible';
import { useState } from 'react';

import { useNavigate } from 'react-router-dom';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import Pencil from '../../assets/icons/pencil.svg?react';
import Badge from '../../assets/icons/badge.svg?react'

interface Props {
    setOpenedTab: (tab: string) => void;
}

const Sidebar: React.FC<Props> = ({ setOpenedTab }) => {

    const { user } = useUser()
    const [isExpanded, setIsExpanded] = useState(false);

    const navigate = useNavigate();

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
                    user && user.role === 0 && (
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
                                {/* <Pencil1Icon className={style.Icon} />
                                <FontAwesomeIcon icon="pencil-alt" /> */}
                                <Pencil className={`${style.Icon} ${style.Pencil}`} />
                                <Collapsible.Content asChild>
                                    <span className={style.Label}>Editar Perfil</span>
                                </Collapsible.Content>
                            </li>

                            <li className={style.Option} onClick={() => navigate('/home/cliente/assinaturas')}>
                                {/* <BadgeIcon className={style.Icon} /> */}
                                <Badge className={style.Icon} />
                                <Collapsible.Content asChild>
                                    <span className={style.Label}>Assinaturas</span>
                                </Collapsible.Content>
                            </li>
                        </ul>

                    )
                }

                <div className={style.BottomOption}>
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