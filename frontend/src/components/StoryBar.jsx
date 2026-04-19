import { useEffect,useState } from "react"
import api from "../services/api"
import StoryPlayer from "./StoryPlayer"

export default function StoryBar(){

const [stories,setStories] = useState([])
const [activeStory,setActiveStory] = useState(null)

useEffect(()=>{

api.get("/stories")
.then(res=>setStories(res.data))
.catch(err=>console.log(err))

},[])

return(

<>

<div style={{
display:"flex",
overflowX:"auto",
padding:"10px",
borderBottom:"1px solid #ddd"
}}>

{stories.map(story=>(

<div
key={story._id}
onClick={()=>setActiveStory(story)}
style={{
marginRight:"10px",
cursor:"pointer"
}}
>

<img
src={story.user?.avatar || "https://i.pravatar.cc/60"}
style={{
width:"60px",
height:"60px",
borderRadius:"50%",
border:"3px solid #ff0060"
}}
/>

<p style={{fontSize:"12px"}}>
{story.user?.username}
</p>

</div>

))}

</div>

{activeStory &&

<StoryPlayer
story={activeStory}
onClose={()=>setActiveStory(null)}
/>

}

</>

)

}