import { useState } from "react"
import socket from "../socket/socket"

export default function LivePlayer({stream}){

const [msg,setMsg] = useState("")
const [chat,setChat] = useState([])

socket.on("live-message",(data)=>{
setChat(prev=>[...prev,data])
})

const sendMessage = ()=>{

if(!msg.trim()) return

socket.emit("live-message",{text:msg})

setChat(prev=>[
...prev,
{text:msg}
])

setMsg("")

}

return(

<div style={{
border:"1px solid #ddd",
padding:"15px",
marginBottom:"20px"
}}>

<h3>{stream.title}</h3>

<video
src={stream.videoUrl}
controls
autoPlay
style={{
width:"100%",
maxHeight:"400px"
}}
/>

{/* Live chat */}

<div style={{
marginTop:"10px",
borderTop:"1px solid #ddd",
paddingTop:"10px"
}}>

<div style={{
height:"150px",
overflowY:"auto",
border:"1px solid #eee",
padding:"5px",
marginBottom:"5px"
}}>

{chat.map((c,i)=>(
<div key={i}>{c.text}</div>
))}

</div>

<input
value={msg}
onChange={e=>setMsg(e.target.value)}
placeholder="Live chat..."
/>

<button onClick={sendMessage}>
Send
</button>

</div>

</div>

)

}