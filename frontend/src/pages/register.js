import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from 'react-router-dom';

export function RegisterForm(){
    const usernameRef = useRef(null);
    const passwordRef = useRef(null);
    const [username,setUsername]=useState('');
    const [password,setPassword]=useState('');
    const [submitted, setSubmitted] = useState(false);
    const [message,setMessage]=useState('');
    const [isUsernameFilled,setIsUsernameFilled]=useState(false);
    const [isPasswordFilled,setIsPasswordFilled]=useState(false);

    const navigate=useNavigate();
   
    useEffect(()=>{
        if(submitted){
            async function sendData(){
                const response=await fetch('http://localhost:4000/register',{
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
                const responseMessage=data.message;
                setMessage(responseMessage)
                if(responseMessage==="registration is successfull"){
                    alert(responseMessage+" you are directed in the login page");
                    navigate('/');
                }else{
                    setSubmitted(false);
                }
            }
            sendData();
        }
    },[submitted,navigate,username,password])

    const handleUsernameChange=(event)=>{
        setUsername(event.target.value);
    }

    const handlePasswordChange=(event)=>{
        setPassword(event.target.value);
    }

    const handleSubmit=async (event)=>{
        event.preventDefault();
        if(username===''){
            setIsUsernameFilled(true);
            usernameRef.current.focus();
        }else if( password===''){
            setIsPasswordFilled(true);
            passwordRef.current.focus();
        }

        if(username !==''){
            setIsUsernameFilled(false);
        }else if(password!==''){
            setIsPasswordFilled(false);
        }
        setSubmitted(true);
        
    }

    return(
        <form onSubmit={handleSubmit} style={{
            margin:"100px 300px",border:"1px solid black",padding:"10px 200px",
            backgroundColor:'cyan'
            
            }}>
            <h1>Registration</h1>
           <table>
            <tbody>
            <tr>
                <td>
                    <label>
                    Username:
                    <input type="text" value={username} onChange={handleUsernameChange} ref={usernameRef}/>
                    {isUsernameFilled?
                        (
                            <span style={{color:'red'}}>username should not be empty</span>
                        ):null}
                    </label>
                </td>
            </tr>
            <tr>
                <td>
                    <label>
                    Password:
                    <input type="password"value={password} onChange={handlePasswordChange} ref={passwordRef}/>
                    {isPasswordFilled?  (
                            <span style={{color:'red'}}>password should not be empty</span>
                        ):null}
                    </label>
                </td>
            </tr>
            <tr>
                <td>
                <input type="submit" value="SUBMIT" />
                </td>
            </tr>
            <tr>
                <td>
                {message}
                </td>
            </tr>
            </tbody>         
          </table>
        </form>

        
    )

}
