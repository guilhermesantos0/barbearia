import { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import style from './Home.module.scss'

import Sidebar from "../../components/SideBar";

import { useUser } from "../../contexts/UserContext";

// COSTUMER
import CostumerSchedules from "./Pages/CostumerSchedules";
import CostumerFavouriteBarbers from "./Pages/CostumerFavouriteBarbers";
import CostumerHistory from "./Pages/CostumerHistory";
import CostumerEditProfile from "./Pages/CostumerEditProfile";
import CostumerPlan from "./Pages/CostumerPremium";

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
                            </>
                        )
                    }
                </>
            </div>
        </div>
    )
}

export default Home;