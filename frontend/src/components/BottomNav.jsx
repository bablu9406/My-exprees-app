import { Link } from "react-router-dom"

export default function BottomNav(){

return(

<div style={{
position:"fixed",
bottom:0,
left:0,
right:0,
display:"flex",
justifyContent:"space-around",
padding:"10px",
borderTop:"1px solid #ddd",
background:"#fff"
}}>

<Link to="/">🏠</Link>

<Link to="/reels">🎬</Link>

<Link to="/chat">💬</Link>

<Link to="/stories">⭕</Link>

<Link to="/live">🔴</Link>

</div>

)

}