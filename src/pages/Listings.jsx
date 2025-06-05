import React, { useEffect, useState } from "react";
import { getListings, deleteListing } from "../hooks/useListings";
import { useNavigate } from "react-router-dom";

export default function Listings() {
  const [listings, setListings] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    getListings().then(setListings);
  }, []);

  return (
    <div>
      <h2>房源列表</h2>
      <button onClick={() => navigate("/new")}>新增房源</button>
      <ul>
        {listings.map(listing => (
          <li key={listing.id}>
            <h3>{listing.title}</h3>
            <div>{listing.city} {listing.district} {listing.street}</div>
            <div>{listing.pricePerMonth} 元 / 月</div>
            <div>{listing.areaSize} 坪</div>
            <div>設備: {listing.amenities?.join(", ")}</div>
            <div>
              {listing.images?.[0] && (
                <img src={listing.images[0]} alt="" width={120} />
              )}
            </div>
            <button onClick={() => navigate(`/edit/${listing.id}`)}>編輯</button>
            <button onClick={async () => {
              await deleteListing(listing.id);
              setListings(listings => listings.filter(l => l.id !== listing.id));
            }}>刪除</button>
          </li>
        ))}
      </ul>
    </div>
  );
}