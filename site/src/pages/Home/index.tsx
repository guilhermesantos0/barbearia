import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import style from './Home.module.scss'

import Sidebar from "../../components/SideBar";

import { useUser } from "../../contexts/UserContext";

// COSTUMER
import CostumerSchedules from "./Pages/Customer/Schedules";
import CostumerFavouriteBarbers from "./Pages/Customer/FavouriteBarbers";
import CostumerHistory from "./Pages/Customer/History";
import CostumerEditProfile from "./Pages/Customer/EditProfile";
import CostumerPlan from "./Pages/Customer/Premium";

// BARBER
import BarberConfirmSchedules from "./Pages/Barber/ConfirmSchedules";
import BarberHistory from "./Pages/Barber/History";
import BarberSchedules from "./Pages/Barber/Schedules";
import BarberStats from "./Pages/Barber/Stats";
import BarberEditProfile from "./Pages/Barber/EditProfile";

// ADMIN
import AdminSchdules from "./Pages/Admin/Schedules";
import AdminServices from "./Pages/Admin/Services";
import EditService from "./Pages/Admin/EditService";
import BarbersList from "./Pages/Admin/BarbersList";
import CustomersList from "./Pages/Admin/CustomersList";
import Times from "./Pages/Admin/Times";
import AdminPlans from "./Pages/Admin/Plans";

const Home = () => {
    const { user } = useUser();
    const [openedTab, setOpenedTab] = useState<string | undefined>();
    const { userType, page } = useParams<{ userType: string, page: string }>()

    useEffect(() => {
        setOpenedTab(`${userType}_${page}`)
        console.log(`${userType}_${page}`);
    },[ userType, page ])
    
    return (
        <div className={style.Container}>
            <Sidebar setOpenedTab={setOpenedTab} />
            <div className={style.PageContent}>
                <>
                    {
                        user && (
                            <>
                                {
                                    openedTab === "cliente_agendamentos" && (
                                        <CostumerSchedules />
                                    )
                                }
                                {
                                    openedTab === "cliente_barbeiros-favoritos" && (
                                        <CostumerFavouriteBarbers />
                                    )
                                }
                                {
                                    openedTab === "cliente_historico" && (
                                        <CostumerHistory />
                                    )
                                }
                                {
                                    openedTab === "cliente_editar-perfil" && (
                                        <CostumerEditProfile />
                                    )
                                }
                                {
                                    openedTab === "cliente_assinaturas" && (
                                        <CostumerPlan />
                                    )
                                }


                                {
                                    openedTab === "barbeiro_confirmar-agendamentos" && (
                                        <BarberConfirmSchedules />
                                    )
                                }
                                {
                                    openedTab === "barbeiro_historico" && (
                                        <BarberHistory />
                                    )
                                }
                                {
                                    openedTab === "barbeiro_agendamentos" && (
                                        <BarberSchedules />   
                                    )
                                }
                                {
                                    openedTab === "barbeiro_estatisticas" && (
                                        <BarberStats />
                                    )
                                }
                                {
                                    openedTab === "barbeiro_editar-perfil" && (
                                        <BarberEditProfile />
                                    )
                                }

                                {
                                    openedTab === 'admin_agendamentos' && (
                                        <AdminSchdules />
                                    )
                                }
                                {
                                    openedTab === 'admin_servicos' && (
                                        <AdminServices />
                                    )
                                }
                                {
                                    openedTab === 'admin_editar-servico' && (
                                        <EditService />
                                    )
                                }
                                {
                                    openedTab === 'admin_barbeiros' && (
                                        <BarbersList />
                                    )
                                }
                                {
                                    openedTab === 'admin_clientes' && (
                                        <CustomersList />
                                    )
                                }
                                {
                                    openedTab === 'admin_horarios' && (
                                        <Times />
                                    )
                                }
                                {
                                    openedTab === 'admin_planos' && (
                                        <AdminPlans />
                                    )
                                }
                            </>
                        )
                    }
                </>
            </div>
        </div>
    )
}

export default Home;