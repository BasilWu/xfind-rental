import React, { useEffect, useState, useCallback, useRef } from "react";
import { GoogleMap, Marker, InfoWindow, useJsApiLoader } from "@react-google-maps/api";
import { getListings } from "../hooks/useListings";
import FilterPanel from "../components/FilterPanel";

const containerStyle = {
  width: "100%",
  height: "500px"
};
const center = {
  lat: 24.163,
  lng: 120.65
};

export default function MapPage() {
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

  // 條件過濾
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
    <div>
      <h2>地圖找房</h2>
      <FilterPanel filters={filters} setFilters={setFilters} />
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={center}
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
      <div style={{marginTop: 16}}>
        <strong>目前顯示：{filteredListings.length} 筆房源</strong>
      </div>
    </div>
  );
}