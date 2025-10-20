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
// @ts-ignore
import { formatPhoneNumber } from '@utils/formatPhoneNumber';
// @ts-ignore
import { formatDate } from '@utils/formatDate';
// @ts-ignore
import { formatPrice } from '@utils/formatPrice';
import AdminCustomer from '@components/Admin/AdminCustomer';
// @ts-ignore
import { IPlan } from '@types/Plan';

interface Plan {
    value: string,
    label: string
}

const CustomersList = () => {
    const { user } = useUser();
    const [isAllowed, setIsAllowed] = useState<boolean>(false);
    const [availablePlans, setAvailablePlans] = useState<Plan[]>([]);
    const [searchTerm, setSearchTerm] = useState<string>('');

    useEffect(() => {
        const fetchData = async () => {
            const roleTypeResult = await api.get(`/roles/${user?.role}/type`);
            const roleType = roleTypeResult.data;
            setIsAllowed(roleType === 'admin' || roleType === 'barbeiro-admin');
        };
        fetchData();
    }, [user]);

    const { data: customers } = useQuery({
        queryKey: ['allCustomers', user?.sub],
        queryFn: async () => {
            const customersResult = await api.get('/users/customers/admin');
            return customersResult.data;
        },
        enabled: isAllowed
    });

    const { data: plans } = useQuery({
        queryKey: ['allPlans', user?.sub],
        queryFn: async () => {
            const plansResult = await api.get('/plans/active');
            return plansResult.data
        },
        enabled: isAllowed
    });

    useEffect(() => {
        if (!plans || plans.length === 0) return


        const planOptions = plans.map((plan: IPlan) => ({
            value: plan._id,
            label: plan.name
        }));

        setAvailablePlans(planOptions)
    }, [plans])

    const filteredCustomers = customers?.filter((customer: IUser) => 
        customer.name.toLowerCase().includes(searchTerm.toLowerCase())
    ) || [];

    return (
        <div className={style.Container}>
            {
                isAllowed ? (
                    <div className={style.PageContent}>
                        <div className={style.AboveTable}>
                            <h1 className={style.Title}>Lista de Clientes</h1>

                            <div className={style.SearchContainer}>
                                <input
                                    type="text"
                                    placeholder="Buscar por nome..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className={style.SearchInput}
                                />
                            </div>
                        </div>

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
                                {/* { customers && customers.map((customer: IUser) => {
                                    const statusInfo = calculateStatus(customer);
                                    const isExpanded = expandedCustomer === customer._id;

                                    
                                }) } */}

                                {
                                    filteredCustomers && filteredCustomers.map((customer: IUser, idx: number) => (
                                        <AdminCustomer key={idx} customer={customer} plans={availablePlans} />
                                    ))
                                }

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