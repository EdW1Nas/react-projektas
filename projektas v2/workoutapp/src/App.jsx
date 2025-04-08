import { useState } from 'react'
import './App.css'
import Register from './assets/components/register'
import { Routes, Route, Navigate } from "react-router-dom";
import Login from './assets/components/login';

function App() {


  return (
    <Routes>
    <Route path="/" element={<Navigate to="/register" />} />
    <Route path="/register" element={<Register />} />
    <Route path="/login" element={<Login />} />
    
</Routes>
      
  )
}

export default App
