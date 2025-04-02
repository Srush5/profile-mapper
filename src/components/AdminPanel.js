import React, { useState, useEffect, useCallback } from "react";
import {
  collection,
  addDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  doc,
} from "firebase/firestore";
import { db } from "../firebaseConfig";
import ProfileForm from "./Admin/ProfileForm";
import AdminProfileListItem from "./Admin/AdminProfileListItem";
import "../styles.css";
import "../admin-styles.css";

const AdminPanel = () => {
  // State Variables
  const [profiles, setProfiles] = useState([]); // Array of profile objects
  const [editingProfile, setEditingProfile] = useState(null); // Profile object being edited
  const [loading, setLoading] = useState(false); // For fetching list or deleting
  const [formLoading, setFormLoading] = useState(false); // Specifically for Add/Update operations
  const [error, setError] = useState(null); // Stores error messages
  const [successMessage, setSuccessMessage] = useState(null); // Stores success messages

  // Helper Function
  const clearMessages = () => {
    setError(null);
    setSuccessMessage(null);
  };

  // Data Fetching
  const fetchProfiles = useCallback(async () => {
    setLoading(true); // Indicate loading started
    clearMessages(); // Clear previous messages
    try {
      const querySnapshot = await getDocs(collection(db, "profiles"));
      const fetchedProfiles = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setProfiles(fetchedProfiles);
    } catch (err) {
      console.error("Error fetching profiles for admin:", err);
      setError("Failed to load profiles. Please try refreshing the page.");
    } finally {
      setLoading(false); // Indicate loading finished (success or fail)
    }
  }, []);

  // Effect for Initial Data Load
  useEffect(() => {
    fetchProfiles();
  }, [fetchProfiles]);

  // CRUD Handlers
  /**
    @param {object} profileData - Data object from the form { name, photo, description, address }
   */
  const handleFormSubmit = async (profileData) => {
    clearMessages();
    setFormLoading(true); // Indicate form operation started
    const operation = editingProfile ? "update" : "add";

    try {
      if (editingProfile) {
        if (!editingProfile.id)
          throw new Error("Cannot update profile without ID.");
        const profileRef = doc(db, "profiles", editingProfile.id);
        await updateDoc(profileRef, profileData);
        setSuccessMessage("Profile updated successfully!");
        setEditingProfile(null); // Exit edit mode after successful update
      } else {
        //  Add New Profile
        await addDoc(collection(db, "profiles"), profileData);
        setSuccessMessage("Profile added successfully!");
        // ProfileForm clears itself on successful add
      }
      await fetchProfiles(); // Refresh the profile list after successful add/update
    } catch (err) {
      console.error(`Error ${operation}ing profile:`, err);
      setError(
        `Failed to ${operation} profile. Please check the details and try again.`
      );
    } finally {
      setFormLoading(false); // Indicate form operation finished
    }
  };

  /**
   * Handles the click of the Delete button on a profile item.
   * @param {string} profileId - The Firestore document ID of the profile to delete.
   */
  const handleDeleteProfile = async (profileId) => {
    clearMessages();

    // Confirmation dialog
    if (!window.confirm("Are you sure you want to delete this profile?")) {
      return;
    }

    setLoading(true);
    try {
      if (!profileId) throw new Error("Cannot delete profile without ID.");
      await deleteDoc(doc(db, "profiles", profileId));
      setSuccessMessage("Profile deleted successfully!");

      // If the profile being deleted was also the one being edited, cancel edit mode
      if (editingProfile && editingProfile.id === profileId) {
        setEditingProfile(null);
      }
      await fetchProfiles(); // Refresh the list after deletion
    } catch (err) {
      console.error("Error deleting profile:", err);
      setError("Failed to delete profile. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  /**
   * Handles the click of the Edit button on a profile item.
   * Sets the selected profile into the editing state.
   * @param {object} profile - The full profile object to be edited.
   */
  const handleEditClick = (profile) => {
    clearMessages();
    setEditingProfile(profile);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  /**
   * Handles the click of the Cancel button in the form when in edit mode.
   */
  const handleCancelEdit = () => {
    clearMessages();
    setEditingProfile(null); // Clear the editing state
  };

  // JSX Rendering
  return (
    <div className="container admin-container">
      <h1>Admin Panel</h1>

      {"Loading"}
      {error && <div className="error-message">{error}</div>}
      {successMessage && (
        <div className="success-message">{successMessage}</div>
      )}

      <ProfileForm
        onSubmit={handleFormSubmit}
        initialData={editingProfile}
        onCancel={handleCancelEdit}
        isLoading={formLoading}
      />

      <hr className="admin-divider" />

      <h2>Manage Existing Profiles</h2>
      {loading && profiles.length === 0 && (
        <div className="loading-indicator">Loading profiles...</div>
      )}

      {!loading && profiles.length === 0 && !error && <p>No profiles found.</p>}

      {!loading && profiles.length > 0 && (
        <div className="admin-profile-list">
          {profiles.map((profile) => (
            <AdminProfileListItem
              key={profile.id}
              profile={profile}
              onEdit={() => handleEditClick(profile)} // Pass handler for edit action
              onDelete={() => handleDeleteProfile(profile.id)} // Pass handler for delete action
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminPanel;
