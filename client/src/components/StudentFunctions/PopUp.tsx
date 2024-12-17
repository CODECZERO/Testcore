import React from 'react';
import '../styles/popUp.css'; // Add appropriate styles for the popup

interface PopupProps {
  isOpen: boolean; // Controls whether the popup is visible
  onClose: () => void; // Function to close the popup
  children: React.ReactNode; // Content to display inside the popup
}

const ReusablePopup: React.FC<PopupProps> = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null; // Don't render if not open

  return (
    <div className="popup-overlay" onClick={onClose}>
      <div className="popup-content" onClick={(e) => e.stopPropagation()}>
        <button className="popup-close" onClick={onClose}>
          &times;
        </button>
        {children}
      </div>
    </div>
  );
};

export default ReusablePopup;
