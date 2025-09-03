import { useEffect, useState } from 'react';
import style from './EditProfile.module.scss';
import { IUser } from '@types/User';
import { IService } from '@types/Service';
import api from '@services/api';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const EditProfile = () => {

    const [userData, setUserData] = useState<IUser>();
    const [services, setServices] = useState<IService[]>();

    useEffect(() => {
        const fetchData = async () => {
            const userResult = await api.get('/users/me');
            const servicesResult = await api.get('/services');

            setUserData(userResult.data);
            setServices(servicesResult.data);
        }

        fetchData();
    })

    const calcAge = (bornDate: Date): number => {
        const today = new Date();
        const birthDate = new Date(bornDate);

        let age = today.getFullYear() - birthDate.getFullYear();

        const acutalMonth = today.getMonth();
        const actualDate = today.getDate();

        const birthMonth = birthDate.getMonth();
        const birthDay = birthDate.getDate();

        if (acutalMonth < birthMonth || (acutalMonth === birthMonth && actualDate < birthDay)) {
            age--;
        }

        return age;
    }

    const daysOfWeek = ['segunda-feira','terça-feira','quarta-feira','quinta-feira','sexta-feira','sábado','domingo'];

    return (
        <div className={style.Container}>
            <h1>Editar Perfil</h1>
            {
                userData && (
                    <div className={style.PageContent}>
                        <div className={style.TopArea}>
                            <img src={userData.profilePic} alt={userData.name} />

                            <div className={style.MiddleSection}>
                                <div className={style.TopInfos}>
                                    <h2 className={style.Name}>{userData.name}</h2>
                                    <h3 className={style.Age}>{calcAge(userData.bornDate)} anos</h3>
                                </div>
                                
                                <div className={style.BottomInfos}>
                                    <p className={style.Info}><FontAwesomeIcon className={style.LabelIcon} icon='envelope' />{userData.email}<FontAwesomeIcon className={style.ValueIcon} icon='pencil' /></p>
                                    <p className={style.Info}><FontAwesomeIcon className={style.LabelIcon} icon='phone' />{userData.phone}<FontAwesomeIcon className={style.ValueIcon} icon='pencil' /></p>
                                </div>
                            </div>

                            <div className={style.RightSection}>
                                <button className={`${style.Button} ${style.Save}`}><FontAwesomeIcon icon='save' /> Salvar Alterações</button>
                                <button className={`${style.Button} ${style.Cancel}`}><FontAwesomeIcon icon='xmark-circle' /> Cancelar</button>
                            </div>
                        </div>
                        <div className={style.BottomArea}>
                            <div className={style.Section}>
                                <h3>Dias da Semana</h3>
                                <div className={style.Checkboxes}>
                                    {
                                        daysOfWeek.map((day, idx) => (
                                            <label key={idx} className={style.Checkbox} >
                                                <input 
                                                    type="checkbox"
                                                    checked={userData.work?.days.includes(day)} 
                                                />
                                                {day.toLowerCase().split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join('-')}
                                            </label>
                                        ))
                                    }
                                </div>
                            </div>

                            <div className={style.Section}>
                                <h3>Horários de Atendimento</h3>
                                <div className={style.Times}>
                                    <div className={style.Default}>
                                        <span className={style.Time}><p className={style.Label}>Entrada</p> <p className={style.Value}>{userData.work?.time.start}</p></span>
                                        <span className={style.Time}><p className={style.Label}>Saída</p> <p className={style.Value}>{userData.work?.time.end}</p></span>
                                    </div>
                                    <div className={style.Intervals}>
                                        {
                                            userData.work?.time.intervals.map((interval, idx) => (
                                                <div className={style.Interval}>
                                                    <h4>{interval.name}</h4>
                                                    <div className={style.TimesShow}>

                                                    </div>
                                                </div>        
                                            ))
                                        }
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )
            }
        </div>
    )
}

export default EditProfile;