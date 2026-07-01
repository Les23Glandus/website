"use client";

import { useCallback, useState } from "react";
import { GoogleMap, LoadScript } from "@react-google-maps/api";

const containerStyle = { width: "100%", height: "500px" };
const center = { lat: 48.84572535130427, lng: 2.594608950818975 };

// T111 — clé sortie du code source (auparavant en dur), lue depuis l'env.
// Penser à restreindre cette clé par domaine référent dans Google Cloud Console.
const GOOGLE_MAPS_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY || "";

export default function GoogleMaps({ address }) {
  const [, setMap] = useState(null);

  const onLoad = useCallback(
    function callback(map) {
      setMap(map);
      const bounds = new window.google.maps.LatLngBounds();
      const geocoder = new window.google.maps.Geocoder();

      address.forEach((info) => {
        geocoder.geocode({ address: info.address }, (results, status) => {
          if (status === window.google.maps.GeocoderStatus.OK) {
            const marker = new window.google.maps.Marker({
              map,
              title: info.name,
              position: results[0].geometry.location,
            });
            const infowindow = new window.google.maps.InfoWindow({
              content: `<h3 style='color:black'>${info.name}</h3>`,
            });
            marker.addListener("click", () => infowindow.open(map, marker));

            if (address.length >= 2) {
              bounds.extend(marker.position);
              map.fitBounds(bounds);
            } else {
              map.setCenter(marker.getPosition());
            }
            setMap(map);
          }
        });
      });
    },
    [address]
  );

  const onUnmount = useCallback(() => setMap(null), []);

  if (!GOOGLE_MAPS_KEY) return null;

  return (
    <LoadScript googleMapsApiKey={GOOGLE_MAPS_KEY}>
      <GoogleMap mapContainerStyle={containerStyle} center={center} zoom={10} onLoad={onLoad} onUnmount={onUnmount}>
        <></>
      </GoogleMap>
    </LoadScript>
  );
}
