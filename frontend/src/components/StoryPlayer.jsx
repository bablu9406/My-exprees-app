export default function StoryPlayer({story,onClose}){

return(

<div style={{
position:"fixed",
top:0,
left:0,
right:0,
bottom:0,
background:"black",
display:"flex",
alignItems:"center",
justifyContent:"center",
zIndex:1000
}}>

<button
onClick={onClose}
style={{
position:"absolute",
top:"20px",
right:"20px",
fontSize:"20px",
background:"white"
}}
>
✖
</button>

{story.image && (

<img
src={story.image}
style={{
maxHeight:"90%",
maxWidth:"90%"
}}
/>

)}

{story.videoUrl && (

<video
src={story.videoUrl}
controls
autoPlay
style={{
maxHeight:"90%",
maxWidth:"90%"
}}
/>

)}

</div>

)

}