import {
  BiHome,
    BiMessage,
    BiSolidReport,
    BiStats,
    BiTask,
    BiBookAlt,
   BiHelpCircle,
   BiGroup
} from 'react-icons/bi'
import "../styles/sidebar.css"
import { Link } from "react-router-dom";
import AGLogo from "../../Assets/AG.png"

const Sidebar : React.FC<{ toggleCreateChat: () => void }> = ({ toggleCreateChat }) => {
  return (
    <div className="menu">
      <div className="logo">
        <h2>
       <img className='logo-img' src={AGLogo} alt="png" />
        </h2>
      </div>
      <div className="menu--list">
        <Link to="/Dash-Board" className="item">
          <BiHome className="icon" />
          <span>Dashboard</span>
        </Link>
      </div>
      <div className="menu--list">
        <a href="#" className="item">
          <BiTask className="icon" />
          <span>Assignment</span>
        </a>
      </div>
      <div className="menu--list">
        <a href="#" className="item">
          <BiSolidReport className="icon" />
          <span>Report</span>
        </a>
      </div>
      <div className="menu--list">
        <a href="#" className="item" onClick={toggleCreateChat}>
          <BiGroup className="icon" />
          <span>Create Group</span>
        </a>
      </div>
      <div className="menu--list">
        <Link to="/messages" className="item">
          <BiMessage className="icon" />
          <span>Message</span>
        </Link>
      </div>
      <div className="menu--list">
        <a href="#" className="item">
          <BiStats className="icon" />
          <span>Stats</span>
        </a>
      </div>
      <div className="menu--list">
        <Link to="/Help" className="item">
          <BiHelpCircle className="icon" />
          <span>Help</span>
        </Link>
      </div>
    </div>
  );
};

export default Sidebar;
