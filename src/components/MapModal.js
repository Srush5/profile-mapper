import React from "react";
import Modal from "react-modal";
import MapComponents from "./MapComponents";
import "../styles.css";

const MapModal = ({ isOpen, onRequestClose, profile }) => {
  if (!profile) return null;
  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      overlayClassName="map-modal-overlay"
      className="map-modal-content"
      contentLabel={`Map for ${profile.name}`}
      closeTimeoutMS={200}
    >
      <div className="map-modal-header">
        <h2 className="map-modal-title">Location for {profile.name}</h2>
        <button
          onClick={onRequestClose}
          className="modal-close-button"
          aria-label="Close map modal"
        >
          ×
        </button>
      </div>
      <div className="map-modal-body">
        {profile.address ? (
          <MapComponents address={profile.address} />
        ) : (
          <p>No address provided for this profile.</p>
        )}
      </div>
    </Modal>
  );
};

export default MapModal;
