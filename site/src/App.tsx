import { Route, Routes } from 'react-router-dom'

import Home from './pages/Home'
import Login from './pages/Login'
import ScheduleService from './pages/ScheduleService'

function App() {
    return (
        <Routes>
            <Route path='/' element={<Home />} />
            <Route path='/home/:userType/:page' element={<Home />}></Route>
            <Route path='/login' element={<Login />} />
            <Route path='/agendar-servico' element={<ScheduleService />} />
        </Routes>    
    )
}

export default App
