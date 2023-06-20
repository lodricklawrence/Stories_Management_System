import Cookies from "js-cookie";
import React,{ useState,useEffect} from "react";
import { useNavigate } from 'react-router-dom';


export function HomePage(){
    const [token,setToken]=useState(null)
    const [id,setId]=useState(null);
    const[isLoaded,setIsLoaded]=useState(false);
    const [allBooks,setAllBooks]=useState([]);
    const [isRead,setIsRead]=useState(false);
    const [category,setCategory]=useState('');
    const [filename,setFileName]=useState('');
    const [fileDetail,setFileDetail]=useState('');
    const [searchValue,setSearchValue]=useState('');
    const [filteredBooks,setFilteredBooks]=useState([]);;
    const [isSearched,setIsSearched]=useState(false);
    const navigate=useNavigate();
    
    useEffect(() => {
        const cookie = Cookies.get("token");
        setToken(cookie);
      
        if (!cookie) {
          // No token found, navigate to another page
          navigate("/");
        } else {
          const [header, payload, signature] = cookie.split(".");
          const decodedPayload = atob(payload);
          const tokenPayload = JSON.parse(decodedPayload);
          setId(tokenPayload.userLogin.id);
        }
      }, [navigate]);

    useEffect(()=>{
        async function getBooks(){
            try {

                const response=await fetch(`http://localhost:4000/getFile/${id}`,{
                    method: 'GET',
                    headers: {
                        "Authorization": `Bearer ${token}`
                      }
                })
                const data=await response.json();
                setIsLoaded(true)
                if(isLoaded){
                    setAllBooks(data)
                }
            } catch (error) {
                
            }
        }

        getBooks()

    },[id,isLoaded])


    useEffect(()=>{
        if(isRead){
            async function readStory(){
                try {
                    const response=await fetch(`http://localhost:4000/readFile/${category}/${filename}/${id}`,{
                        method: 'GET',
                        headers: {
                            "Authorization": `Bearer ${token}`
                          }
                    })
                    const data=await response.json()
                    if(!response.ok){
                        throw new Error("server response was not okay")
                    }else{
                        const fileDetail=JSON.stringify(data);
                        setFileDetail(fileDetail);

                        if(fileDetail){
                            setIsRead(false)
                        }

                    }
                } catch (error) {
                 console.log(error)   
                }

            }
            readStory()
        }

    },[category,filename,id,isRead])

    
    const handleReadbutton=(e)=>{
        setIsRead(true);
        setCategory(e.target.id);
        setFileName(e.target.name);

    }

    const handleSearchChange=(e)=>{
        const searchData = e.target.value;
        setSearchValue(searchData);
        if (searchData.trim() === '') {
          setIsSearched(false);
          setFilteredBooks([]);
        } else {
          setIsSearched(true);
          const filteredBooks = allBooks.filter(obj => obj.category === searchData);
          setFilteredBooks(filteredBooks);
        }

    }

    return(
        
        <div style={{display:'flex',width:'100%',height:'100%',marginTop:'60px'}}>
            <div style={{width:'50%',backgroundColor:'cyan'}}>
                <div style={{paddingLeft:"100px"}}>
                    <h1>Stories</h1>
                </div>
                <div style={{paddingLeft:"100px"}}>
                    <p>SEARCH<input type="search" value={searchValue} onChange={handleSearchChange} /></p> 
                </div>
                <div style={{paddingLeft:"100px"}}>
                <table border={1} style={{borderCollapse:"collapse"}}>
                <tbody>
                    <tr>
                        <th>STORY_NAME</th>
                        <th>STORY_CATEGORY</th>
                        <th>READ_BUTTON</th>
                    </tr>
                        {!isSearched?allBooks.map((files,index)=>
                            files.files.map((name,index)=>
                                <tr key={index}>
                                    <td >{name}</td>
                                    <td >{files.category}</td>
                                    <td><button name={name} id={files.category} onClick={handleReadbutton} style={{backgroundColor:'aliceblue'}}>READ</button></td>
                                </tr>
                                )
                            
                        ): filteredBooks.map((files,index)=>
                                                files.files.map((name,index)=>
                                                    <tr key={index}>
                                                        <td >{name}</td>
                                                        <td >{files.category}</td>
                                                        <td><button name={name} id={files.category} onClick={handleReadbutton}>READ</button></td>
                                                    </tr>
                                                    )
                                                
                        ) }
                    </tbody>    
                </table>
                </div>
            </div>
            <div style={{width:'50%',backgroundColor:'gray',paddingLeft:'30px'}}>
            <h1>Story content</h1>  
            <p>{fileDetail}</p>
            </div>
        </div>
    )

    
}