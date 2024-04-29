import logo from './logo.svg';
import './App.css';
import {useState,useEffect} from 'react'
import axios from 'axios'

function App() {
   
 
  const [image,setImage] = useState();
  const [list,setList] = useState([]);
 

  const uploading = async ()=>{

    const formData = new FormData();
    
    formData.append("file",image);
    formData.append("upload_preset","images_preset")

    try{
      const cloudinary_name = "dubhkwfw6"
      const resource_type = "image"
      const api = `https://api.cloudinary.com/v1_1/${cloudinary_name}/${resource_type}/upload`;
      const res = await axios.post(api,formData);
      

      const {secure_url} = res.data;
      const {original_filename} = res.data;

      
      await axios.post("http://localhost:5000/upload",{
        image:secure_url,
        name:original_filename
      })
     
    }catch(e){
      console.log(e);
    }

  }
   
  useEffect(()=>{
     
    const getData = async() => {
          try{
            const res = await axios.get("http://localhost:5000/all_image");
            setList(res.data)
          }catch(e){
            console.log(e)
          }

    }
    getData();
    

  },[image])

  return (
    <div className="App">
      <input type='file' onChange={e=>setImage(e.target.files[0])} />
      
      <button onClick={uploading}>submit</button>
      {
        list.map((x)=>{
          return <div style = {{width:"50vw",height:"50vh",margin:"30px"}}>
            <img style={{width:"100%",height:"100%"}}  src = {`${x.image}`} />
            {x.name}
          </div>
        })
      }
    </div>
  );
}

export default App;
