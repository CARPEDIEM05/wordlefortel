import axios from "axios";
import { useState } from "react"
import { BACKEND_URL } from "../config";
import { Navbar } from "../Division/Navbar";

export function InsertWord(){    
    const[word,setWord] = useState("");
    const[description,setDescription] = useState("");
    async function insertWord(){
        await axios.post(`${BACKEND_URL}/api/v1/game/word`,{
            word: word,
            description:description
        }).then((response)=>{
            const res = response.data.msg;
            alert(res);
        })
    }
    
    return <div>
        <Navbar></Navbar>
        <div className="flex justify-center items-center h-screen">
        <input className=" m-2 border-2 rounded-md w-40 h-10 pl-2" onChange={(e)=>{
            setWord(e.target.value);
        }} type="text" placeholder="word"/>


        <input className="m-2  border-2 rounded-md w-40 h-10 pl-2" onChange={(e)=>{
            setDescription(e.target.value);
        }} type="text" placeholder="description" />

        <button className=" w-40 h-10 bg-green-600 text-white rounded-md shadow-2xl" onClick={insertWord}>Insert word</button>

    </div>

    </div>
     
}