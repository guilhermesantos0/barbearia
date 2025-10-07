import { IUser } from '@types/User';
import style from './AdminCustomer.module.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { formatPhoneNumber } from '@utils/formatPhoneNumber';
import { formatDate } from '@utils/formatDate';
import { SelectMenu } from '@components/SelectMenu';
import { useState } from 'react';
import { formatPrice } from '@utils/formatPrice';
import { IScheduledService } from '@types/ScheduledService';
import Modal from '@components/Modal';
import Camera from '@assets/icons/camera.svg?react';
import { ISubscription } from '@types/Subscription';
import DatePicker from '@components/DatePicker';
import api from '@services/api';
import { toast } from 'react-toastify';

interface Plan {
    value: string,
    label: string
}

interface AdminCustomerProps {
    customer: IUser;
    plans: Plan[];
}

const AdminCustomer: React.FC<AdminCustomerProps> = ({ customer, plans }) => {

    const [isExpanded, setIsExpanded] = useState<boolean>(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false);

    const [editingData, setEditingData] = useState<{
        name: string,
        phone: string,
        gender: string,
        bornDate: Date,
        profilePic: string,
        subscription: string
    }>({
        name: customer.name,
        phone: customer.phone,
        gender: customer.gender,
        bornDate: customer.bornDate,
        profilePic: customer.profilePic,
        //@ts-ignore
        subscription: customer.subscription?.planId?._id ?? undefined
    })

    const calculateStatus = (customer: IUser) => {
        if (!customer.history || customer.history.length === 0) {
            return { status: 'Inativo', color: 'red' };
        }

        const lastService = customer.history.reduce((latest, current) =>
            new Date(current.date) > new Date(latest.date) ? current : latest
        );

        const lastServiceDate = new Date(lastService.date);
        const now = new Date();
        const daysDiff = Math.floor((now.getTime() - lastServiceDate.getTime()) / (1000 * 60 * 60 * 24));

        if (daysDiff <= 14) {
            return { status: 'Ativo', color: 'green' };
        } else if (daysDiff <= 30) {
            return { status: 'Moderado', color: 'yellow' };
        } else {
            return { status: 'Inativo', color: 'red' };
        }
    };

    const actionOptions = [
        { value: 'edit', label: 'Editar', icon: <FontAwesomeIcon icon='pencil' /> },
        { value: 'profile', label: 'Ver Perfil', icon: <FontAwesomeIcon icon='eye' /> },
        { value: 'block', label: 'Bloquear', icon: <FontAwesomeIcon icon='ban' />, red: true },
    ];

    const handleAction = (action: string) => {
        switch (action) {
            case 'edit':
                setIsEditModalOpen(true);
                break;
            case 'profile':
                console.log('View profile:', customer._id);
                break;
            case 'block':
                console.log('View profile:', customer._id);
                break;
        }
    };

    const handleEditName = (newName: string) => {
        setEditingData(prev => ({ ...prev, name: newName }));
    }

    const handleEditPhone = (newPhone: string) => {
        setEditingData(prev => ({ ...prev, phone: newPhone }));
    }

    const handleEditGender = (newGender: string | undefined) => {
        setEditingData(prev => ({ ...prev, gender: newGender ?? ''}))
    }

    const handleEditBornDate = (newDate: Date) => {
        setEditingData(prev => ({ ...prev, bornDate: newDate }));
    }

    const handleEditSubscription = (newSubscription: string) => {
        setEditingData(prev => ({ ...prev, subscription: newSubscription }))
    }

    const handleSave = async () => {
        setIsEditModalOpen(false);
        try {
            let updatedSubscription = false;

            // @ts-ignore
            if (customer.subscription.planId._id !== editingData.subscription) { updtedSubscription = true }

            const updateResult = await api.patch(`/users/${customer._id}?updatedSubscription=${updatedSubscription}`);
            
            if (updateResult.status === 200) {
                toast.success(`${customer.name} atualizado com sucesso!`)
            } else {
                toast.error('Houve um erro ao atualizar o usuário!')
            }
        } catch {
            toast.error('Houve um erro ao atualizaro o usuário!')
        }
    }

    const statusInfo = calculateStatus(customer);

    return (
        <>
            <div key={customer._id} className={style.TableRow} onClick={() => setIsExpanded(!isExpanded)}>
                <div className={style.RowContent}>
                    <div className={style.Cell}>
                        <div className={style.ProfilePic}>
                            {customer.profilePic ? (
                                <img src={customer.profilePic} alt={customer.name} />
                            ) : (
                                <FontAwesomeIcon icon="user" />
                            )}
                        </div>
                    </div>

                    <div className={style.Cell}>
                        <span className={style.BarberName}>{customer.name}</span>
                    </div>

                    <div className={style.Cell}>
                        <span className={style.Email}>{customer.email}</span>
                    </div>

                    <div className={style.Cell}>
                        <span className={style.Phone}>{formatPhoneNumber(customer.phone)}</span>
                    </div>

                    <div className={style.Cell}>
                        <span className={`${style.Status} ${style[statusInfo.color]}`}>
                            {statusInfo.status}
                        </span>
                    </div>

                    <div className={style.Cell}>
                        <span className={style.Email}>{formatDate(customer.createdAt)}</span>
                    </div>

                    <div className={style.Cell}>
                        <div className={style.Actions} onClick={(e) => e.stopPropagation()}>
                            <SelectMenu
                                options={actionOptions}
                                placeholder=""
                                value=""
                                onChange={(value) => value && handleAction(value)}
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
                                <div className={style.Header}>
                                    <div>
                                        <h4>Resumo de Agendamentos ({customer.history ? customer.history.length : 0})</h4>
                                        <div className={style.SummaryRow}>
                                            <div className={style.SummaryItem}>
                                                <FontAwesomeIcon icon="calendar-check" />
                                                <span>{customer.history ? customer.history.length : 0} agendamentos</span>
                                            </div>
                                            <div className={style.SummaryItem}>
                                                <FontAwesomeIcon icon="coins" />
                                                <span>{formatPrice((customer.history || []).reduce((acc: number, s: IScheduledService) => acc + (s.service?.price || 0) - (s.discountApplied || 0), 0))}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className={style.RightHeader}>
                                        <h4>Assinatura</h4>
                                        <div className={style.SummaryItem}>
                                            {
                                                customer.subscription ? (
                                                    <div>
                                                        <FontAwesomeIcon icon='crown' />
                                                        {
                                                            // @ts-ignore
                                                            customer.subscription.planId.name
                                                        }
                                                    </div>
                                                ) : (
                                                    <div>Nada</div>
                                                )
                                            }
                                        </div>
                                    </div>
                                </div>
                                {customer.history && customer.history.length > 0 ? (
                                    <div className={style.ServicesList}>
                                        {customer.history.slice(0, 5).map((appt: IScheduledService) => (
                                            <div key={appt._id} className={style.IntervalItem}>
                                                <span className={style.IntervalName}>
                                                    {formatDate(appt.date)}
                                                </span>
                                                <span className={style.IntervalTime}>
                                                    {appt.service?.name || '-'} · {appt.barber?.name || '-'} · {appt.status}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <p>Nenhum agendamento</p>
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </div>

            <Modal open={isEditModalOpen} onOpenChange={setIsEditModalOpen} trigger={<></>} >
                <h3>Editar {customer.name}</h3>
                <div className={style.ProfilePicContainer}>
                    {customer.profilePic ? (
                        <img src={customer.profilePic} alt={customer.name} />
                    ) : (
                        <FontAwesomeIcon icon="user" />
                    )}

                    <button className={style.UploadPhoto}>
                        <Camera className={style.Icon} /> Alterar Foto
                    </button>
                </div>

                <div className={style.EditForm}>
                    <div className={`${style.InputContainer} ${style.Name}`}>
                        <label htmlFor="customerName">Nome</label>
                        <input type="text" id='customerName' value={editingData.name} onChange={(e) => handleEditName(e.target.value)} />
                    </div>

                    <div className={`${style.InputContainer} ${style.Phone}`}>
                        <label htmlFor="customerPhone">Telefone</label>
                        <input type="text" id='customerPhone' value={formatPhoneNumber(editingData.phone)} onChange={(e) => handleEditPhone(e.target.value)} />
                    </div>

                    <div className={`${style.InputContainer} ${style.Gender}`}>
                        <label htmlFor="customerGender">Sexo</label>
                        <SelectMenu
                            className={style.Input}
                            value={editingData.gender || undefined}
                            options={[
                                { value: 'Masculino', label: 'Masculino' },
                                { value: 'Feminino', label: 'Feminino' },
                                { value: 'Outro', label: 'Outro' },
                                { value: 'Prefiro não informar', label: 'Prefiro não informar' },
                            ]}
                            onChange={(val) => handleEditGender(val)}
                        />
                    </div>

                    <div className={`${style.InputContainer} ${style.bornDate}`}>
                        <label htmlFor="customerBornDate">Data de Nascimento</label>
                        <DatePicker 
                            defaultValue={new Date(editingData.bornDate)}
                            onChange={handleEditBornDate}
                        />
                    </div>

                    <div className={`${style.InputContainer} ${style.Subscription}`}>
                        <label htmlFor="customerSubscription">Assinatura</label>
                        <SelectMenu
                            options={plans}
                            value={editingData.subscription}
                            onChange={handleEditSubscription}
                            freePosition
                        >

                        </SelectMenu>
                    </div>
                </div>

                <div className={style.ButtonWrapper}>
                    <button className={style.ResetPassword}><FontAwesomeIcon icon='lock' /> Resetar Senha</button>
                    <button className={style.Save}><FontAwesomeIcon icon='save' /> Salvar</button>
                </div>

            </Modal>
        </>
    )
}

export default AdminCustomer;