import axios from "axios";
import { useState } from "react"
import { BACKEND_URL } from "../config";

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
        <input onChange={(e)=>{
            setWord(e.target.value);
        }} type="text" placeholder="word"/>


        <input onChange={(e)=>{
            setDescription(e.target.value);
        }} type="text" placeholder="description" />

        <button onClick={insertWord}>Insert word</button>

    </div>
}