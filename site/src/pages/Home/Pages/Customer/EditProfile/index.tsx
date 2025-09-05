import { useEffect, useState } from 'react';
import style from './EditProfile.module.scss';

// @ts-ignore
import { IUser } from '@types/User';

//@ts-ignore
import api from '@services/api';

import Camera from '@assets/icons/camera.svg?react';
import { LockClosedIcon } from '@radix-ui/react-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import DatePickerComponent from '@components/DatePicker';
import { SelectMenu } from '@components/SelectMenu';
import Log from '@components/Log';
import { formatDay } from '@utils/formatDay';
import { ISubscription } from '@types/Subscription';
import { formatDayNumbers } from '@utils/formatDayNumbers';

const CostumerEditProfile = () => {
    const [originalUserData, setOriginalUserData] = useState<IUser | null>(null);
    const [userData, setUserData] = useState<IUser | null>(null);

    const [userSubscriptions, setUserSubscription] = useState<ISubscription | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            const result = await api.get('/users/me');
            const userLogsResult = await api.get(`/logs/${result.data._id}`);
            const userSubscriptionResult = await api.get('/users/plan')

            const user = {
                ...result.data,
                logs: userLogsResult.data,
                subscription: userSubscriptionResult.data
            };

            console.log(user)

            setUserData(user);
            setOriginalUserData(user);
        };

        fetchData();
    }, []);

    const handleChange = (field: keyof IUser, value: any) => {
        setUserData((prev) => (prev ? { ...prev, [field]: value } : prev));
    };

    return (
        <div className={style.Container}>
            <h1>Editar Perfil</h1>
            {userData && (
                <>
                    <div className={style.PageContent}>
                        <div className={style.LeftContent}>
                            <div className={style.ProfilePicArea}>
                                <h2 className={style.Title}>Foto de Perfil</h2>
                                <img
                                    src={
                                        userData.profilePic
                                            ? userData.profilePic
                                            : 'https://i.pinimg.com/236x/08/35/0c/08350cafa4fabb8a6a1be2d9f18f2d88.jpg'
                                    }
                                    alt={userData.name}
                                    className={style.ProfilePic}
                                    onError={(e) => {
                                        (e.target as HTMLImageElement).src =
                                            'https://i.pinimg.com/236x/08/35/0c/08350cafa4fabb8a6a1be2d9f18f2d88.jpg';
                                    }}
                                />
                                <button className={style.UploadPhoto}>
                                    <Camera className={style.Icon} /> Alterar Foto
                                </button>
                            </div>
                            <div className={style.PrivacyArea}>
                                <button className={style.ChangePassword}>
                                    <LockClosedIcon className={style.Icon} /> Alterar Senha
                                </button>
                                <button className={style.ChangeEmail}>
                                    <FontAwesomeIcon icon={['far', 'envelope']} className={style.Icon} /> Alterar Email
                                </button>
                                <button className={style.DeleteAccount}>
                                    <FontAwesomeIcon icon="trash" className={`${style.Icon} ${style.Trash}`} /> Deletar Conta
                                </button>
                            </div>
                        </div>

                        <div className={style.RightContent}>
                            <h2 className={style.Title}>Informações Pessoais</h2>
                            <div className={style.InputForm}>
                                <div className={`${style.InputArea} ${style.Name}`}>
                                    <label htmlFor="name">Nome Completo</label>
                                    <input
                                        className={style.Input}
                                        type="text"
                                        value={userData.name ?? ''}
                                        onChange={(e) => handleChange('name', e.target.value)}
                                    />
                                </div>
                                <div className={`${style.InputArea} ${style.PhoneNumber}`}>
                                    <label htmlFor="phone">Telefone</label>
                                    <input
                                        className={style.Input}
                                        type="tel"
                                        value={userData.phone ?? ''}
                                        onChange={(e) => handleChange('phone', e.target.value)}
                                    />
                                </div>
                                <div className={`${style.InputArea} ${style.Cpf}`}>
                                    <label htmlFor="cpf">CPF</label>
                                    <input
                                        className={style.Input}
                                        type="text"
                                        value={userData.cpf ?? ''}
                                        onChange={(e) => handleChange('cpf', e.target.value)}
                                    />
                                </div>
                                <div className={`${style.InputArea} ${style.BirthDate}`}>
                                    <label htmlFor="birthdate">Data de Nascimento</label>
                                    <DatePickerComponent
                                        defaultValue={userData.bornDate ? new Date(userData.bornDate) : undefined}
                                        onChange={(val) => handleChange('bornDate', val)}
                                    />
                                </div>
                                <div className={`${style.InputArea} ${style.Gender}`}>
                                    <label htmlFor="gender">Gênero</label>
                                    <SelectMenu
                                        className={style.Input}
                                        value={userData.gender || undefined}
                                        options={[
                                            { value: 'Masculino', label: 'Masculino' },
                                            { value: 'Feminino', label: 'Feminino' },
                                            { value: 'Outro', label: 'Outro' },
                                            { value: 'Prefiro não informar', label: 'Prefiro não informar' },
                                        ]}
                                        onChange={(val) => handleChange('gender', val)}
                                    />
                                </div>
                            </div>

                            <div className={style.ButtonsArea}>
                                <button className={`${style.Button} ${style.SaveChanges}`}>
                                    <FontAwesomeIcon icon={['far', 'floppy-disk']} /> Salvar Alterações
                                </button>
                                <button className={`${style.Button} ${style.DiscardChanges}`}>
                                    <FontAwesomeIcon icon="xmark" /> Cancelar
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className={style.PersonalDashboard}>
                        <h2>Painel Pessoal</h2>
                        <div className={style.Infos}>
                            <div className={style.Card}>
                                <div className={style.TopArea}>
                                    <FontAwesomeIcon className={style.Icon} icon="crown" />
                                    <p className={style.PlanStatus}>ATIVO</p>
                                </div>
                                <div className={style.CardDetails}>
                                    <h3 className={style.CardTitle}>{userData?.subscription?.planId?.name}</h3>
                                    <h4 className={style.CardText}>Válido até {formatDayNumbers(userData.subscription.endDate)}</h4>
                                </div>
                            </div>

                            <div className={style.Card}>
                                <div className={style.TopArea}>
                                    <FontAwesomeIcon className={style.Icon} icon="calendar" />
                                </div>
                                <div className={style.CardDetails}>
                                    <h3 className={style.CardTitle}>Membro Desde</h3>
                                    <h4 className={style.CardText}>{formatDay(userData.createdAt)}</h4>
                                </div>
                            </div>

                            <div className={style.Card}>
                                <div className={style.TopArea}>
                                    <FontAwesomeIcon className={style.Icon} icon="chart-line" />
                                </div>
                                <div className={style.CardDetails}>
                                    <h3 className={style.CardTitle}>Total de Serviços</h3>
                                    <h4 className={style.CardText}>{userData.history.length} Completos</h4>
                                </div>
                            </div>

                            <div className={style.Logs}>
                                {userData.logs &&
                                    userData.logs.map((log, idx) => <Log key={idx} data={log} />)}
                            </div>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};

export default CostumerEditProfile;
