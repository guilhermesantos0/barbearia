import style from './SideBar.module.scss';

import { ChevronLeftIcon, CalendarIcon, AvatarIcon, ClockIcon, Pencil1Icon, BadgeIcon } from '@radix-ui/react-icons';

import { useUser } from '../../contexts/UserContext';

const Sidebar = () => {

    const { user } = useUser()

    return (
        <div className={style.Container}>
            {
                user && (
                    <>
                        <div className={style.TopSection}> 
                            <span className={style.HiddenText}>BarberPrime</span>
                            <ChevronLeftIcon />
                        </div>
                        <div className={style.MiddleSection}>
                            {
                                user?.role === 0 && (
                                    <ul className={style.MenuItems}>
                                        <li className={style.Option}><CalendarIcon /> <span className={style.HiddenText}>Agendamentos</span></li>
                                        <li className={style.Option}><AvatarIcon /> <span className={style.HiddenText}>Barbeiros Favoritos</span></li>
                                        <li className={style.Option}><ClockIcon /> <span className={style.HiddenText}>Histórico</span></li>
                                        <li className={style.Option}><Pencil1Icon /> <span className={style.HiddenText}>Editar Perfil</span></li>
                                        <li className={style.Option}><BadgeIcon /> <span className={style.HiddenText}>Assinatura</span></li>                    
                                    </ul>
                                )
                            }
                        </div>
                    </>
                )
            }
        </div>
    )
}

export default Sidebar