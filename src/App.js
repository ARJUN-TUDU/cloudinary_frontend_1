import logo from './logo.svg';
import './App.css';
import {useState,useEffect,useRef} from 'react'
import axios from 'axios'

function App() {
   
 
  const [image,setImage] = useState();
  const [list,setList] = useState([]);

  const [flag,setFlag] = useState(false);
  
  const ref = useRef();

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

      if(secure_url){
        setFlag(true);
        ref.current.value = "";
        
      }

      
      await axios.post("https://cloudinary-1.vercel.app/upload",{
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
            const res = await axios.get("https://cloudinary-1.vercel.app/all_image");
            setList(res.data)
          }catch(e){
            console.log(e)
          }

    }
    getData();
    

  },[image,flag])

  return (
    <div className="App">
      <input  ref = {ref} type='file' onChange={e=>{
        setFlag(false);
        setImage(e.target.files[0])
      }} />
      
    

        {
          flag?"done":  <button onClick={uploading}><div>

          submit
         
         </div>
         
         </button>
         }
        
      {
        list.map((x)=>{
          return <div style = {{width:"50vw",height:"50vh",margin:"30px"}}>
            <img style={{width:"100%",height:"100%",objectFit:"cover"}}  src = {`${x.image}`} />
            {x.name}
          </div>
        })
      }
    </div>
  );
}

export default App;
