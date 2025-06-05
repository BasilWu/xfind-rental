import React, { useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

export default function ListingCard({ listing, ...props }) {
  const navigate = useNavigate();
  return (
    <div
      // ...style
      onClick={() => navigate(`/listing/${listing.id}`)}
    >
      {/* ...其他內容 */}
    </div>
  );
}

export default function ListingCard({ listing, onClick, isFavorite, onFavorite }) {

  // Swiper 不會重複載入同一張圖
  return (
    <div
      style={{
        border: "1px solid #e0e0e0",
        borderRadius: 8,
        background: "#fff",
        marginBottom: 16,
        boxShadow: "0 2px 8px #0001",
        padding: 8,
        position: "relative",
        cursor: "pointer",
      }}
      onClick={onClick}
    >
      {listing.images && listing.images.length > 0 && (
        <Swiper
          style={{ width: "100%", borderRadius: 8, marginBottom: 6 }}
          spaceBetween={0}
          slidesPerView={1}
        >
          {listing.images.map((img, idx) => (
            <SwiperSlide key={idx}>
              <img
                src={img}
                alt={`房源圖片${idx + 1}`}
                style={{ width: "100%", height: 180, objectFit: "cover", borderRadius: 8 }}
              />
            </SwiperSlide>
          ))}
        </Swiper>
      )}
      {/* 收藏按鈕 */}
      <div
        style={{
          position: "absolute",
          top: 14,
          right: 16,
          zIndex: 2,
        }}
        onClick={e => {
          e.stopPropagation();
          onFavorite && onFavorite();
        }}
      >
        {isFavorite ? (
          <FaHeart color="#e92b2b" size={26} />
        ) : (
          <FaRegHeart color="#bbb" size={26} />
        )}
      </div>
      <div style={{ fontWeight: "bold", fontSize: 16, marginBottom: 2 }}>{listing.title}</div>
      <div style={{ color: "#333", fontSize: 15, marginBottom: 2 }}>
        {listing.city} {listing.district} {listing.street}
      </div>
      <div style={{ color: "#175fff", fontWeight: "bold", fontSize: 17, marginBottom: 2 }}>
        {listing.pricePerMonth} 元/月
      </div>
      <div style={{ fontSize: 13, color: "#888", marginBottom: 4 }}>
        {listing.roomType}　{listing.areaSize} 坪
      </div>
      <div style={{ fontSize: 13, color: "#555", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
        {listing.description}
      </div>
    </div>
  );
}