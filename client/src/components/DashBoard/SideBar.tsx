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


const Sidebar : React.FC<{ toggleCreateChat: () => void }> = ({ toggleCreateChat }) => {
  return (
    <div className='menu'>
        <div className="logo">
            <BiBookAlt className='logo-icon'/>
            <h2 ><span id='AG'>A</span><span id='G'>G</span></h2>
        </div>
      <div className="menu--list">
        <Link to="/Dash-Board" className="item">
            <BiHome className="icon"/>
            Dashboard
        </Link>      </div>
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
      <a href="#" className="item" onClick={toggleCreateChat}>
                    <BiGroup  className="icon"/>
                    Create Group
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
        <Link to="/Help" className="item">
            <BiHelpCircle className="icon"/>
        Help
        </Link>
      </div>
  
    </div>
  )
}

export default Sidebar;
