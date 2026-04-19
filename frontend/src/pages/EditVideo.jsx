import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import axios from "axios"

export default function EditVideo() {

  const { id } = useParams()
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")

  useEffect(()=>{
    axios.get(`http://localhost:5000/api/video/${id}`)
      .then(res=>{
        setTitle(res.data.title)
        setDescription(res.data.description)
      })
  },[id])

  const handleUpdate = async () => {
    try {
      await axios.put(`http://localhost:5000/api/video/${id}`, {
        title,
        description
      })

      alert("Updated ✅")

    } catch (err) {
      alert("Error ❌")
    }
  }

  return (
    <div style={{padding:"20px", color:"#fff"}}>
      <h2>Edit Video ✏</h2>

      <input
        value={title}
        onChange={(e)=>setTitle(e.target.value)}
      /><br/><br/>

      <textarea
        value={description}
        onChange={(e)=>setDescription(e.target.value)}
      /><br/><br/>

      <button onClick={handleUpdate}>
        Save Changes 💾
      </button>
    </div>
  )
}