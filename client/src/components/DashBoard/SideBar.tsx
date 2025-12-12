import React from 'react';
import {
  BiHome,
  BiMessage,
  BiStats,
  BiBookAlt,
  BiHelpCircle,
  BiGroup,
  BiCalendar,
  BiEdit,
  BiTable,
  BiCalendarPlus,
  BiUserCheck,
  BiCalendarCheck
} from 'react-icons/bi';
import "../styles/sidebar.css";
import { Link } from "react-router-dom";
import AGLogo from "../../Assets/AG.png";
import { getUserRole, getMenuForRole, roleConfig, MenuItem } from '../../config/permissions.config';

// Map icon names to actual icon components
const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  BiHome,
  BiMessage,
  BiStats,
  BiBookAlt,
  BiHelpCircle,
  BiGroup,
  BiCalendar,
  BiEdit,
  BiTable,
  BiCalendarPlus,
  BiUserCheck,
  BiCalendarCheck,
};

interface SideBarProps {
  toggleCreateChat?: () => void;
}

const Sidebar: React.FC<SideBarProps> = ({ toggleCreateChat }) => {
  const userRole = getUserRole();
  const menuItems = getMenuForRole(userRole);
  const roleInfo = userRole ? roleConfig[userRole] : null;

  const renderMenuItem = (item: MenuItem) => {
    const IconComponent = iconMap[item.icon] || BiBookAlt;

    return (
      <div className="menu--list" key={item.path}>
        <Link to={item.path} className="item">
          <IconComponent className="icon" />
          <span>{item.label}</span>
        </Link>
      </div>
    );
  };

  return (
    <div className="menu">
      <div className="logo">
        <h2>
          <img className='logo-img' src={AGLogo} alt="png" />
        </h2>
      </div>

      {/* Role Badge */}
      {roleInfo && (
        <div
          className="role-badge-sidebar"
          style={{
            backgroundColor: roleInfo.bgColor,
            color: roleInfo.color,
            padding: '0.25rem 0.5rem',
            borderRadius: '12px',
            fontSize: '0.65rem',
            fontWeight: 600,
            marginBottom: '0.5rem',
            textAlign: 'center',
            whiteSpace: 'nowrap'
          }}
        >
          {roleInfo.label}
        </div>
      )}

      {/* Dynamic Menu Items */}
      {menuItems.map(renderMenuItem)}

      {/* Create Group - only show if toggleCreateChat is provided */}
      {toggleCreateChat && (
        <div className="menu--list">
          <a href="#" className="item" onClick={toggleCreateChat}>
            <BiGroup className="icon" />
            <span>Create Group</span>
          </a>
        </div>
      )}
    </div>
  );
};

export default Sidebar;
