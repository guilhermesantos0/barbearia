import { useUser } from '@contexts/UserContext';
import style from './Services.module.scss';
import { useEffect, useMemo, useState } from 'react';
import api from '@services/api';
import { useQuery } from '@tanstack/react-query';
import { IService } from '@types/Service';
import AdminService from '@components/AdminService';
import { SelectMenu } from '@components/SelectMenu';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const AdminServices = () => {
    const { user } = useUser();
    const [isAllowed, setIsAllowed] = useState<boolean>(false);

    const [filterStatus, setFilterStatus] = useState<string | undefined>();
    const [filterCategory, setFilterCategory] = useState<string | undefined>();

    useEffect(() => {
        const fetchData = async () => {
            if (!user) return;
            const roleTypeResult = await api.get(`/roles/${user.role}/type`);
            const roleType = roleTypeResult.data;
            setIsAllowed(roleType === 'admin' || roleType === 'barbeiro-admin');
        };
        fetchData();
    }, [user]);

    const { data: allServices } = useQuery<IService[]>({
        queryKey: ['allServices', user?.sub],
        queryFn: async () => {
            const allServicesResult = await api.get('/services');
            return allServicesResult.data;
        },
        enabled: isAllowed
    });

    const filteredServices = useMemo(() => {
        if (!allServices) return [];

        let updated = [...allServices];

        if (filterStatus) {
            updated = updated.filter(service =>
                filterStatus === 'Ativo' ? service.active : !service.active
            );
        }

        if (filterCategory) {
            updated = updated.filter(service => service.category === filterCategory);
        }

        return updated;
    }, [allServices, filterStatus, filterCategory]);

    const filters = [
        {
            placeholder: 'Status',
            value: filterStatus,
            onChange: (value: string | undefined) => setFilterStatus(value),
            options: [
                { value: 'Ativo', label: 'Ativo' },
                { value: 'Inativo', label: 'Inativo' }
            ]
        },
        {
            placeholder: 'Categoria',
            value: filterCategory,
            onChange: (value: string | undefined) => setFilterCategory(value),
            options: [
                { value: 'hair_services', label: 'Cabelo' },
                { value: 'beard_services', label: 'Barba' },
                { value: 'stetic_services', label: 'Estética' },
                { value: 'combo_services', label: 'Combo' },
                { value: 'other_services', label: 'Outros' }
            ]
        }
    ];

    return (
        <div className={style.Container}>
            {isAllowed ? (
                <div className={style.PageContent}>
                    <h1>Serviços disponíveis</h1>
                    <div className={style.Options}>
                        {filters.map((filter, index) => (
                            <SelectMenu
                                key={index}
                                placeholder={filter.placeholder}
                                value={filter.value}
                                onChange={filter.onChange}
                                options={filter.options}
                                className={style.SelectMenu}
                            />
                        ))}

                        <button className={style.AddService}>
                            <FontAwesomeIcon icon="plus" /> Adicionar Serviço
                        </button>
                    </div>
                    <div className={style.ServicesWrapper}>
                        <div className={style.Services}>
                            {filteredServices && filteredServices.length > 0 ? (
                                filteredServices.map((service, idx) => (
                                    <AdminService key={idx} service={service} />
                                ))
                            ) : (
                                <div>Nenhum serviço criado</div>
                            )}
                        </div>
                    </div>
                </div>
            ) : (
                <p>Você não vai achar nada aqui...</p>
            )}
        </div>
    );
};

export default AdminServices;
