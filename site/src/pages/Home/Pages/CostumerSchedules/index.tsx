import style from './CostumerSchedules.module.scss'

import { useUser } from '../../../../contexts/UserContext'

const CostumerSchedules = () => {

    const { user } = useUser();

    

    return (
        <div className={style.Container}>
            {
                user && (
                    <>
                        <h1>Olá, {user.name.split(' ')[0]}</h1>
                        <h3>Confira seus agendamentos</h3>
                        {
                            
                        }
                    </>
                )
            }
        </div>
    )
}

export default CostumerSchedules