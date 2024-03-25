
import { useNavigate } from "react-router-dom"
import { Navbar } from "../Division/Navbar";
import { Content } from "../Division/Content";

export function Home(){
    const token = localStorage.getItem("token");
    
    const naviagte = useNavigate();
    if(!token){
        naviagte("/signin");
    }
    

    return (
        <div className="h-full">
            
  <Navbar></Navbar>
  {/* Container for centering the content */}
    <Content />
  
</div>
    );
}

