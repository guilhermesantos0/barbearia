import { useEffect, useState } from 'react';
import style from './CostumerEditProfile.module.scss';

// @ts-ignore
import { ICostumer } from '@types/Costumer';
// @ts-ignore
import { IEmployee } from '@types/Employee';

import api from '../../../../services/api';

import Camera from '@assets/icons/camera.svg?react';
import { LockClosedIcon } from '@radix-ui/react-icons';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import DatePickerComponent from '@components/DatePicker';
import { SelectMenu } from '@components/SelectMenu';

const CostumerEditProfile = () => {

    const [user, setUser] = useState<ICostumer | IEmployee | null>();

    const [formData, setFormData] = useState({
        name: null,
        phone: null,
        cpf: null,
        bornDate: null,
        gender: null
    })

    useEffect(() => {
        const fetchData = async () => {
            const result = await api.get('/costumers/me')
            setUser(result.data);
    
            setFormData({
                name: result.data.name,
                phone: result.data.phone,
                cpf: result.data.cpf,
                bornDate: result.data.bornDate,
                gender: result.data.gender
            })
        }

        fetchData();
    }, [])

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleGenderChange = (value: string | undefined) => {
        setFormData(prev => ({ ...prev, 'gender': value }));
    }

    return (
        <div className={style.Container}>
            <h1>Editar Perfil</h1>
            {
                user && (
                    <div className={style.PageContent}>
                        <div className={style.LeftContent}>
                            <div className={style.ProfilePicArea}>
                                <h2 className={style.Title}>Foto de Perfil</h2>
                                <img 
                                    src={user.profilePic ? `https://encrypted-tbn3.gstatic.com/images?q=tbn:ANd9GcTVaZB5EqMGvlzav8xSc8L71CA2L9p3q_yssFEuNKStFWKNzso9yQatqDAQAqmukB5JEgDlhVHqAIFPsTve5Ymvjf-jEAiIwue4E10soA` : 'https://i.pinimg.com/236x/08/35/0c/08350cafa4fabb8a6a1be2d9f18f2d88.jpg'} 
                                    alt={user.name} 
                                    className={style.ProfilePic}
                                    onError={(e) => {
                                        (e.target as HTMLImageElement).src = 'https://i.pinimg.com/236x/08/35/0c/08350cafa4fabb8a6a1be2d9f18f2d88.jpg';
                                    }}
                                />
                                <button className={style.UploadPhoto}><Camera className={style.Icon} /> Alterar Foto</button>
                            </div>
                            <div className={style.PrivacyArea}>
                                <button className={style.ChangePassword} ><LockClosedIcon className={style.Icon} /> Alterar Senha</button>
                                <button className={style.ChangeEmail}><FontAwesomeIcon icon={['far',"envelope"]} className={style.Icon} /> Alterar Email</button>
                                <button className={style.DeleteAccount}><FontAwesomeIcon icon="trash" className={`${style.Icon} ${style.Trash}`} /> Deletar Conta</button>
                            </div>
                        </div>
                        <div className={style.RightContent}>
                            <h2 className={style.Title}>Informações Pessoais</h2>
                            <form className={style.InputForm}>
                                    <div className={`${style.InputArea} ${style.Name}`}>
                                        <label htmlFor="name">Nome Completo</label>
                                        <input className={style.Input} type="text" value={formData.name} />
                                    </div>
                                    <div className={`${style.InputArea} ${style.PhoneNumber}`}>
                                        <label htmlFor="phone">Telefone</label>
                                        <input className={style.Input} type="phone" value={formData.phone} />
                                    </div>
                                    <div className={`${style.InputArea} ${style.Cpf}`}>
                                        <label htmlFor="cpf">CPF</label>
                                        <input className={style.Input} type="text" value={formData.cpf} />
                                    </div>
                                    <div className={`${style.InputArea} ${style.BirthDate}`}>
                                        <label htmlFor="birthdate">Data de Nascimento</label>
                                        <DatePickerComponent />
                                    </div>
                                    <div className={`${style.InputArea} ${style.Gender}`}>
                                        <label htmlFor="gender">Gênero</label>
                                        <SelectMenu className={style.Input} value={formData.gender || undefined} options={
                                            [
                                                { value: 'Masculino', label: 'Masculino'}, 
                                                { value: 'Feminino', label: 'Feminino' },
                                                { value: 'Outro', label: 'Outro' },
                                                { value: 'Prefiro não informar', label: 'Prefiro não informar' }
                                            ]}
                                            onChange={handleGenderChange}
                                            placeholder={formData.gender}
                                        />
                                        {/* <input type="text" name='gender' value={formData.gender} /> */}
                                    </div>
                            </form>
                            <div className={style.ButtonsArea}>
                                <button className={`${style.Button} ${style.SaveChanges}`}><FontAwesomeIcon icon={['far','floppy-disk']} /> Salvar Alterações</button>
                                <button className={`${style.Button} ${style.DiscardChanges}`}><FontAwesomeIcon icon='xmark' /> Cancelar</button>
                            </div>
                        </div>
                    </div>
                )
            }
        </div>
    )
}

export default CostumerEditProfile