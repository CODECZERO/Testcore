import {
  BiHome,
    BiMessage,
    BiSolidReport,
    BiStats,
    BiTask,
    BiBookAlt,
   BiHelpCircle
} from 'react-icons/bi'
import "../styles/sidebar.css"
import { Link } from "react-router-dom";


const Sidebar = () => {
  return (
    <div className='menu'>
        <div className="logo">
            <BiBookAlt className='logo-icon'/>
            <h2>AG</h2>
        </div>
      <div className="menu--list">
        <a href="#" className="item">
            <BiHome className="icon"/>
            Dashboard
        </a>      </div>
      <div className="menu--list">
        <a href="#" className="item">
            <BiTask className="icon"/>
           Assignment
        </a>
      </div>
      <div className="menu--list">
        <a href="#" className="item">
            <BiSolidReport className="icon"/>
            Report
        </a>
      </div>
      <div className="menu--list">
        <Link to="/messages" className="item">
            <BiMessage className="icon"/>
         Message
        </Link>
      </div>
      <div className="menu--list">
        <a href="#" className="item">
            <BiStats className="icon"/>
        Stats
        </a>
      </div>
      <div className="menu--list">
        <a href="#" className="item">
            <BiHelpCircle className="icon"/>
        Help
        </a>
      </div>
  
    </div>
  )
}

export default Sidebar;
