import React, { Profiler } from 'react'
import {Form, Route, Routes } from "react-router-dom";

import Signup from './pages/Signup';
import Login from './pages/Login';
import Home from './pages/Home';
import Navbar from './components/common/Navbar';
import Dashboard from './pages/Dashboard';
import Doctors from './pages/CreateDoctorForm'
import CategoryCreateForm from './pages/CategoryCreateForm'
import DoctorList from './pages/DoctorList';
import About from './pages/About';
import Services from './pages/Services';
import Footer from './pages/Footer';
import AppointmentBooking from './pages/AppointmentBooking';
import ChangePasswordForm from './pages/ChangePasswordForm';
import ForgotPasswordForm from './pages/ForgotPasswordForm';
import ResetPasswordForm from './pages/ReasetPasswordForm';
import ProfileIcon from './pages/ProfileIcon';
import DeleteAccount from './pages/DeleteAccount';
import Contact from './pages/Contact';
import GalleryPage from './pages/GalleryPage';

const App = () => {
  return (
    <div>
      <Navbar/>
      
      
      <Routes>
        <Route path='/' element={<Home/>}/>
        <Route path='/about' element={<About/>}/>
        <Route path='/services' element={<Services/>}/>
        <Route path='/contact' element={<Contact/>}/>
        <Route path='/gallery' element={<GalleryPage/>}/>
        <Route path='/signup' element={<Signup/>}/>
        <Route path='/login' element={<Login/>}/>
        <Route path='/Dashboard' element={<Dashboard/>}/>
        <Route path='/add-doctor' element={<Doctors/>}/>
        <Route path='/create-category' element={<CategoryCreateForm/>}/>
        <Route path='/doctor-list-page' element={<DoctorList/>}/>
        <Route path='/booking' element={<AppointmentBooking/>}/>
        <Route path="/change-password" element={<ChangePasswordForm />} />
        <Route path="/forgot-password" element={<ForgotPasswordForm />} />
        <Route path="/reset-password/:token" element={<ResetPasswordForm />} />
        <Route path="/delete-account" element={<DeleteAccount />} />

      </Routes>
      <Footer/>
      
    </div>
  )
}

export default App
