

import React from 'react';
import './styles/Card.css';

interface CardProps {
  title: string; // The title for the card (e.g., "Instagram")
  description: string; // The body text of the card
  icon: React.ReactNode; // The icon to display in the card
  buttonText?: string; // Optional button text, defaults to "Follow us"
  onClick?: () => void;
}

const Card: React.FC<CardProps> = ({ title, description, icon , onClick}) => {
  return (
    <div className="card" onClick={onClick}>  {/* Add your custom styles */}
      <div className="icon">{icon}</div> {/* Icon Section */}
      <strong className="card-title">{title}</strong> {/* Title Section */}
      <div className="card__body"></div> {/* Description Section */}
      <span className="card-button">{description}</span> {/* Optional Button Text */}
    </div>
  );
};

export default Card;

