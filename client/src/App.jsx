import React from 'react'
import "./assets/globals.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home/Home";
import Listings from "./pages/Listings/Listings";
import SingleListing from "./pages/SingleListing/SingleListing";
import AddProperty from "./pages/AddProperty/AddProperty";
import MyListings from "./pages/MyListings/MyListings";
import Login from "./components/Header/Login/Login";
import Register from "./components/Header/Register/Register";
import About from "./pages/About/About";
import Contact from "./pages/Contact/Contact";
import Header from "./components/Header/Header";
import Footer from "./components/Footer/Footer";
import ProtectedRoute from "./components/ProtectedRoute/ProtectedRoute";
const App = () => {
  return (
    <BrowserRouter>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/listings" element={<Listings />} />
        <Route path="/listings/:id" element={<SingleListing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/add-property" element={<ProtectedRoute allowedRoles="landlord"><AddProperty /></ProtectedRoute>} />
        <Route path="/my-listings" element={<ProtectedRoute allowedRoles={['landlord', 'agent']}><MyListings /></ProtectedRoute>} />
      </Routes>
      <Footer />
    </BrowserRouter>
  )
}

export default App
