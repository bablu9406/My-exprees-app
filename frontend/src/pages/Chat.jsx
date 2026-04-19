import socket from "../socket/socket"
import { useState, useEffect } from "react"

export default function Chat(){

const [msg,setMsg] = useState("")
const [messages,setMessages] = useState([])

useEffect(()=>{

socket.on("message",(data)=>{
setMessages(prev=>[...prev,data])
})

return ()=>{
socket.off("message")
}

},[])

const sendMessage = ()=>{

if(!msg.trim()) return

socket.emit("message",{text:msg})

setMessages(prev=>[
...prev,
{text:msg}
])

setMsg("")

}

return(

<div style={{
maxWidth:"600px",
margin:"auto",
padding:"20px"
}}>

<h2>Chat</h2>

<div style={{
height:"400px",
overflowY:"auto",
border:"1px solid #ddd",
padding:"10px",
marginBottom:"10px"
}}>

{messages.map((m,i)=>(
<div key={i} style={{marginBottom:"5px"}}>
{m.text}
</div>
))}

</div>

<div style={{display:"flex"}}>

<input
value={msg}
onChange={e=>setMsg(e.target.value)}
style={{flex:1,padding:"8px"}}
/>

<button
onClick={sendMessage}
style={{marginLeft:"5px"}}
>
Send
</button>

</div>

</div>

)

}