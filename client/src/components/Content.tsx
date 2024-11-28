 import ContentHeader from './ContentHeader'
 import '../styles/content.css'
import Card from './Card'
import { BiBookAlt, BiMessage,BiStats } from 'react-icons/bi'
 const Content = () => {
   return (
     <div className='content'>
    <ContentHeader />
   <div className="content">
      <Card
         title="Stats"
         description="View all your stats and progress in one place."
       icon={<BiStats />}
     />
    <Card
      title="Messages"
         description="Check and reply to all your messages easily."
         icon={<BiMessage />}
     />
       <Card
        title="Assignments"
        description="Keep track of your assignments and deadlines."
icon={<BiBookAlt />}
      />
    </div>

   
    </div>
  )
 }

 export default Content

