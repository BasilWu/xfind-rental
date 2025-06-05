import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { db } from "../firebase";
import { doc, getDoc } from "firebase/firestore";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";

export default function ListingDetail() {
  const { id } = useParams();
  const [listing, setListing] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchData() {
      const docSnap = await getDoc(doc(db, "listings", id));
      if (docSnap.exists()) setListing({ id, ...docSnap.data() });
      else setListing(false);
    }
    fetchData();
  }, [id]);

  if (listing === null) return <div>載入中...</div>;
  if (listing === false) return <div>找不到房源</div>;

  return (
    <div style={{ maxWidth: 900, margin: "40px auto", background: "#fff", borderRadius: 16, boxShadow: "0 6px 36px #0002", padding: 32 }}>
      <button onClick={() => navigate(-1)} style={{ marginBottom: 20 }}>← 返回</button>
      <h2 style={{ fontSize: 26, fontWeight: "bold", marginBottom: 12 }}>{listing.title}</h2>
      <div style={{ marginBottom: 24 }}>
        {listing.images && listing.images.length > 0 && (
          <Swiper
            style={{ width: "100%", borderRadius: 12 }}
            spaceBetween={0}
            slidesPerView={1}
          >
            {listing.images.map((img, idx) => (
              <SwiperSlide key={idx}>
                <img
                  src={img}
                  alt={`房源圖片${idx + 1}`}
                  style={{ width: "100%", height: 380, objectFit: "cover", borderRadius: 12 }}
                />
              </SwiperSlide>
            ))}
          </Swiper>
        )}
      </div>
      <div style={{ marginBottom: 16, fontSize: 18, fontWeight: "bold", color: "#175fff" }}>
        {listing.pricePerMonth} 元 / 月
      </div>
      <div style={{ marginBottom: 8, fontSize: 15 }}>
        {listing.city} {listing.district} {listing.street}
      </div>
      <div style={{ marginBottom: 8 }}>
        <span style={{ marginRight: 10 }}>{listing.roomType}</span>
        <span style={{ marginRight: 10 }}>{listing.areaSize} 坪</span>
        {listing.amenities?.length > 0 && (
          <span>設備：{listing.amenities.join("、")}</span>
        )}
      </div>
      <div style={{ marginBottom: 18, fontSize: 16, color: "#444" }}>
        {listing.description}
      </div>
      {/* 可以擴充更多資訊（房東聯絡、預約、收藏…） */}
    </div>
  );
}