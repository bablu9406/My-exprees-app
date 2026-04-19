import { useEffect, useState } from "react"
import api from "../services/api"

export default function Notifications(){

const [notifications,setNotifications] = useState([])

useEffect(()=>{

api.get("/notifications")
.then(res=>setNotifications(res.data))
.catch(err=>console.log(err))

},[])

return(

<div style={{
maxWidth:"600px",
margin:"auto",
padding:"20px"
}}>

<h2>Notifications</h2>

{notifications.length === 0 && <p>No notifications</p>}

{notifications.map(n=>(

<div key={n._id} style={{
borderBottom:"1px solid #ddd",
padding:"10px"
}}>

{n.text}

</div>

))}

</div>

)

}