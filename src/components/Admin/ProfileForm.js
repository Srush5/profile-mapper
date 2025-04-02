import React, { useState, useEffect } from "react";

const ProfileForm = ({ onSubmit, initialData, onCancel, isLoading }) => {
  const [name, setName] = useState("");
  const [photo, setPhoto] = useState("");
  const [description, setDescription] = useState("");
  const [address, setAddress] = useState("");

  const isEditing = !!initialData; // Check if we are in edit mode

  useEffect(() => {
    if (initialData) {
      setName(initialData.name || "");
      setPhoto(initialData.photo || "");
      setDescription(initialData.description || "");
      setAddress(initialData.address || "");
    } else {
      // Reset form when switching back to add mode
      setName("");
      setPhoto("");
      setDescription("");
      setAddress("");
    }
  }, [initialData]);

  const handleSubmit = (e) => {
    e.preventDefault();
    // validation
    if (!name.trim()) {
      alert("Name is required.");
      return;
    }
    onSubmit({ name, photo, description, address });
    // clear form after successful add
    if (!isEditing) {
      setName("");
      setPhoto("");
      setDescription("");
      setAddress("");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="admin-form">
      <h3>{isEditing ? "Edit Profile" : "Add New Profile"}</h3>
      <div className="form-group">
        <label htmlFor="name">Name *</label>
        <input
          id="name"
          type="text"
          placeholder="Full Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
      </div>
      <div className="form-group">
        <label htmlFor="photo">Photo URL</label>
        <input
          id="photo"
          type="text"
          placeholder="Image URL (e.g., https://...)"
          value={photo}
          onChange={(e) => setPhoto(e.target.value)}
        />
        <small>Leave blank to use default avatar based on name.</small>
      </div>
      <div className="form-group">
        <label htmlFor="description">Description</label>
        <textarea
          id="description"
          placeholder="Brief description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows="3"
        />
      </div>
      <div className="form-group">
        <label htmlFor="address">Address</label>
        <input
          id="address"
          type="text"
          placeholder="Street, City, Country (for mapping)"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
        />
        <small>
          Used for the map feature. 
        </small>
      </div>
      <div className="form-actions">
        <button
          type="submit"
          className="button button-primary"
          disabled={isLoading}
        >
          {isLoading
            ? "Saving..."
            : isEditing
            ? "Update Profile"
            : "Add Profile"}
        </button>
        {isEditing && (
          <button
            type="button"
            className="button button-secondary"
            onClick={onCancel}
            disabled={isLoading}
          >
            Cancel Edit
          </button>
        )}
      </div>
    </form>
  );
};

export default ProfileForm;
