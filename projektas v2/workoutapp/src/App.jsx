import { useState } from 'react'
import './App.css'
import Register from './assets/components/register'
import { Routes, Route, Navigate } from "react-router-dom";
import Login from './assets/components/login';
import Dashboard from './assets/components/dashboard';
import AdminPanel from './assets/components/adminpanel';
import AdminWorkouts from './assets/components/adminworkouts';

function App() {


  return (
    <Routes>
    <Route path="/" element={<Navigate to="/register" />} />
    <Route path="/register" element={<Register />} />
    <Route path="/login" element={<Login />} />
    <Route path="/dashboard" element={<Dashboard />} />
    <Route path="/adminpanel" element={<AdminPanel />} />
    <Route path="/adminworkouts" element={<AdminWorkouts />} />
    
</Routes>
      
  )
}

export default App
