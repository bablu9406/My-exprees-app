import { useState } from "react"
import axios from "axios"

export default function Upload() {

  const [video, setVideo] = useState(null)
  const [thumbnail, setThumbnail] = useState(null)
  const [preview, setPreview] = useState("")
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [loading, setLoading] = useState(false)

  // 🎥 drag drop
  const handleDrop = (e) => {
    e.preventDefault()
    const file = e.dataTransfer.files[0]
    setVideo(file)
  }

  const handleUpload = async () => {
    if (!video) return alert("Select video first")

    const formData = new FormData()
    formData.append("video", video)
    formData.append("title", title)
    formData.append("description", description)

    if (thumbnail) {
      formData.append("thumbnail", thumbnail)
    }

    try {
      setLoading(true)

      await axios.post("http://localhost:5000/api/video/upload", formData)

      alert("Uploaded ✅")
      setLoading(false)

    } catch (err) {
      console.log(err)
      alert("Upload failed ❌")
      setLoading(false)
    }
  }

  return (
    <div style={{
      padding:"20px",
      color:"#fff",
      background:"#0f0f0f",
      minHeight:"100vh"
    }}>

      <h2>⬆ Upload Video</h2>

      {/* DRAG AREA */}
      <div
        onDrop={handleDrop}
        onDragOver={(e)=>e.preventDefault()}
        style={{
          border:"2px dashed #444",
          padding:"40px",
          textAlign:"center",
          borderRadius:"10px",
          marginBottom:"20px"
        }}
      >
        Drag & Drop Video Here 🎥
      </div>

      {/* INPUTS */}
      <input
        type="file"
        onChange={(e)=>setVideo(e.target.files[0])}
      /><br/><br/>

      <input
        type="file"
        onChange={(e)=>{
          setThumbnail(e.target.files[0])
          setPreview(URL.createObjectURL(e.target.files[0]))
        }}
      /><br/><br/>

      {/* PREVIEW */}
      {preview && (
        <img src={preview} alt=""
          style={{width:"200px", borderRadius:"10px"}}
        />
      )}

      <br/><br/>

      <input
        placeholder="Title"
        onChange={(e)=>setTitle(e.target.value)}
      /><br/><br/>

      <textarea
        placeholder="Description"
        onChange={(e)=>setDescription(e.target.value)}
      /><br/><br/>

      <button onClick={handleUpload}>
        {loading ? "Uploading..." : "Upload 🚀"}
      </button>

    </div>
  )
}