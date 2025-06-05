// src/pages/Login.jsx
import React, { useState } from "react";
import { auth } from "../firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate("/");
    } catch (err) {
      setError("登入失敗：" + err.message);
    }
  };

  return (
    <form onSubmit={handleLogin}>
      <h2>登入</h2>
      <input
        type="email"
        placeholder="信箱"
        value={email}
        onChange={e => setEmail(e.target.value)}
      />
      <input
        type="password"
        placeholder="密碼"
        value={password}
        onChange={e => setPassword(e.target.value)}
      />
      <button type="submit">登入</button>
      {error && <div>{error}</div>}
      <div style={{ textAlign: "center", marginTop: 18 }}>
        沒有帳號？ <Link to="/register" style={{ color: "#175fff" }}>註冊新帳號</Link>
      </div>
    </form>
  );
}