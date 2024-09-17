import { useState } from 'react'
import reactLogo from './assets/react.svg'
import './App.css'
import Login from './Pages/Login'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import AdminLayout from './Layouts/AdminLayout'
import Dashboard from './Pages/admin/Dashboard'
import Profile from './Pages/admin/Profile'
import Add_admin from './Pages/admin/Add_admin'
import View_admin from './Pages/admin/View_admin'
import Nutrients from './Pages/admin/Nutrients'
import ProvinceNutrients from './Pages/admin/ProvinceNutrients'
import NutrientsSource from './Pages/admin/NutrientsSource'
import NutrientsQuantity from './Pages/admin/NutrientsQuantity'
import SurceTable from './Pages/SurceTable'
import City from './Pages/admin/City'
function App() {
  return (
    <div className="App">

      <BrowserRouter>
        <Routes>
          <Route exact path='/login' element={<Login />} />
          <Route path='/' element={<AdminLayout />} >
            <Route index element={<Dashboard />} />
            <Route path='profile' element={<Profile />} />
            <Route path='add-admin' element={<Add_admin />} />
            <Route path='city' element={<City />} />
            {/* <Route path='view-user' element={<View_admin />} /> */}
            <Route path='Nutrients' element={<Nutrients />} />
            <Route path='get-source/:name' element={<SurceTable />} />

            <Route path='province-Nutrients/:province/:name' element={<ProvinceNutrients />} />
            <Route path='price-managment' element={<NutrientsSource />} />
            <Route path='Nutrients-quantity' element={<NutrientsQuantity />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </div>
  )
}

export default App
