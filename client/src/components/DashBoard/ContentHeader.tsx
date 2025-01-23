import { RootState } from '../store';
import {  useSelector } from 'react-redux';
import { BiSearch } from 'react-icons/bi'
import "../../components/styles/contentheader.css"
import { BiPlus } from "react-icons/bi";


const ContentHeader = () => {
  const userInfo = useSelector((state: RootState) => state.user.userInfo);

  return (
    <div className='content--header'>
      <h1 className="header--title"><span className="headss">Welcome </span><span id='username'>{userInfo?.name}</span></h1>
      {/* <div className="header--activity">
        <div className="search-box">
          <input type="text"
            placeholder='search anything here....'
          />
          <BiSearch className='icon' />
        </div>  */}
    </div>
  )
}

export default ContentHeader
