import {useState} from "react"

export default function PostCard({post}){

const [liked,setLiked] = useState(false)

return(

<div style={{
border:"1px solid #ddd",
borderRadius:"10px",
marginBottom:"25px",
background:"#fff",
overflow:"hidden"
}}>

{/* Header */}

<div style={{
display:"flex",
alignItems:"center",
padding:"10px"
}}>

<img
src={post.user?.avatar || "https://i.pravatar.cc/40"}
style={{
width:"40px",
height:"40px",
borderRadius:"50%",
marginRight:"10px"
}}
/>

<b>{post.user?.username}</b>

</div>

{/* Image */}

{post.image && (
<img
src={post.image}
style={{
width:"100%",
maxHeight:"500px",
objectFit:"cover"
}}
/>
)}

{/* Video */}

{post.videoUrl && (

<video
src={post.videoUrl}
controls
style={{
width:"100%",
maxHeight:"500px"
}}
/>

)}

{/* Actions */}

<div style={{
padding:"10px"
}}>

<button onClick={()=>setLiked(!liked)}>
{liked ? "❤️ Liked" : "🤍 Like"}
</button>

<button style={{marginLeft:"10px"}}>
💬 Comment
</button>

<button style={{marginLeft:"10px"}}>
📤 Share
</button>

</div>

{/* Caption */}

<div style={{
padding:"10px"
}}>

<b>{post.user?.username}</b> {post.caption}

</div>

</div>

)

}