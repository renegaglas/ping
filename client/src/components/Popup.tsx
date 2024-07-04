import React from 'react';
import './Popup.css';

interface PopupProps {
  message: string;
  onClose: () => void;
}

const Popup: React.FC<PopupProps> = ({ message, onClose }) => {
  return (
    <div className="popup">
      <div className="popup-content">
        <p>{message}</p>
        <button onClick={onClose}>I Understand</button>
      </div>
    </div>
  );
};

export default Popup;
