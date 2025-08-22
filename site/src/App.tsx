import { Route, Routes } from 'react-router-dom'

import Home from './pages/Home'
import Login from './pages/Login'
import ScheduleService from './pages/ScheduleService'
import Checkout from './pages/Checkout'

function App() {
    return (
        <Routes>
            <Route path='/' element={<Home />} />
            <Route path='/home/:userType/:page' element={<Home />}></Route>
            <Route path='/login' element={<Login />} />
            <Route path='/agendar-servico' element={<ScheduleService />} />
            <Route path='/agendar-servico/pagamento' element={<Checkout />} />
        </Routes>    
    )
}

export default App
