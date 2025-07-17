import Sidebar from "../../components/SideBar";

import { useUser } from "../../contexts/UserContext";

const Home = () => {

    const { user } = useUser();

    return (
        <div>
            <h1>{ user?._id }</h1>
            <h2>{ user?.name }</h2>
            <Sidebar />
        </div>
    )
}

export default Home;