
import './App.css'
import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/auth/Login';
import Signup from './pages/auth/SignUp';
import RoomBookingPage from './pages/room/RoomBookingPage';
import RoomBookingForm from './pages/booking/RoomBookingForm';
import RoomDetailScreen from './pages/room/RoomDetailScreen';
import AIChat from './pages/chatbot/AIChat';

import Dashboard from './pages/admin/Dashboard';
import Bookings from './pages/admin/Bookings';
import Rooms from './pages/admin/Rooms';
import Employees from './pages/admin/Employees';
import Salaries from './pages/admin/Salaries';
import AddEmployee from './pages/admin/AddEmployee';
import AddSalary from './pages/admin/AddSalary';

function App() {

  return (
    <>
      <h1></h1>
      <Routes>
        <Route path='/login' element={<Login />} />
        <Route path='/signup' element={<Signup />} />
        <Route path='/' element={<Home />} />
        <Route path='/room' element={<RoomBookingPage />} />
        <Route path='/room/:id' element={<RoomDetailScreen />} />
        <Route path='/booking/:id' element={<RoomBookingForm />} />
        <Route path='/chat' element={<AIChat />} />

        {/* Admin Routes */}
        <Route path="/admin" element={<Dashboard />} />
        <Route path="/admin/bookings" element={<Bookings />} />
        <Route path="/admin/rooms" element={<Rooms />} />
        
        <Route path="/admin/employees" element={<Employees />} />
        <Route path="/admin/employees/add" element={<AddEmployee />}/>
        <Route path="/admin/employees/edit/:id" element={<AddEmployee />} />
        
        <Route path="/admin/salaries" element={<Salaries />} />
        <Route path="/admin/salaries/add" element={<AddSalary />} /> {/* Route for adding new salary */}
        <Route path="/admin/salaries/edit/:id" element={<AddSalary />} /> {/* Route for editing existing salary */}

      </Routes>
    </>
  )
}

export default App
