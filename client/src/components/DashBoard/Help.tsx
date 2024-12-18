import React from 'react';
import  '../../components/styles/Help.css';

const Help = () => {
  return (
      <div className="container">
    <div className='parent-container'>
      <form className="forms">
        <div className="titles">Contact us</div>
        <input type="text" placeholder="Your email" className="inputs" />
        <textarea placeholder="Your message" defaultValue={""} />
        <button>Submit</button>
      </form>
      </div>
      </div>

  );
}

export default Help;