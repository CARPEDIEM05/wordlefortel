import { useState } from "react"
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { BACKEND_URL } from "../config";



export function Signup(){
    const navigate = useNavigate();
    const[emailValue, setEmailValue] = useState('');
    const [nameValue, setNameValue] = useState('');
    const [passwordValue, setPasswordValue] = useState('');

    async function sendRequest(){
        try{
            console.log(emailValue+nameValue+passwordValue);
            const response = await axios.post(`${BACKEND_URL}/api/v1/user/signup`,{
                    name: nameValue,
                    email: emailValue,
                    password: passwordValue,
                    role: "user"
                });
            if(response){
                const jwt = response.data.token;
                
                localStorage.setItem("token", jwt);
            
                navigate('/signin');
            }
            

        } catch (e){
            console.log(e);

        }
        
    }

    return <div className="grid grid-cols-1 lg:grid-cols-2 justify-center items-center font-serif h-full">

        
        <div className="flex justify-center items-center text-white">
            <div className=" w-72 h-80 pt-4 rounded-md bg-slate-900 shadow-[0_35px_60px_-15px_rgba(0,0,0,0.3)] font-thin">
            <div className="flex justify-center items-center">
            <div className=" mb-2">
                <div className="  font-semibold">Email</div>
                
                <input className=" text-black w-56 h-8 pl-2 rounded-md border-2 " onChange={(e)=>{
                    setEmailValue(e.target.value)
                }} type="text" placeholder="m@example.com" />
            </div>
        </div>
        <div className="flex justify-center items-center">
            <div className=" mb-2">
                <div className=" font-semibold">Name</div>
                <input className=" text-black w-56 h-8 pl-2 rounded-md border-2 " onChange={(e)=>{
                    setNameValue(e.target.value)
                }} type="text" placeholder="Enter your Name" />
            </div>
        </div>
        <div className="flex justify-center items-center">
            <div className=" mb-2">
                <div className=" font-semibold">Password</div>
                <input className=" text-black w-56 h-8 pl-2 rounded-md border-2 " onChange={(e)=>{
                    setPasswordValue(e.target.value)
                }} type="password" placeholder="Enter your password" />
            </div>
        </div>

        <div className="flex justify-center items-center mt-4">
            <div>
            <div className=" text-white">Already have an account? <button  onClick={()=>{
                navigate('/signin');
            }}>Login</button></div>
            <div className="flex justify-center items-center pl-4">
                <button className="bg-black text-white w-24 rounded-md h-8 shadow-2xl mt-2 mr-2" onClick={sendRequest} >Singup</button>
                <div className="flex bg-black text-white w-24 rounded-md h-8 shadow-2xl mt-2 ml-2">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="w-4 h-4 ml-4 mt-2">
  <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 5.25a3 3 0 0 1 3 3m3 0a6 6 0 0 1-7.029 5.912c-.563-.097-1.159.026-1.563.43L10.5 17.25H8.25v2.25H6v2.25H2.25v-2.818c0-.597.237-1.17.659-1.591l6.499-6.499c.404-.404.527-1 .43-1.563A6 6 0 1 1 21.75 8.25Z" />
</svg>
<button className="ml-2" >SSO</button>

                </div>
                

            </div>
            
            </div>
        </div>

            </div>
        </div>
        <div className="flex justify-center items-center bg-slate-900 h-screen shadow-2xl m-4 lg:visible invisible">
            <div className=" text-4xl text-white">Dynamic Wordle</div>
        </div>
        
    </div>
}

