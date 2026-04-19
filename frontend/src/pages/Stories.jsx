import axios from "axios"
import { useEffect,useState } from "react"
import StoryPlayer from "../components/StoryPlayer"

export default function Stories(){

 const [stories,setStories] = useState([])

 useEffect(()=>{

  axios.get("/api/stories")
  .then(res=>setStories(res.data))

 },[])

 return(

  <div>

   {stories.map(s=>(
    <StoryPlayer
     key={s._id}
     story={s}
    />
   ))}

  </div>

 )

}