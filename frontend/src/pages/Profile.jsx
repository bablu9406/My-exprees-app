import { useEffect, useState } from "react"
import api from "../services/api"
import PostCard from "../components/PostCard"

export default function Profile(){

const [user,setUser] = useState(null)
const [posts,setPosts] = useState([])

useEffect(()=>{

api.get("/users/me")
.then(res=>setUser(res.data))

api.get("/posts/user")
.then(res=>setPosts(res.data))

},[])

if(!user) return <p>Loading...</p>

return(

<div style={{
maxWidth:"700px",
margin:"auto",
padding:"20px"
}}>

<div style={{
display:"flex",
alignItems:"center",
marginBottom:"20px"
}}>

<img
src={user.avatar || "https://i.pravatar.cc/100"}
style={{
width:"80px",
height:"80px",
borderRadius:"50%",
marginRight:"20px"
}}
/>

<div>

<h2>{user.username}</h2>

<p>

Followers: {user.followers?.length || 0}

</p>

<p>

Following: {user.following?.length || 0}

</p>

</div>

</div>

<h3>Your Posts</h3>

{posts.map(post=>(
<PostCard key={post._id} post={post}/>
))}

</div>

)

}