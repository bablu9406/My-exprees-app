import React, { useEffect, useState } from "react"
import axios from "axios"

const Reels = () => {
  const [videos, setVideos] = useState([])

  useEffect(() => {
    axios.get("http://localhost:5000/api/video/all")
      .then(res => setVideos(res.data))
  }, [])

  return (
    <div style={{ height: "100vh", overflowY: "scroll" }}>
      {videos.map(video => (
        <video
          key={video._id}
          src={`http://localhost:5000/api/video/stream/${video._id}`}
          controls
          style={{ width: "100%", height: "100vh" }}
        />
      ))}
    </div>
  )
}

export default Reels