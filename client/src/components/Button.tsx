import React from 'react';
import '../styles/ButtonComponent.css';

interface ButtonProps {
  type?: 'button' | 'submit' | 'reset'; // Define valid values for the type prop
  label: string;
  variant: 'primary' | 'secondary';
  fullWidth?: boolean;
  onClick?: () => void; // Optional onClick handler
  disabled?: boolean; 
  style?: React.CSSProperties; 
}

const ButtonComponent: React.FC<ButtonProps> = ({
  type = 'button',
  label,
  variant,
  fullWidth = false,
  onClick,
  disabled = false,
  style = {},
}) => {
  return (
    <button
      type={type}
      className={`button ${variant} ${fullWidth ? 'fullWidth' : ''}`}
      onClick={onClick}
    >
      {label}
    </button>
  );
};

export default ButtonComponent;
