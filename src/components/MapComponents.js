import React, { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import axios from "axios";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import "../styles.css";

// Leaflet Icon Setup
const defaultIcon = new L.Icon({
  iconUrl: require("leaflet/dist/images/marker-icon.png"),
  iconRetinaUrl: require("leaflet/dist/images/marker-icon-2x.png"),
  shadowUrl: require("leaflet/dist/images/marker-shadow.png"),
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});
// End Leaflet Icon Setup

const MapComponents = ({ address }) => {
  const [coordinates, setCoordinates] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!address || address.trim() === "") {
      setError("No address provided.");
      setLoading(false);
      setCoordinates(null);
      return;
    }

    let isMounted = true; // Track mount status for cleanup

    const getCoordinates = async () => {
      setLoading(true);
      setError(null);
      setCoordinates(null);

      try {
        const encodedAddress = encodeURIComponent(address);
        const response = await axios.get(
          `https://nominatim.openstreetmap.org/search?format=json&q=${encodedAddress}&limit=1`,
          {
            headers: {
              "User-Agent": "YourAppName/1.0 (your-contact-email@example.com)",
            },
          }
        );

        if (!isMounted) return;

        if (response.data && response.data.length > 0) {
          const { lat, lon } = response.data[0];
          setCoordinates({ lat: parseFloat(lat), lng: parseFloat(lon) });
        } else {
          setError(`Could not find coordinates for "${address}".`);
        }
      } catch (err) {
        if (!isMounted) return; // Don't update state if unmounted
        console.error("Error fetching coordinates from Nominatim:", err);
        if (err.response) {
          setError(
            `Map service error: ${err.response.status}. Please try again later.`
          );
        } else if (err.request) {
          setError("Network error. Could not reach map service.");
        } else {
          setError("An error occurred while setting up the map request.");
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    getCoordinates();

    // Cleanup function to prevent state updates on unmounted component
    return () => {
      isMounted = false;
    };
  }, [address]); // Re-run effect only when address changes

  // Render Logic
  if (loading) {
    return <div className="map-status loading-indicator">Loading map...</div>;
  }

  if (error) {
    return <div className="map-status error-message">{error}</div>;
  }

  if (coordinates) {
    return (
      <MapContainer
        center={[coordinates.lat, coordinates.lng]}
        zoom={13}
        className="map-view-container"
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        <Marker
          position={[coordinates.lat, coordinates.lng]}
          icon={defaultIcon}
        >
          <Popup>
            {address} <br />
            {/* Use toFixed for cleaner coordinate display */}
            Lat: {coordinates.lat.toFixed(5)}, Lng: {coordinates.lng.toFixed(5)}
          </Popup>
        </Marker>
      </MapContainer>
    );
  }

  // Fallback message if needed
  return <div className="map-status">Map could not be displayed.</div>;
};

export default MapComponents;
