import { useEffect, useState } from 'react';
import style from './Stats.module.scss';
// @ts-ignore
import api from '@services/api';

import {
    PieChart,
    Pie,
    Cell,
    Tooltip,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Legend,
    ResponsiveContainer
} from 'recharts';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// @ts-ignore
import { formatPrice } from '@utils/formatPrice';
import DetailsSection from '@components/DetailsSection';

const Stats = () => {

    const filterIndexMap = { week: 0, month: 1, year: 2 }; 

    const [userStats, setUserStats] = useState<any>(null);
    const [filter, setFilter] = useState<string>('week');

    const fetchData = async (filter: string) => {
        const response = await api.get('/users/stats');
        setUserStats(response.data);
    }

    useEffect(() => {

        fetchData('week');
    }, []);

    const updateFilter = (newFilter: string) => { 
        setFilter(newFilter);
        fetchData(newFilter);
    }

    if (!userStats) return <p>Carregando...</p>;

    const CustomTooltip = ({ active, payload, label }: any) => {
        if (active && payload && payload.length) {
            return (
                <div className={style.Tooltip}>
                    <p className={style.TooltipLabel}>{label}</p>
                    <p className={style.TooltipValue}>
                        Agendamentos: {payload[0].value}
                    </p>
                </div>
            );
        }
        return null;
    };

    
    const weekDays = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];
    
    const groupedPerDay = Object.entries(userStats.groupedAppointments.groupedPerDay).map(([name, value]) => ({
        name: weekDays[Number(name)],
        value
    }));

    const groupedPerService = Object.entries(userStats.groupedAppointments.groupedPerService).map(([name, value]) => ({
        name,
        value
    }));

    const groupedPerRate = Object.entries(userStats.groupedAppointments.groupedPerRate).map(([name, value]) => ({
        name: `${name} Estrelas`,
        value
    }));

    const newVsReturning = Object.entries(userStats.newVsReturning).map(([name, value]) => ({
        name: name === 'newClients' ? 'Novos Clientes' : 'Clientes Retornando',
        value
    }));

    const highestPeriods = Object.entries(userStats.highestPeriods).map(([name, value]) => ({
        name: name.charAt(0).toUpperCase() + name.slice(1),
        value
    }));

    const averageRatingByService = Object.entries(userStats.averageRatingByService).map(([name, value]) => ({
        name,
        value
    }));

    const COLORS = ['#2F80ED', '#1F2A40', '#C5C6CC', '#E4E9F2'];

    const topCardDetails = [
        { 
            label: 'Avaliação',
            value: userStats.userData.averageRating,
            icon: 'star'
        },
        {
            label: 'Serviços Realizados',
            value: userStats.userData.history.length,
            icon: 'scissors'
        },
        {
            label: 'Receita gerada',
            value: formatPrice(userStats.generatedIncome),
            icon: 'dollar-sign'
        }
    ]

    /* 
        "generatedIncome": 49500,
        "groupedAppointments": {
            "groupedPerDay": {
                "2": 4,
                "3": 2,
                "4": 1,
                "5": 1
            }, OK
            "groupedPerService": {
                "Corte Moderno": 4,
                "Barba Simples": 2,
                "Design de Sobrancelha": 1,
                "Corte + Barba Completa": 1
            }, OK
            "groupedPerRate": {} OK 
        },
        "uniqueCustomersCount": 1,
        "newVsReturning": {
            "newClients": 0,
            "returningClients": 1
        },
        "highestPeriods": {
            "morning": 1,
            "afternoon": 0,
            "night": 0
        },
        "averageRatingByService": {
            "Corte Moderno": 4.5
        },
        "loyaltyRate": 100
    */

    return (
        <div className={style.Container}>
            <div className={style.InfosCard}>
                <h3 className={style.Name}>{userStats.userData.name}</h3>
                <DetailsSection details={topCardDetails} />
            </div>

            <div className={style.FilterSelectorConteiner}>
                <div className={style.FilterSelector} style={{ ['--idx' as any]: filterIndexMap[filter] ?? 0 }}>
                    <div className={`${style.FilterButton} ${filter === 'week' ? style.Active : ''}`} onClick={() => updateFilter('week')}>Última Semana</div>
                    <div className={`${style.FilterButton} ${filter === 'month' ? style.Active : ''}`} onClick={() => updateFilter('month')}>Último Mês</div>
                    <div className={`${style.FilterButton} ${filter === 'year' ? style.Active : ''}`} onClick={() => updateFilter('year')}>Último Ano</div>
                </div>
            </div>

            <div className={style.ChartsContent}>

                <ResponsiveContainer width="100%" height={450}>
                    <div className={style.ChartCard}>
                        <h3>Agendamentos por Dia da Semana</h3>
                        <BarChart width={500} height={400} data={groupedPerDay} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                            <CartesianGrid strokeDasharray="3 3" className={style.CartesianGrid} />
                            <XAxis dataKey="name" tick={{ fill: "#C5C6CC", fontSize: 12 }} axisLine={false} tickLine={false}/>
                            <YAxis tick={{ fill: "#C5C6CC", fontSize: 12 }} axisLine={false} tickLine={false}/>
                            <Tooltip content={<CustomTooltip />} cursor={{ opacity: 0 }} />
                            <Bar
                                dataKey="value"
                                className={style.ChartBar}
                                radius={[10, 10, 0, 0]}
                            />
                        </BarChart>
                    </div>
                </ResponsiveContainer>

                <ResponsiveContainer width="100%" height={450}>
                    <div className={style.ChartCard}>
                        <h3>Agendamentos por Serviço</h3>
                        <BarChart width={600} height={400} data={groupedPerService} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                            <CartesianGrid strokeDasharray="3 3" className={style.CartesianGrid} />
                            <XAxis dataKey="name" tick={{ fill: "#C5C6CC", fontSize: 12 }} axisLine={false} tickLine={false}/>
                            <YAxis tick={{ fill: "#C5C6CC", fontSize: 12 }} axisLine={false} tickLine={false}/>
                            <Tooltip content={<CustomTooltip />} cursor={{ opacity: 0 }} />
                            <Bar
                                dataKey="value"
                                className={style.ChartBar}
                                radius={[10, 10, 0, 0]}
                            />
                        </BarChart>
                    </div>
                </ResponsiveContainer>

                <ResponsiveContainer width="100%" height={450}>
                    <div className={style.ChartCard}>
                        <h3>Avaliações</h3>
                        <BarChart width={600} height={400} data={groupedPerRate} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                            <CartesianGrid strokeDasharray="3 3" className={style.CartesianGrid} />
                            <XAxis dataKey="name" tick={{ fill: "#C5C6CC", fontSize: 12 }} axisLine={false} tickLine={false}/>
                            <YAxis tick={{ fill: "#C5C6CC", fontSize: 12 }} axisLine={false} tickLine={false}/>
                            <Tooltip content={<CustomTooltip />} cursor={{ opacity: 0 }} />
                            <Bar
                                dataKey="value"
                                className={style.ChartBar}
                                radius={[10, 10, 0, 0]}
                            />
                        </BarChart>
                    </div>
                </ResponsiveContainer>

                <ResponsiveContainer width="100%" height={450}>
                    <div className={style.ChartCard}>
                        <h3>Novos / Antigos Clientes</h3>
                        <PieChart width={600} height={400} data={newVsReturning} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                            {/* <CartesianGrid strokeDasharray="3 3" className={style.CartesianGrid} />
                            <XAxis dataKey="name" tick={{ fill: "#C5C6CC", fontSize: 12 }} axisLine={false} tickLine={false}/>
                            <YAxis tick={{ fill: "#C5C6CC", fontSize: 12 }} axisLine={false} tickLine={false}/>
                            <Tooltip content={<CustomTooltip />} cursor={{ opacity: 0 }} />
                            <Bar
                                dataKey="value"
                                className={style.ChartBar}
                                radius={[10, 10, 0, 0]}
                            /> */}
                            <Pie
                                data={newVsReturning}
                                cx="50%"
                                cy="50%"
                                outerRadius={120}
                                fill="#8884d8"
                                dataKey="value"
                                label
                            >
                                {newVsReturning.map((_, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip content={<CustomTooltip />} cursor={{ opacity: 0 }} />
                        </PieChart>
                    </div>
                </ResponsiveContainer>

                <ResponsiveContainer width="100%" height={450}> 
                    <div className={style.ChartCard}>
                        <h3>Horários de Pico</h3>
                        <BarChart width={600} height={400} data={highestPeriods} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                            <CartesianGrid strokeDasharray="3 3" className={style.CartesianGrid} />
                            <XAxis dataKey="name" tick={{ fill: "#C5C6CC", fontSize: 12 }} axisLine={false} tickLine={false}/>
                            <YAxis tick={{ fill: "#C5C6CC", fontSize: 12 }} axisLine={false} tickLine={false}/>
                            <Tooltip content={<CustomTooltip />} cursor={{ opacity: 0 }} />
                            <Bar
                                dataKey="value"
                                className={style.ChartBar}
                                radius={[10, 10, 0, 0]}
                            />
                        </BarChart>
                    </div>
                </ResponsiveContainer>

                <ResponsiveContainer width="100%" height={450}> 
                    <div className={style.ChartCard}>
                        <h3>Avaliações por Serviço</h3>
                        <BarChart width={600} height={400} data={averageRatingByService} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                            <CartesianGrid strokeDasharray="3 3" className={style.CartesianGrid} />
                            <XAxis dataKey="name" tick={{ fill: "#C5C6CC", fontSize: 12 }} axisLine={false} tickLine={false}/>
                            <YAxis tick={{ fill: "#C5C6CC", fontSize: 12 }} axisLine={false} tickLine={false} domain={[0, 5]}/>
                            <Tooltip content={<CustomTooltip />} cursor={{ opacity: 0 }} />
                            <Bar
                                dataKey="value"
                                className={style.ChartBar}
                                radius={[10, 10, 0, 0]}
                            />
                        </BarChart>
                    </div>
                </ResponsiveContainer>
            </div>
        </div>
    )
}

export default Stats;