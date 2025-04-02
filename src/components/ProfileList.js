import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebaseConfig";
import MapModal from "./MapModal";
import "../styles.css";

// Function to generate avatar URL
const generateAvatarUrl = (name, size = 200) => {
  if (!name) return `https://via.placeholder.com/${size}x${size}`;
  return `https://ui-avatars.com/api/?name=${encodeURIComponent(
    name
  )}&size=${size}&background=random&color=fff&font-size=0.33`;
};

const ProfileList = () => {
  const [profiles, setProfiles] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState(null); // Error state
  const [selectedProfileForMap, setSelectedProfileForMap] = useState(null);
  const [isMapModalOpen, setIsMapModalOpen] = useState(false);

  useEffect(() => {
    const fetchProfiles = async () => {
      setLoading(true);
      setError(null); // Reset error on new fetch
      try {
        const querySnapshot = await getDocs(collection(db, "profiles"));
        setProfiles(
          querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
        );
      } catch (err) {
        console.error("Error fetching profiles:", err);
        setError("Failed to load profiles. Please try again later."); // User-friendly error
      } finally {
        setLoading(false);
      }
    };
    fetchProfiles();
  }, []);

  const handleShowMapClick = (profile) => {
    if (profile.address) {
      setSelectedProfileForMap(profile);
      setIsMapModalOpen(true);
    } else {
      alert(`${profile.name} does not have an address provided.`);
    }
  };

  const handleCloseModal = () => {
    setIsMapModalOpen(false);
    setSelectedProfileForMap(null);
  };

  // Filter profiles based on search term
  const filteredProfiles = profiles.filter(
    (profile) =>
      profile.name.toLowerCase().includes(search.toLowerCase()) ||
      (profile.description &&
        profile.description.toLowerCase().includes(search.toLowerCase())) ||
      (profile.address &&
        profile.address.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="container">
      <input
        type="text"
        placeholder="Search by name or location..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="search-box"
      />

      {loading && <div className="loading-indicator">Loading profiles...</div>}
      {error && <div className="error-message">{error}</div>}

      {!loading && !error && (
        <div className="grid">
          {filteredProfiles.length > 0 ? (
            filteredProfiles.map((profile) => {
              const imageUrl = profile.photo || generateAvatarUrl(profile.name);
              return (
                <div key={profile.id} className="profile-card">
                  <img
                    src={imageUrl}
                    alt={profile.name}
                    className="profile-image"
                  />
                  <h2>{profile.name}</h2>
                  <p>{profile.description || "No description available."}</p>
                  <div className="profile-card-actions">
                    <Link
                      to={`/profile/${profile.id}`}
                      className="button button-secondary"
                    >
                      View Details
                    </Link>
                    {/* Only show map button if address exists */}
                    {profile.address && (
                      <button
                        onClick={() => handleShowMapClick(profile)}
                        className="button button-primary"
                      >
                        Show Map
                      </button>
                    )}
                  </div>
                </div>
              );
            })
          ) : (
            <p>No profiles found matching your search.</p> // Message when search yields no results
          )}
        </div>
      )}

      {/* Check selectedProfileForMap is not null before rendering */}
      {selectedProfileForMap && (
        <MapModal
          isOpen={isMapModalOpen}
          onRequestClose={handleCloseModal}
          profile={selectedProfileForMap}
        />
      )}
    </div>
  );
};

export default ProfileList;
