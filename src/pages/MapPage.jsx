import React, { useEffect, useState } from "react";
import { GoogleMap, Marker, InfoWindow, useJsApiLoader } from "@react-google-maps/api";
import { getListings } from "../hooks/useListings";

const containerStyle = {
  width: "100%",
  height: "500px"
};

const center = {
  lat: 24.163,   // 台中中心點
  lng: 120.65
};

export default function MapPage() {
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: import.meta.env.VITE_APP_GOOGLE_MAPS_API_KEY,
    libraries: ['places']
  });

  const [listings, setListings] = useState([]);
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    getListings().then(setListings);
  }, []);

  if (!isLoaded) return <div>Loading...</div>;

  return (
    <div>
      <h2>地圖找房</h2>
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={center}
        zoom={12}
      >
        {listings.map(listing => (
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
  );
}