import Content from "./Content";
import Profile from "./Profile";
import SideBar from "./SideBar";
import '../styles/Dashboard.css';



const Dashboard: React.FC = () => {
  

  return (
   <>
   <div className="dashboard">
   <SideBar toggleCreateChat={function (): void {
          throw new Error("Function not implemented.");
        } }/>
   <div className="dashboard--content">
    <Content/>
    <Profile/>
   </div>
   </div>
   </>
  )
};

export default Dashboard;
