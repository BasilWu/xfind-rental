// src/pages/Register.jsx
import React, { useState } from "react";
import { auth, db } from "../firebase";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { setDoc, doc, serverTimestamp } from "firebase/firestore";
import { useNavigate } from "react-router-dom";

export default function Register() {
  const [form, setForm] = useState({
    email: "",
    password: "",
    displayName: "",
    phone: "",
    role: "tenant", // 預設為房客，可切換房東
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = e => {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: value }));
  };

  const handleRoleChange = e => {
    setForm(f => ({ ...f, role: e.target.value }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      // 1. 建立 Firebase Auth 帳號
      const { user } = await createUserWithEmailAndPassword(auth, form.email, form.password);

      // 2. 設定 displayName
      if (form.displayName) {
        await updateProfile(user, { displayName: form.displayName });
      }

      // 3. Firestore 寫入用戶資料
      await setDoc(doc(db, "users", user.uid), {
        email: form.email,
        displayName: form.displayName,
        phone: form.phone,
        role: form.role, // "landlord" or "tenant"
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        avatarUrl: "",
      });

      navigate("/");
    } catch (err) {
      setError(err.message);
    }
    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} style={{ maxWidth: 400, margin: "40px auto", padding: 32, background: "#fff", borderRadius: 12 }}>
      <h2 style={{ textAlign: "center", marginBottom: 24 }}>註冊新帳號</h2>
      <div style={{ marginBottom: 16 }}>
        <input
          name="email"
          type="email"
          placeholder="電子郵件"
          value={form.email}
          onChange={handleChange}
          required
          style={{ width: "100%", padding: 8, marginBottom: 6 }}
        />
        <input
          name="password"
          type="password"
          placeholder="密碼"
          value={form.password}
          onChange={handleChange}
          required
          style={{ width: "100%", padding: 8, marginBottom: 6 }}
        />
        <input
          name="displayName"
          type="text"
          placeholder="暱稱"
          value={form.displayName}
          onChange={handleChange}
          required
          style={{ width: "100%", padding: 8, marginBottom: 6 }}
        />
        <input
          name="phone"
          type="text"
          placeholder="手機號碼"
          value={form.phone}
          onChange={handleChange}
          style={{ width: "100%", padding: 8, marginBottom: 6 }}
        />
        <div style={{ marginTop: 8, marginBottom: 8 }}>
          <label>
            <input
              type="radio"
              name="role"
              value="tenant"
              checked={form.role === "tenant"}
              onChange={handleRoleChange}
              style={{ marginRight: 4 }}
            />
            我是房客
          </label>
          <label style={{ marginLeft: 20 }}>
            <input
              type="radio"
              name="role"
              value="landlord"
              checked={form.role === "landlord"}
              onChange={handleRoleChange}
              style={{ marginRight: 4 }}
            />
            我是房東
          </label>
        </div>
      </div>
      <button
        type="submit"
        style={{
          width: "100%", padding: 10, background: "#175fff",
          color: "#fff", border: "none", borderRadius: 6, fontWeight: "bold"
        }}
        disabled={loading}
      >
        {loading ? "註冊中…" : "註冊"}
      </button>
      {error && (
        <div style={{ color: "red", marginTop: 12 }}>{error}</div>
      )}
    </form>
  );
}