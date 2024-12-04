// import React from 'react';
// import '../styles/Card.css'
// interface CardProps {
//   title: string;
//   description: string;
//   icon: React.ReactNode;

// }

// const Card: React.FC<CardProps> = ({ title, description, icon}) => {
//   return (
//     <div className="card" > {/* Use 'onClick' correctly */}
//       <div className="card-icon">{icon}</div>
//       <h3 className="card-title">{title}</h3>
//       <p className="card-description">{description}</p>
//     </div>
//   );
// };

// export default Card;

import React from 'react';
import '../styles/Card.css';

interface CardProps {
  title: string; // The title for the card (e.g., "Instagram")
  description: string; // The body text of the card
  icon: React.ReactNode; // The icon to display in the card
  buttonText?: string; // Optional button text, defaults to "Follow us"
}

const Card: React.FC<CardProps> = ({ title, description, icon, buttonText = "Follow us" }) => {
  return (
    <div className="card"> {/* Add your custom styles */}
      <div className="icon">{icon}</div> {/* Icon Section */}
      <strong className="card-title">{title}</strong> {/* Title Section */}
      <div className="card__body"></div> {/* Description Section */}
      <span className="card-button">{description}</span> {/* Optional Button Text */}
    </div>
  );
};

export default Card;

