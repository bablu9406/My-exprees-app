import { Link } from "react-router-dom"

export default function Navbar(){

return(

<div style={{
  display:"flex",
  justifyContent:"space-between",
  alignItems:"center",
  padding:"10px 20px",
  background:"#0f0f0f",
  color:"#fff",
  position:"sticky",
  top:0,
  zIndex:100,
  boxShadow:"0 2px 5px rgba(0,0,0,0.5)"
}}>

<h2>BabluApp</h2>

<div>


<Link to="/" style={{color:"#fff", marginRight:"15px"}}>🏠 Home</Link>
<Link to="/reels" style={{color:"#fff", marginRight:"15px"}}>🎬 Reels</Link>
<Link to="/chat" style={{color:"#fff", marginRight:"15px"}}>💬 Chat</Link>
<Link to="/profile" style={{color:"#fff"}}>👤</Link>

</div>

</div>

)

}