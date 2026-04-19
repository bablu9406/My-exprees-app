import React from "react"
import { Link } from "react-router-dom"

const VideoCard = ({ video }) => {

  const thumbnail = video?.thumbnail
    ? `http://localhost:5000/${video.thumbnail}`
    : "https://via.placeholder.com/300x180?text=No+Thumbnail"

  return (
    <Link
      to={`/watch/${video._id}`}
      style={{ textDecoration: "none", color: "#fff" }}
    >
      <div style={{
        width: "300px",
        margin: "12px",
        cursor: "pointer"
      }}>

        {/* THUMBNAIL */}
        <div style={{ position: "relative" }}>
          <img
            src={thumbnail}
            alt="thumbnail"
            style={{
              width: "100%",
              height: "180px",
              objectFit: "cover",
              borderRadius: "10px"
            }}
          />

          {/* DURATION (optional) */}
          {video.duration > 0 && (
            <span style={{
              position: "absolute",
              bottom: "8px",
              right: "8px",
              background: "rgba(0,0,0,0.7)",
              padding: "2px 6px",
              fontSize: "12px",
              borderRadius: "4px"
            }}>
              {formatTime(video.duration)}
            </span>
          )}
        </div>

        {/* INFO */}
        <div style={{
          display: "flex",
          marginTop: "10px"
        }}>

          {/* PROFILE PIC */}
          <img
            src={video.user?.profilePic || "https://via.placeholder.com/40"}
            alt=""
            style={{
              width: "36px",
              height: "36px",
              borderRadius: "50%",
              marginRight: "10px"
            }}
          />

          {/* TEXT */}
          <div>
            <h4 style={{
              fontSize: "14px",
              margin: 0,
              color: "#fff"
            }}>
              {video.title}
            </h4>

            <p style={{
              fontSize: "12px",
              color: "#aaa",
              margin: "4px 0"
            }}>
              {video.user?.username}
            </p>

            <p style={{
              fontSize: "12px",
              color: "#aaa"
            }}>
              {video.views} views
            </p>
          </div>

        </div>

      </div>
    </Link>
  )
}
<Link to={`/edit/${video._id}`} style={{color:"#aaa", fontSize:"12px"}}>
  ✏ Edit
</Link>

// 🔥 helper (seconds → mm:ss)
function formatTime(sec) {
  const minutes = Math.floor(sec / 60)
  const seconds = sec % 60
  return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`
}

<button
  onClick={(e)=>{
    e.preventDefault()
    axios.delete(`http://localhost:5000/api/video/${video._id}`)
      .then(()=> window.location.reload())
  }}
  style={{color:"red"}}
>
  🗑 Delete
</button>
export default VideoCard