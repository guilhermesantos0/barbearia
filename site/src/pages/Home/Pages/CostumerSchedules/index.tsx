import style from './CostumerSchedules.module.scss'

import { useUser } from '@contexts/UserContext'
import ScheduledService from '@components/ScheduledService';

// @ts-ignore
import { ICostumer } from '@types/Costumer';
// @ts-ignore
import { IEmployee } from '@types/Employee';
// @ts-ignore
import { IScheduledService } from '@types/ScheduledService';

import { PlusIcon } from '@radix-ui/react-icons';

const CostumerSchedules = () => {

    const { user } = useUser();

    const isCostumer = (user: ICostumer | IEmployee): user is ICostumer => {
        return user.role === 0
    }

    return (
        <div className={style.Container}>
            {
                user && isCostumer(user) && (
                    <>
                        <h1 className={style.Welcome}>Olá, {user.name.split(' ')[0]}</h1>
                        <div className={style.InlineElements}>
                            <h3 className={style.Subtitle}>Confira seus agendamentos</h3>
                            <button className={style.ScheduleNew}><PlusIcon className={style.Icon} /> Agendar Serviço</button>
                        </div>
                        <div className={style.PageContent}>
                            {
                                user.history.length > 0 ? (
                                    <div className={style.UserServices}>
                                        {
                                            user.history.map((service: IScheduledService, idx: number) => (
                                                <>
                                                    {
                                                        service.status !== 'Finalizado' && (
                                                            <ScheduledService service={service} view="Costumer" key={idx} />
                                                        )
                                                    }
                                                </>
                                            ))
                                        }
                                    </div>
                                ) : (
                                    <></>
                                )                       
                            }
                        </div>
                    </>
                )
            }
        </div>
    )
}

export default CostumerSchedules