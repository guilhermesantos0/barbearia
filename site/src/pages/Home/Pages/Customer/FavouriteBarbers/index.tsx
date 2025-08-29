import { useEffect, useState } from 'react';
import style from './FavouriteBarbers.module.scss';
import { useUser } from '@contexts/UserContext';

// @ts-ignore
import { IUser } from '@types/User';
//@ts-ignore
import api from '@services/api';

interface IServiceCount {
    [serviceName: string]: number;
}

interface IBarberHistory {
    id: string;
    name: string;
    profilePic: string;
    totalServices: number;
    services: IServiceCount;
    mostUsedService: {
        name: string;
        count: number;
    };
}

const CostumerFavouriteBarbers = () => {
    const [user, setUser] = useState<IUser | null>();

    useEffect(() => {
        const fetchData = async () => {
            const result = await api.get('/users/me')
            setUser(result.data);
        }

        fetchData();
    }, [])

    const [favouriteBarbers, setFavouriteBarbers] = useState<IBarberHistory[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (!user || user.role !== 0) {
            setFavouriteBarbers([]);
            setIsLoading(false);
            return;
        }

        const processBarberHistory = () => {
            try {
                
                if (!user.history || !Array.isArray(user.history)) {
                    setFavouriteBarbers([]);
                    return;
                }

                const barberHistorys: Record<string, IBarberHistory> = {};

                user.history.forEach((service) => {
                    if (!service?.barber || !service?.service) return;

                    const barberId = service.barber._id;
                    const serviceName = service.service.name;

                    if (barberHistorys[barberId]) {
                        barberHistorys[barberId].totalServices++;
                        barberHistorys[barberId].services[serviceName] = 
                            (barberHistorys[barberId].services[serviceName] || 0) + 1;
                    } else {
                        barberHistorys[barberId] = {
                            id: barberId,
                            name: service.barber.name,
                            profilePic: service.barber.profilePic,
                            totalServices: 1,
                            services: { [serviceName]: 1 },
                            mostUsedService: {
                                name: serviceName,
                                count: 1
                            }
                        };
                    }

                    const currentCount = barberHistorys[barberId].services[serviceName];
                    if (currentCount > barberHistorys[barberId].mostUsedService.count) {
                        barberHistorys[barberId].mostUsedService = {
                            name: serviceName,
                            count: currentCount
                        };
                    }
                });

                const sortedBarbers = Object.values(barberHistorys)
                    .sort((a, b) => b.totalServices - a.totalServices);

                setFavouriteBarbers(sortedBarbers);
            } catch (error) {
                console.error('Error processing favorite barbers:', error);
                setFavouriteBarbers([]);
            } finally {
                setIsLoading(false);
            }
        };

        processBarberHistory();
    }, [user]);

    if (isLoading) {
        return (
            <div className={style.Container}>
                <h1 className={style.Title}>Barbeiros Favoritos</h1>
                <p>Carregando...</p>
            </div>
        );
    }

    return (
        <div className={style.Container}>
            <h1 className={style.Title}>Barbeiros Favoritos</h1>

            {
                favouriteBarbers.length > 0 ? (
                    <table className={style.Table}>
                        <colgroup>
                            <col span={1} className={style.FirstCol} />
                        </colgroup>
                        <thead>
                            <tr>
                                <th>Foto</th>
                                <th>Nome</th>
                                <th>Serviço Favorito</th>
                                <th>Total de Serviços</th>
                            </tr>
                        </thead>
                        <tbody className={style.TableData}>
                            {favouriteBarbers.map((barber, idx) => (
                                <tr key={barber.id}>
                                    <td className={style.DataFirstCol}>
                                        <p>{idx + 1}°</p>
                                        <a href="">
                                            <img 
                                                src={barber.profilePic} 
                                                alt={barber.name} 
                                                className={style.ProfilePic}
                                                onError={(e) => {
                                                    (e.target as HTMLImageElement).src = 'https://i.pinimg.com/236x/08/35/0c/08350cafa4fabb8a6a1be2d9f18f2d88.jpg';
                                                }}
                                            />
                                        </a>
                                    </td>
                                    <td><a href="">{barber.name}</a></td>
                                    <td>{barber.mostUsedService.name}</td>
                                    <td>{barber.totalServices}</td>
                                </tr>
                            ))}  
                        </tbody>
                    </table>
                ) : (
                    <p className={style.NoResults}>
                        {user ? 'Nenhum histórico de serviços encontrado.' : 'Faça login para ver seus barbeiros favoritos.'}
                    </p>
                )
            }
        </div>
    );
};

export default CostumerFavouriteBarbers;