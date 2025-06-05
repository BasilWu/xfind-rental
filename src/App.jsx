// src/App.jsx
import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Header from "./components/Header";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Listings from "./pages/Listings";
import NewListing from "./pages/NewListing";
import MapPage from "./pages/MapPage";
import ListingDetail from "./pages/ListingDetail";
import { useAuth } from "./contexts/AuthContext";
import Favorites from "./pages/Favorites";
import MyListings from "./pages/MyListings";

function PrivateRoute({ children }) {
  const { currentUser } = useAuth();
  return currentUser ? children : <Navigate to="/login" replace />;
}

export default function App() {
  return (
    <BrowserRouter>
      <Header />
      <div style={{ paddingTop: 64 }}>
        <Routes>
          {/* 公開頁面 */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* 需要登入的頁面 */}
          <Route path="/" element={
            <PrivateRoute>
              <Home />
            </PrivateRoute>
          } />
          <Route path="/my-listings" element={
            <PrivateRoute>
              <MyListings />
            </PrivateRoute>
          } />
          <Route path="/listing/:id" element={
            <PrivateRoute>
              <ListingDetail />
            </PrivateRoute>
          } />
          <Route path="/listings" element={
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
          {/* 未匹配的路徑自動導向首頁 */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}