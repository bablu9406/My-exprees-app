import { useEffect, useState } from "react"
import PostCard from "../components/PostCard"
import api from "../services/api"
import StoryBar from "../components/StoryBar"

export default function Feed(){

const [posts,setPosts] = useState([])
const [loading,setLoading] = useState(true)

useEffect(()=>{

api.get("/posts/feed")
.then(res=>{
setPosts(res.data)
setLoading(false)
})
.catch(err=>{
console.log(err)
setLoading(false)
})

},[])

return(

<div style={{
maxWidth:"600px",
margin:"auto",
padding:"20px"
}}>

<h2 style={{textAlign:"center"}}>Feed</h2>

{/* Stories */}
<StoryBar/>

{/* Loading */}
{loading && <p>Loading posts...</p>}

{/* Posts */}

{posts.map(post=>(
<PostCard key={post._id} post={post}/>
))}

</div>

)

}