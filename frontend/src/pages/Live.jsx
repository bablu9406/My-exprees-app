import { useEffect, useState } from "react"
import api from "../services/api"
import LivePlayer from "../components/LivePlayer"

export default function Live(){

const [streams,setStreams] = useState([])

useEffect(()=>{

api.get("/live")
.then(res=>setStreams(res.data))
.catch(err=>console.log(err))

},[])

return(

<div style={{
maxWidth:"900px",
margin:"auto",
padding:"20px"
}}>

<h2>Live Streams</h2>

{streams.map(stream=>(
<LivePlayer
key={stream._id}
stream={stream}
/>
))}

</div>

)

}