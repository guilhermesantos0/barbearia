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
import ConfirmSchedules from "./Pages/Barber/ConfirmSchedules";
import History from "./Pages/Barber/History";
import Schedules from "./Pages/Barber/Schedules";


const Home = () => {
    const { user } = useUser();
    const [openedTab, setOpenedTab] = useState<string | undefined>();
    const { userType, page } = useParams<{ userType: string, page: string }>()

    useEffect(() => {
        setOpenedTab(`${userType}_${page}`)
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
                                        <ConfirmSchedules />
                                    )
                                }
                                {
                                    openedTab === "barbeiro_historico" && (
                                        <History />
                                    )
                                }
                                {
                                    openedTab === "barbeiro_agendamentos" && (
                                        <Schedules />   
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