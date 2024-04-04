
import './App.css'
import { BrowserRouter, Route, Routes, useNavigate } from 'react-router-dom'
import { Home } from './Components/Home'
import { Signin } from './Components/Signin'
import { Signup } from './Components/Signup'
import { RecoilRoot } from 'recoil'
import { Leaderboard } from './Components/Leaderboard'
import { InsertWord } from './Components/InsertWord'

function App() {
 return (
  <RecoilRoot>
  <BrowserRouter>
    <Routes>
        <Route path='/home' element={<Home />}></Route>
        <Route path='/signin' element={<Signin />}></Route>
        <Route path='/signup' element={<Signup />}></Route>
        <Route path='/leaderboard' element={<Leaderboard />}></Route>
        <Route path='/insertword' element={<InsertWord />}></Route>
    </Routes>
  </BrowserRouter> 
  </RecoilRoot>  
 )
}

export default App
