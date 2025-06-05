import React, { useEffect, useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { getFavoriteIds } from "../hooks/useFavorites";
import { getListings } from "../hooks/useListings";
import ListingCard from "../components/ListingCard";
import { useNavigate } from "react-router-dom";

export default function Favorites() {
  const { currentUser } = useAuth();
  const [favorites, setFavorites] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchData() {
      if (!currentUser) return;
      const favIds = await getFavoriteIds(currentUser.uid);
      const all = await getListings();
      const myFavs = all.filter(listing => favIds.includes(listing.id));
      setFavorites(myFavs);
    }
    fetchData();
  }, [currentUser]);

  if (!currentUser) return <div>請先登入</div>;
  if (!favorites) return <div>載入中...</div>;

  return (
    <div style={{ maxWidth: 1000, margin: "40px auto", padding: 32 }}>
      <h2 style={{ fontWeight: "bold", fontSize: 26, marginBottom: 24 }}>我的收藏</h2>
      {favorites.length === 0 ? (
        <div>目前尚無收藏房源</div>
      ) : (
        <div style={{ display: "flex", flexWrap: "wrap", gap: 24 }}>
          {favorites.map(listing => (
            <div key={listing.id} style={{ width: 320 }}>
              <ListingCard
                listing={listing}
                onClick={() => navigate(`/listing/${listing.id}`)}
                isFavorite={true}
                onFavorite={() => {}} // 收藏頁無法取消
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}