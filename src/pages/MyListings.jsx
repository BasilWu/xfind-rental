import React, { useEffect, useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { getListings, deleteListing } from "../hooks/useListings";
import ListingCard from "../components/ListingCard";
import { useNavigate } from "react-router-dom";

export default function MyListings() {
  const { currentUser, profile } = useAuth();
  const [myListings, setMyListings] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchMyListings() {
      if (!currentUser) return;
      const all = await getListings();
      const mine = all.filter(l => l.landlordId === currentUser.uid);
      setMyListings(mine);
    }
    fetchMyListings();
  }, [currentUser]);

  if (!currentUser) return <div>請先登入</div>;
  if (!profile || profile.role !== "landlord") return <div>僅房東可使用此頁</div>;

  return (
    <div style={{ maxWidth: 1000, margin: "40px auto", padding: 32 }}>
      <h2 style={{ fontWeight: "bold", fontSize: 26, marginBottom: 24 }}>我的刊登</h2>
      <button onClick={() => navigate("/new")}>➕ 新增房源</button>
      {myListings.length === 0 ? (
        <div>目前尚無房源</div>
      ) : (
        <div style={{ display: "flex", flexWrap: "wrap", gap: 24 }}>
          {myListings.map(listing => (
            <div key={listing.id} style={{ width: 320 }}>
              <ListingCard
                listing={listing}
                onClick={() => navigate(`/listing/${listing.id}`)}
                isFavorite={false}
                onFavorite={() => {}}
              />
              <button
                onClick={() => {
                  if (window.confirm("確定要刪除嗎？")) {
                    deleteListing(listing.id).then(() => {
                      setMyListings(prev => prev.filter(l => l.id !== listing.id));
                    });
                  }
                }}
                style={{
                  marginTop: 4,
                  background: "#f33",
                  color: "#fff",
                  border: "none",
                  borderRadius: 4,
                  padding: "4px 12px",
                  cursor: "pointer"
                }}
              >
                刪除
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}