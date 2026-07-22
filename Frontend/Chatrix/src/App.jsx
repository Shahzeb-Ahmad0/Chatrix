import './App.css'
import { Routes,Route } from 'react-router-dom';
import Home from './pages/Home.jsx';
import Signup from './pages/Signup';
import Login from './pages/Login';
import Profile from './pages/Profile';

function App() {

  return (
    <>
    <Routes>
      <Route path='/' element={<Home/>} />
      <Route path='/profile' element={<Profile/>} />
      <Route path='/signup' element={<Signup/>} />
      <Route path='/login' element={<Login/>} />
    </Routes>
    </>
  )
}

export default App
