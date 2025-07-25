import style from './CostumerSchedules.module.scss'

import { useUser } from '@contexts/UserContext'

import ScheduledService from '@components/ScheduledService';

import { ICostumer } from '@types/Costumer';
import { IEmployee } from '@types/Employee';
import { IScheduledService } from '@types/ScheduledService';

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
                        <h1>Olá, {user.name.split(' ')[0]}</h1>
                        <h3>Confira seus agendamentos</h3>
                        {
                            user.history.length > 0 ? (
                                <>
                                    {
                                        user.history.map((service: IScheduledService, idx: number) => (
                                            <ScheduledService service={service} view="Costumer" key={idx} />
                                        ))
                                    }
                                </>
                            ) : (
                                <></>
                            )                       
                        }
                    </>
                )
            }
        </div>
    )
}

export default CostumerSchedules