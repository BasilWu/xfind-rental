import React, { useState } from "react";
import { addListing } from "../hooks/useListings";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";

const amenityOptions = ["冷氣", "網路", "陽台", "家具", "電梯", "機車位"];

export default function NewListing() {
  const [form, setForm] = useState({
    title: "",
    description: "",
    address: "",
    city: "",
    district: "",
    street: "",
    latitude: "",
    longitude: "",
    amenities: [],
    areaSize: "",
    availableFrom: "",
    pricePerMonth: "",
    roomType: "",
    imageFiles: [],
  });
  const { currentUser } = useAuth();
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = e => {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: value }));
  };

  const handleAmenities = e => {
    const value = e.target.value;
    setForm(f => ({
      ...f,
      amenities: f.amenities.includes(value)
        ? f.amenities.filter(a => a !== value)
        : [...f.amenities, value]
    }));
  };

  const handleFiles = e => {
    setForm(f => ({ ...f, imageFiles: Array.from(e.target.files) }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      if (!currentUser) throw new Error("未登入");
      await addListing({
        ...form,
        landlordId: currentUser.uid,
      });
      navigate("/");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>新增房源</h2>
      <input name="title" placeholder="標題" onChange={handleChange} required />
      <textarea name="description" placeholder="簡介" onChange={handleChange} />
      <input name="address" placeholder="地址" onChange={handleChange} />
      <input name="city" placeholder="城市" onChange={handleChange} />
      <input name="district" placeholder="行政區" onChange={handleChange} />
      <input name="street" placeholder="街道" onChange={handleChange} />
      <input name="latitude" placeholder="緯度" onChange={handleChange} />
      <input name="longitude" placeholder="經度" onChange={handleChange} />
      <input name="areaSize" type="number" placeholder="坪數" onChange={handleChange} />
      <input name="pricePerMonth" type="number" placeholder="每月租金" onChange={handleChange} />
      <input name="roomType" placeholder="房型" onChange={handleChange} />
      <input name="availableFrom" type="date" onChange={handleChange} />
      <label>設備：</label>
      {amenityOptions.map(opt => (
        <label key={opt} style={{ marginRight: 8 }}>
          <input
            type="checkbox"
            value={opt}
            checked={form.amenities.includes(opt)}
            onChange={handleAmenities}
          /> {opt}
        </label>
      ))}
      <input name="imageFiles" type="file" accept="image/*" multiple onChange={handleFiles} />
      <button type="submit">送出</button>
      {error && <div>{error}</div>}
    </form>
  );
}