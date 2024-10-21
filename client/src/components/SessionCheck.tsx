import React, { useEffect,useState } from 'react'
import axios from 'axios'
import Login from './SignUp';
import Dashboard from './Dashboard';

const SessionCheck:React.FC=()=>{
    const [loginData,setLoginData]=useState<any>(false);
    const data= async()=>{
        const Data=await axios.get(`http://localhost:4008/api/v1/user/userData`)
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
