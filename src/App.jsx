
import './App.css'
import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Rooms from './pages/Rooms';
import Login from './pages/auth/Login';
import Signup from './pages/auth/SignUp';

function App() {

  return (
    <>
    <h1></h1>
      <Routes>
        <Route path='/login' element={<Login/>}/>
        <Route path='/signup' element={<Signup/>}/>
        <Route path='/' element={<Home/>}/>
        <Route path='/room' element={<Rooms/>}/>
      </Routes>
    </>
  )
}

export default App
