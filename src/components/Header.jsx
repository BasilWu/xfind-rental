import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

export default function Header() {
  const { currentUser, profile, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <header style={{
      width: "100%",
      height: 64,
      background: "#175fff",
      color: "#fff",
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      padding: "0 40px",
      position: "fixed",
      top: 0,
      left: 0,
      zIndex: 99,
      boxShadow: "0 2px 16px #0002"
    }}>
      <div style={{ fontWeight: "bold", fontSize: 22, letterSpacing: 1 }}>
        <Link to="/" style={{ color: "#fff", textDecoration: "none" }}>xFind 租屋</Link>
      </div>
      <nav style={{ display: "flex", gap: 20, alignItems: "center" }}>
        <Link to="/map" style={{ color: "#fff", textDecoration: "none" }}>地圖找房</Link>
        <Link to="/favorites" style={{ color: "#fff", textDecoration: "none" }}>我的收藏</Link>
        {profile?.role === "landlord" && (
          <Link to="/my-listings" style={{ color: "#fff", textDecoration: "none" }}>我的刊登</Link>
        )}
        {!currentUser ? (
          <>
            <Link to="/login" style={{ color: "#fff", textDecoration: "none" }}>登入</Link>
            <Link to="/register" style={{ color: "#fff", textDecoration: "none" }}>註冊</Link>
          </>
        ) : (
          <>
            <span style={{ marginRight: 16 }}>哈囉，{profile?.displayName || currentUser.email}</span>
            <button onClick={logout} style={{
              background: "rgba(255,255,255,0.1)",
              border: "none",
              color: "#fff",
              padding: "6px 18px",
              borderRadius: 6,
              cursor: "pointer"
            }}>登出</button>
          </>
        )}
      </nav>
    </header>
  );
}