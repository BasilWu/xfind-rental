import React from "react";

export default function FilterPanel({ filters, setFilters }) {
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFilters(f => ({ ...f, [name]: value }));
  };

  return (
    <div style={{ marginBottom: 16, padding: 8, border: "1px solid #eee" }}>
      <label>最低租金: <input type="number" name="minPrice" value={filters.minPrice} onChange={handleChange} style={{width: 80}} /></label>
      <label style={{marginLeft: 8}}>最高租金: <input type="number" name="maxPrice" value={filters.maxPrice} onChange={handleChange} style={{width: 80}} /></label>
      <label style={{marginLeft: 8}}>坪數: <input type="number" name="minArea" value={filters.minArea} onChange={handleChange} style={{width: 50}} />~<input type="number" name="maxArea" value={filters.maxArea} onChange={handleChange} style={{width: 50}} /></label>
      <label style={{marginLeft: 8}}>房型: <input name="roomType" value={filters.roomType} onChange={handleChange} placeholder="ex. 獨立套房" style={{width: 100}} /></label>
      {/* 其他條件可再補 */}
    </div>
  );
}