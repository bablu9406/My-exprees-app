import { useEffect, useState } from "react"
import axios from "axios"

export default function Studio() {
  const [videos, setVideos] = useState([])

  useEffect(() => {
    axios.get("/api/video/all")
      .then(res => setVideos(res.data))
  }, [])

  return (
    <div style={{padding:"20px", color:"#fff"}}>
      <h2>🎬 Your Studio</h2>

      {videos.map(v => (
        <div key={v._id} style={{
          background:"#222",
          padding:"10px",
          marginTop:"10px",
          borderRadius:"10px"
        }}>
          <h3>{v.title}</h3>
          <p>👁 {v.views} | 👍 {v.likes.length}</p>
        </div>
      ))}
    </div>
  )
}