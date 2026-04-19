import React, { useEffect, useState } from "react"
import axios from "axios"
import VideoCard from "../components/VideoCard"

const Home = () => {
  const [videos, setVideos] = useState([])

  useEffect(() => {
    axios.get("http://localhost:5000/api/video/all")
      .then(res => setVideos(res.data))
  }, [])

  return (
    <div style={{ display: "flex", flexWrap: "wrap" }}>
      {videos.map(video => (
        <VideoCard key={video._id} video={video} />
      ))}
    </div>
  )
}

export default Home