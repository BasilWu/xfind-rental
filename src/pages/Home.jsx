import React, { useEffect, useState, useRef, useCallback } from "react";
import { GoogleMap, Marker, InfoWindow, useJsApiLoader } from "@react-google-maps/api";
import { getListings } from "../hooks/useListings";
import FilterPanel from "../components/FilterPanel";

const mapContainerStyle = {
  width: "100%",
  height: "100vh",
};

const mapCenter = {
  lat: 24.163,  // 台中中心
  lng: 120.65,
};

export default function Home() {
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: import.meta.env.VITE_APP_GOOGLE_MAPS_API_KEY,
    libraries: ['places']
  });

  const [listings, setListings] = useState([]);
  const [selected, setSelected] = useState(null);
  const [filters, setFilters] = useState({
    minPrice: "",
    maxPrice: "",
    minArea: "",
    maxArea: "",
    roomType: ""
  });
  const [mapBounds, setMapBounds] = useState(null);

  const mapRef = useRef();

  useEffect(() => {
    getListings().then(setListings);
  }, []);

  const onLoad = useCallback((map) => {
    mapRef.current = map;
  }, []);

  const onBoundsChanged = () => {
    if (mapRef.current) {
      const bounds = mapRef.current.getBounds();
      setMapBounds({
        north: bounds.getNorthEast().lat(),
        east: bounds.getNorthEast().lng(),
        south: bounds.getSouthWest().lat(),
        west: bounds.getSouthWest().lng()
      });
    }
  };

  // 條件+地圖範圍過濾
  const filteredListings = listings.filter(listing => {
    if (filters.minPrice && listing.pricePerMonth < Number(filters.minPrice)) return false;
    if (filters.maxPrice && listing.pricePerMonth > Number(filters.maxPrice)) return false;
    if (filters.minArea && listing.areaSize < Number(filters.minArea)) return false;
    if (filters.maxArea && listing.areaSize > Number(filters.maxArea)) return false;
    if (filters.roomType && !listing.roomType?.includes(filters.roomType)) return false;
    if (mapBounds && listing.latitude && listing.longitude) {
      if (
        listing.latitude > mapBounds.north ||
        listing.latitude < mapBounds.south ||
        listing.longitude > mapBounds.east ||
        listing.longitude < mapBounds.west
      ) {
        return false;
      }
    }
    return true;
  });

  if (!isLoaded) return <div>Loading...</div>;

  return (
    <div style={{
      display: "flex",
      height: "100vh",
      width: "100vw"
    }}>
      {/* 左側地圖 */}
      <div style={{ flex: 1, position: "relative" }}>
        <FilterPanel filters={filters} setFilters={setFilters} />
        <GoogleMap
          mapContainerStyle={mapContainerStyle}
          center={mapCenter}
          zoom={12}
          onLoad={onLoad}
          onBoundsChanged={onBoundsChanged}
        >
          {filteredListings.map(listing => (
            listing.latitude && listing.longitude && (
              <Marker
                key={listing.id}
                position={{ lat: listing.latitude, lng: listing.longitude }}
                onClick={() => setSelected(listing)}
              />
            )
          ))}
          {selected && (
            <InfoWindow
              position={{ lat: selected.latitude, lng: selected.longitude }}
              onCloseClick={() => setSelected(null)}
            >
              <div>
                <strong>{selected.title}</strong>
                <div>{selected.city} {selected.district}</div>
                <div>{selected.pricePerMonth}元/月</div>
                {selected.images?.[0] &&
                  <img src={selected.images[0]} alt="" width="120" style={{marginTop: 4}} />
                }
              </div>
            </InfoWindow>
          )}
        </GoogleMap>
      </div>

      {/* 右側房源列表 */}
      <div style={{
        width: 400, // 你可以改大一點
        height: "100vh",
        overflowY: "auto",
        borderLeft: "1px solid #eee",
        background: "#fafbfc",
        padding: 12
      }}>
        <div style={{ fontWeight: "bold", marginBottom: 8 }}>
          共 {filteredListings.length} 筆結果
        </div>
        {filteredListings.length === 0 ? (
          <div>無房源</div>
        ) : (
          filteredListings.map(listing => (
            <div
              key={listing.id}
              style={{
                border: "1px solid #e0e0e0",
                borderRadius: 8,
                background: "#fff",
                marginBottom: 16,
                cursor: "pointer",
                boxShadow: "0 2px 8px #0001",
                padding: 8
              }}
              onClick={() => setSelected(listing)}
            >
              {listing.images?.[0] &&
                <img src={listing.images[0]} alt="" style={{ width: "100%", borderRadius: 6, marginBottom: 6 }} />
              }
              <div style={{ fontWeight: "bold", fontSize: 16 }}>{listing.title}</div>
              <div>{listing.city} {listing.district} {listing.street}</div>
              <div>租金：{listing.pricePerMonth} 元 / 月　坪數：{listing.areaSize}</div>
              <div style={{ fontSize: 12, color: "#666" }}>{listing.description}</div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}