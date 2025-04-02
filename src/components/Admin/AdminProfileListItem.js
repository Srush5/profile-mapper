import React from 'react';

// Function to generate avatar URL (moved here for reusability)
const generateAvatarUrl = (name, size = 50) => {
    if (!name) return `https://via.placeholder.com/${size}`; // Fallback if name is empty
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&size=${size}&background=random&color=fff&font-size=0.5`;
};

const AdminProfileListItem = ({ profile, onEdit, onDelete }) => {

  // Use profile.photo if available, otherwise generate avatar
  const imageUrl = profile.photo || generateAvatarUrl(profile.name);

  return (
    <div className="admin-profile-item">
      <img src={imageUrl} alt={profile.name} className="admin-profile-thumbnail" />
      <div className="admin-profile-info">
        <strong>{profile.name}</strong>
        <p className="admin-profile-address">{profile.address || 'No address'}</p>
      </div>
      <div className="admin-profile-actions">
        <button onClick={() => onEdit(profile)} className="button button-edit">
          Edit
        </button>
        <button onClick={() => onDelete(profile.id)} className="button button-delete">
          Delete
        </button>
      </div>
    </div>
  );
};

export default AdminProfileListItem;