import { useRef, useEffect } from "react"

export default function ReelPlayer({video}){

const videoRef = useRef()

useEffect(()=>{

const observer = new IntersectionObserver(

entries=>{
entries.forEach(entry=>{

if(entry.isIntersecting){
videoRef.current.play()
}else{
videoRef.current.pause()
}

})

},
{threshold:0.8}

)

observer.observe(videoRef.current)

return ()=>observer.disconnect()

},[])

return(

<div style={{
height:"100vh",
scrollSnapAlign:"start",
display:"flex",
justifyContent:"center",
alignItems:"center"
}}>

<video
ref={videoRef}
src={video}
loop
muted
controls
style={{
height:"100%",
maxWidth:"500px",
objectFit:"cover"
}}
/>

</div>

)

}