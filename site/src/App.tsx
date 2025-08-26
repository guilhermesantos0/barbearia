import { Route, Routes } from 'react-router-dom'

import Home from './pages/Home'
import Login from './pages/Login'
import ScheduleService from './pages/ScheduleService'
import Checkout from './pages/Checkout'
import Success from './pages/Checkout/Success'
import Failed from './pages/Checkout/Fail'

function App() {
    return (
        <Routes>
            <Route path='/' element={<Home />} />
            <Route path='/home/:userType/:page' element={<Home />}></Route>
            <Route path='/login' element={<Login />} />

            <Route path='/agendar-servico' element={<ScheduleService />} />
            <Route path='/agendar-servico/pagamento' element={<Checkout />} />
            <Route path='/agendar-servico/pagamento/sucesso' element={<Success />} />
            <Route path='/agendar-servico/pagamento/falha' element={<Failed />} />
        </Routes>    
    )
}

export default App
