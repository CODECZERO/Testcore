import '../styles/Profile.css';
import { useSelector } from 'react-redux';
import { RootState } from './store';
import Pic from '../Assets/Pic.png'

const Profile = () => {
  const userInfo = useSelector((state: RootState) => state.user.userInfo);
  return (
    <div className="profile-card">
      <img 
        src={Pic}
        alt="Profile Avatar" 
      />
      <div className="profile-info">
        <span className="profile-name">{userInfo?.name}</span>
        <br></br>
        <span className="profile-role">Student</span>
      </div>
    </div>
  );
};

export default Profile;
