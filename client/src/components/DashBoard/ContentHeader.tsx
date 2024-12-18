import { RootState } from '../store';
import {  useSelector } from 'react-redux';
import { BiSearch } from 'react-icons/bi'

const ContentHeader = () => {
  const userInfo = useSelector((state: RootState) => state.user.userInfo);

  return (
    <div className='content--header'>
      <h1 className="header--title">Welcome {userInfo?.name}</h1>
      <div className="header--activity">
        <div className="search-box">
          <input type="text"
            placeholder='search anything here....'
          />
          <BiSearch className='icon' />
        </div>
      </div>
      

    </div>
  )
}

export default ContentHeader
