
import './App.css'
import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/auth/Login';
import Signup from './pages/auth/SignUp';
import RoomBookingPage from './pages/room/RoomBookingPage';
import RoomBookingForm from './pages/booking/RoomBookingForm';
import AIChat from './pages/chatbot/AIChat';

function App() {

  return (
    <>
    <h1></h1>
      <Routes>
        <Route path='/login' element={<Login/>}/>
        <Route path='/signup' element={<Signup/>}/>
        <Route path='/' element={<Home/>}/>
        <Route path='/room' element={<RoomBookingPage/>}/>
        <Route path='/booking' element={<RoomBookingForm/>}/>
        <Route path='/chat' element={<AIChat/>}/>

      </Routes>
    </>
  )
}

export default App
