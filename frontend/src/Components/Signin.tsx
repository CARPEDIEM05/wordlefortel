import { useState } from "react"
import { Button } from "react-bootstrap"
import { useRecoilState } from "recoil";
import { email, name, password } from "../Store/Atoms";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { BACKEND_URL } from "../config";



export function Signin(){
    const navigate = useNavigate();
    const [emailVal, setEmailVal] = useRecoilState(email);
    const [passwordVal, setPasswordVal] = useRecoilState(password);

    async function sendSignInRequest(){
        const response = await axios.post(`${BACKEND_URL}/api/v1/user/signin`,{
            email: emailVal,
            password: passwordVal
        })
        
        const jwt = response.data.token;
        localStorage.setItem("token", jwt);
        navigate('/home');
    }

    return <div className="grid grid-cols-1 lg:grid-cols-2 justify-center items-center font-serif h-full">

        
    <div className="flex justify-center items-center text-white">
        <div className=" w-72 h-64 pt-4 rounded-md bg-slate-900 shadow-[0_35px_60px_-15px_rgba(0,0,0,0.3)] font-thin" >
        <div className="flex justify-center items-center ">
        <div className=" mb-2">
            <div >Email</div>
            
            <input className=" w-56 h-8 pl-2 rounded-md border-2 text-black " onChange={(e)=>{
                setEmailVal(e.target.value)
            }} type="text" placeholder="m@example.com" />
        </div>
    </div>
    <div className="flex justify-center items-center">
        <div className=" mb-2">
            <div >Password</div>
            <input className=" w-56 h-8 pl-2 rounded-md border-2 text-black " onChange={(e)=>{
                setPasswordVal(e.target.value)
            }} type="password" placeholder="Enter your password" />
        </div>
    </div>

    <div className="flex justify-center items-center mt-4">
        <div className="justify-center items-center">
        <div className=" text-white">Create an account? <button className=" " onClick={()=>{
            navigate('/signup');
        }}>Signup</button></div>
        <button className="bg-black text-white w-56 rounded-md h-8 shadow-2xl mt-2" onClick={sendSignInRequest} >Sign In</button>
        </div>
    </div>

        </div>
    </div>
    <div className="flex justify-center items-center bg-slate-900 h-screen shadow-2xl m-4 lg:visible invisible">
        <div className=" text-4xl text-white">Wordle By Netcracker</div>
    </div>
    
</div>
}

interface LabelsType{
    value: string,
    placeholderText: string,
    inputType: string
}
