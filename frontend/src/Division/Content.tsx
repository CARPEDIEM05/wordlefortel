import axios from "axios";
import { useEffect, useState } from "react";
import { BACKEND_URL } from "../config";

type Matrix = number[][];
type MatrixChar= string[][];


export function Content(){
    const token = localStorage.getItem("token");

    const [finalAnswerCheck, setFinalAnswerCheck] = useState(false);
    const[count,setCount] = useState(0);
    const[description,setDescription] = useState('');
    let length = 0;    
    const [matrixNumber, setMatrixNumber] = useState<Matrix>(Array.from({ length: 6 }, () => Array(5).fill(-1)));
    const [matrixChar, setMatrixChar] = useState<MatrixChar>(Array.from({ length: 6 }, () => Array(5).fill('')));
   
    const [chance, setChance] = useState(6);
    const [inputWord, setInputWord] = useState('');
    

    useEffect(()=>{
        getLength();
    },[chance])

    async function getLength(){
        try{
            await axios.get(`${BACKEND_URL}/api/v1/game/length`,{
                headers: {
                    'Authorization': `Bearer ${token}`
                }
        }).then((response)=>{
            length = response.data.length;
            setChance(length === 4 ? 5 : length === 5 ? 6 : 7);
            console.log(length);
            const updatedMatrixNumber: Matrix = Array.from({ length: chance }, () => Array(length).fill(-1));
            const updatedMatrixChar: MatrixChar = Array.from({ length: chance }, () => Array(length).fill(''));

            setMatrixNumber(updatedMatrixNumber);
            setMatrixChar(updatedMatrixChar);
        })
    } catch(e){
        console.log("Error in length");
    }
}

   async function handleGuess() {
        // Reset checkArray
        try{
            console.log(inputWord);
            console.log(inputWord.length);
            
            const resAxios = await axios.post(`${BACKEND_URL}/api/v1/game/check`,{
                inputWord: inputWord
            }).then((response)=>{
                if(!response.data){
                    return false;
            }

                const numberAsString: string = response.data.result+'';
                
       
                console.log(numberAsString);
                console.log("numberAsString.length "+numberAsString.length);

                const dataFromBe: number[] = [];
                for(let i = 0; i < numberAsString.length; i++){
                    dataFromBe.push(parseInt(numberAsString.charAt(i), 10));
                }

                const descriptionResult = response.data.description;
                if(descriptionResult!=null){
                    setDescription(descriptionResult);
                    setFinalAnswerCheck(true);
                }

                // const dataFromBe: number[] = Array.from(numberAsString).map(char => parseInt(char, 10));
                

                // Create new matrices to update state immutably
                const newMatrixChar = [...matrixChar];
                const newMatrixNumber = [...matrixNumber];
                
                
                for (let i = 0; i < newMatrixNumber[0].length; i++) {    
                    // Ensure to also copy the sub-array to avoid mutating the original state
                    newMatrixChar[count] = [...newMatrixChar[count]];
                    newMatrixNumber[count] = [...newMatrixNumber[count]];

                    newMatrixChar[count][i] = inputWord[i] || ''; // Fallback to empty string if inputWord[i] is undefined
                    newMatrixNumber[count][i] = Number(dataFromBe[i]);
                }

                // Update the state with the new matrices
                setMatrixChar(newMatrixChar);
                setMatrixNumber(newMatrixNumber);

                setCount(count + 1);
                return true;
                
            })
            if(!resAxios){
                alert("Please add the valid word");
            }
        } catch(e) {
            console.log(e);
            console.log("Error is there");
        }
        

    }

    


    return <div className="flex justify-center items-center h-full font-serif mt-4 " >
        
    <div className="text-center">
        
      <div className=" mt-4 mb-4 text-2xl">Guess today's word</div>
      <div>
          <input className=" text-center shadow-2xl border-2 rounded-md w-56 h-10"
              onChange={(e) => setInputWord(e.target.value.toUpperCase())}
              type="text"
              placeholder="Word"
          />
      </div>
      <div>
      </div>
      {!finalAnswerCheck  && (
        <div>
          <button  className=" my-4 bg-black text-white rounded-md w-56 h-8" onClick={handleGuess}>Check word</button>
        </div>
      )}
      {/* Render Box component with checkArray */}

      
      <div className="items-center grid h mt-10">
        <Row  arr={matrixNumber} arrString={matrixChar} />
        {finalAnswerCheck && <div className="ml-10 justify-center items-center mt-4 shadow-2xl w-64 pl-8 pr-8 rounded-md pt-4 pb-4">{description}</div>}
      </div>
     

    </div>
  </div>
}


interface TypesBox {
    arr: number[],
    arrString: string [],
}

interface TypeRow{
    arr: number[][],
    arrString: string[][]
}


function Row({arr,arrString}:TypeRow){
    let cnt = 0;
    
    return (
        <div >
    {arr.map((item, i) => (
        <Box key={cnt++}  arr={item} arrString={arrString[i]} />
    ))}
</div>

    );
}


function Box({  arr, arrString }: TypesBox) {

//    console.log('box' + arrString);
    // A function to determine the background color based on the value
    const getBackgroundColor = (value: Number): string => {
      

        switch (value) {
            case 2: return 'green'; // Correct letter and position
            case 1: return 'orange'; // Correct letter, wrong position
            case 0: return 'grey'; // Incorrect letter
            case -1: return 'black'; // Default/unchecked
            default: return 'red'; // Fallback for unexpected values
        }
    };

    return (
        <div className="flex">
            {arrString.map((item, i) => (
                <div 
                    className="box-border h-16 w-16 m-1 shadow-2xl items-center p-4 text-center font-bold text-2xl text-white"
                    style={{ backgroundColor: getBackgroundColor(Number(arr[i]))}}
                    key={i}>
                    {item}
                </div>
            ))}
        </div>
    );
}
