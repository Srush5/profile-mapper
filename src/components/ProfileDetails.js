import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebaseConfig";
import MapComponents from "./MapComponents";

const ProfileDetails = () => {
  const { id } = useParams();
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      const docRef = doc(db, "profiles", id);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setProfile(docSnap.data());
      }
    };
    fetchProfile();
  }, [id]);

  return profile ? (
    <div className="container">
      <h1>{profile.name}</h1>
      <img src={profile.photo} alt={profile.name} className="profile-image" />
      <p>{profile.description}</p>
      {profile.address && <MapComponents address={profile.address} />}
    </div>
  ) : (
    <p>Loading...</p>
  );
};

export default ProfileDetails;
