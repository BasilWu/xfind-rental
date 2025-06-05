// src/App.jsx
import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Listings from "./pages/Listings";
import NewListing from "./pages/NewListing";
import MapPage from "./pages/MapPage";
import ListingDetail from "./pages/ListingDetail";
import { useAuth } from "./contexts/AuthContext";
import Favorites from "./pages/Favorites";

function PrivateRoute({ children }) {
  const { currentUser } = useAuth();
  return currentUser ? children : <Navigate to="/login" replace />;
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        {/* 之後會加上首頁、房東房客分頁... */}
        <Route path="/" element={
          <PrivateRoute>
            <Home />
          </PrivateRoute>
        } />
      </Routes>
      <Route path="/listing/:id" element={
        <PrivateRoute>
          <ListingDetail />
        </PrivateRoute>
      } />
      <Route path="/" element={
        <PrivateRoute>
          <Listings />
        </PrivateRoute>
      } />
      <Route path="/new" element={
        <PrivateRoute>
          <NewListing />
        </PrivateRoute>
      } />
      <Route path="/map" element={
        <PrivateRoute>
          <MapPage />
        </PrivateRoute>
      } />
      <Route path="/favorites" element={
        <PrivateRoute>
          <Favorites />
        </PrivateRoute>
      } />
    </BrowserRouter>
  );
}