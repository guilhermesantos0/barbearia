import { useUser } from '@contexts/UserContext';
import style from './CustomersList.module.scss';
import { useEffect, useState } from 'react';
// @ts-ignore
import api from '@services/api';
import { useQuery } from '@tanstack/react-query';
// @ts-ignore
import { IUser } from '@types/User';
// @ts-ignore
import { IScheduledService } from '@types/ScheduledService';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { SelectMenu } from '@components/SelectMenu';
// @ts-ignore
import { formatPhoneNumber } from '@utils/formatPhoneNumber';
// @ts-ignore
import { formatDate } from '@utils/formatDate';
// @ts-ignore
import { formatPrice } from '@utils/formatPrice';

const CustomersList = () => {
    const { user } = useUser();
    const [isAllowed, setIsAllowed] = useState<boolean>(false);
    const [expandedCustomer, setExpandedCustomer] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            const roleTypeResult = await api.get(`/roles/${user?.role}/type`);
            const roleType = roleTypeResult.data;
            setIsAllowed(roleType === 'admin' || roleType === 'barbeiro-admin');
        };
        fetchData();
    }, [user]);

    const { data: customers } = useQuery({
        queryKey: ['allCustomers', user?._id],
        queryFn: async () => {
            const customersResult = await api.get('/users/customers/admin');
            return customersResult.data;
        },
        enabled: isAllowed
    });

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
        { value: 'disable', label: 'Desativar', icon: <FontAwesomeIcon icon='xmark-circle' /> },
        { value: 'delete', label: 'Excluir', icon: <FontAwesomeIcon icon='trash' /> },
        { value: 'profile', label: 'Ver Perfil', icon: <FontAwesomeIcon icon='eye' /> }
    ];

    const handleAction = (action: string, customer: IUser) => {
        switch (action) {
            case 'edit':
                console.log('Edit customer:', customer._id);
                break;
            case 'disable':
                console.log('Disable customer:', customer._id);
                break;
            case 'delete':
                console.log('Delete customer:', customer._id);
                break;
            case 'profile':
                console.log('View profile:', customer._id);
                break;
        }
    };

    return (
        <div className={style.Container}>
            {
                isAllowed ? (
                    <div className={style.PageContent}>
                        <h1 className={style.Title}>Lista de Clientes</h1>

                        <div className={style.TableContainer}>
                            <div className={style.TableHeader}>
                                <div className={style.HeaderCell}>Foto</div>
                                <div className={style.HeaderCell}>Nome</div>
                                <div className={style.HeaderCell}>Email</div>
                                <div className={style.HeaderCell}>Telefone</div>
                                <div className={style.HeaderCell}>Status</div>
                                <div className={style.HeaderCell}>Cadastrado</div>
                                <div className={style.HeaderCell}>Ações</div>
                            </div>
                            <div className={style.TableBody}>
                                { customers && customers.map((customer: IUser) => {
                                    const statusInfo = calculateStatus(customer);
                                    const isExpanded = expandedCustomer === customer._id;

                                    return (
                                        <div key={customer._id} className={style.TableRow} onClick={() => setExpandedCustomer(isExpanded ? null : customer._id)}>
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
                                                            onChange={(value) => value && handleAction(value, customer)}
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
                                    )
                                }) }

                            </div>
                        </div>

                    </div>
                ) : (
                    <div className={style.AccessDenied}>
                        <FontAwesomeIcon icon="lock" size="3x" />
                        <p>Você não tem permissão para acessar esta página.</p>
                    </div>
                )
            }
        </div>
    )
}

export default CustomersList;