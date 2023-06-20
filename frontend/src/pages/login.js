import React, { useState,useEffect } from "react";
import { useNavigate,Link} from "react-router-dom";
import Cookies from 'js-cookie';

export function LoginForm(){
    const [username,setUsername]=useState('');
    const [password,setPassword]=useState('');
    const [submitted, setSubmitted] = useState(false);
    const [message,setMessage]=useState('');
    const navigate=useNavigate();

    useEffect(()=>{   
        if(submitted){
            async function sendData(){
                try {
                    const response=await fetch('http://localhost:4000/login',{
                        method: 'POST',
                        headers: {
                          'Content-Type': 'application/json'
                        },
                        body:JSON.stringify({
                            username:username,
                            password:password
                        })
                    })
        
                    const data= await response.json();
                    if(!response.ok){
                        throw new Error("Server response was not okay");
                    }else{

                        const responseMessage=data.message;
                        setMessage(responseMessage);
                        if(responseMessage==="login successfully"){
                            alert(responseMessage+" you are directed in the Home page");
                            navigate(`/home`);
                            Cookies.set('token',data.token, { expires: 2 / (24 * 60) });
                        }else{
                            setSubmitted(false)
                        }

                    }     
                    
                }
                catch (error) {
                   console.log(error) ;
                }
                
            }
            sendData();
        }

    },[submitted,navigate,username,password])
   

    const handleUsernameChange=(event)=>{
        setUsername(event.target.value);
    }

    const handlePasswordChange=(event)=>{
        setPassword(event.target.value);;
  
    }

    const handleSubmit=(event)=>{
        event.preventDefault();
            setSubmitted(true) ;
        
    }


    return(
        <div>
        <form onSubmit={handleSubmit} style={{
            margin:"100px 300px",border:"1px solid black",padding:"10px 200px",
            backgroundColor:'cyan'
            }}>
            <h1>Login</h1>
           <table>
            <tbody>
            <tr>
                <td>
                    <label>
                    Username:
                    <input type="text" id="name" value={username} onChange={handleUsernameChange}/>
                    </label>
                </td>
            </tr>
            <tr>
                <td>
                    <label>
                    Password:
                    <input type="password" id="pass" value={password} onChange={handlePasswordChange}/>
                    </label>
                </td>
            </tr>
            <tr>
                <td style={{paddingLeft:'100px'}}>
                <input type="submit" value="Login"  />
                </td>
            </tr>
            <tr>
                <td>
                {message}
                </td>
            </tr>
            <tr>
                <td>
                <Link to='/register'>You dont have an account?Register here!!</Link>
                </td>
            </tr>
            </tbody>           
          </table>
        </form>
        </div>
        
    )

}