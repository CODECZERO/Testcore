import Content from "./Content";
import Profile from "./Profile";
import SideBar from "./SideBar";
import  '../App.css'



const Dashboard: React.FC = () => {
  

  return (
   <>
   <div className="dashboard">
   <SideBar/>
   <div className="dashboard--content">
    <Content/>
    <Profile/>
   </div>
   </div>
   </>
  )
};

export default Dashboard;
