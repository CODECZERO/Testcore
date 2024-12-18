import React, { useEffect,useState } from 'react'
import axios from 'axios'
import Login from './LoginSign/SignUp';
import Dashboard from './DashBoard/Dashboard';

const SessionCheck:React.FC=()=>{
    const [loginData,setLoginData]=useState<any>(false);
    const data= async()=>{
        const Data=await axios.get(`https://testcore-qmyu.onrender.com/api/v1/user/userData`)
        if(!Data) setLoginData(false)
        setLoginData(Data);
    }
    useEffect(()=>{
         data();
    },[]);
    return !loginData?(
        <Login/>
    ):(
        <>
            <Dashboard/>
        </>
    )
}

export default SessionCheck;
