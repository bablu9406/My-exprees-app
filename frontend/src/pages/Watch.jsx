import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import axios from "axios"

// ✅ API BASE
const API = process.env.REACT_APP_API || "http://localhost:5000"

export default function Watch() {
  const { id } = useParams()

  const [video, setVideo] = useState(null)
  const [recommended, setRecommended] = useState([])
  const [comments, setComments] = useState([])
  const [text, setText] = useState("")

  // ================= LOAD DATA =================
  useEffect(() => {
    window.scrollTo(0, 0) // ✅ UX fix

    const load = async () => {
      try {
        const v = await axios.get(`${API}/api/video/${id}`)
        setVideo(v.data)

        const r = await axios.get(`${API}/api/video/all`)
        setRecommended(r.data)

        const c = await axios.get(`${API}/api/comments/${id}`)
        setComments(c.data)
      } catch (err) {
        console.error("❌ Load error:", err)
      }
    }

    load()
  }, [id])

  // ================= ADD COMMENT =================
  const addComment = async () => {
    if (!text.trim()) return

    try {
      await axios.post(`${API}/api/comments/${id}`, { text })
      setText("")

      const res = await axios.get(`${API}/api/comments/${id}`)
      setComments(res.data)
    } catch (err) {
      console.error("❌ Comment error:", err)
    }
  }

  // ================= SUBSCRIBE =================
  const subscribe = async () => {
    try {
      await axios.post(`${API}/api/users/subscribe/${video.user._id}`)
      alert("Subscribed ✅")
    } catch (err) {
      console.error("❌ Subscribe error:", err)
    }
  }

  if (!video) return <h2 style={{ color: "#fff" }}>Loading...</h2>

  // ================= UI =================
  return (
    <div style={{ display: "flex", background: "#0f0f0f", color: "#fff" }}>
      
      {/* LEFT */}
      <div style={{ flex: 3, padding: "20px" }}>

        <video
          src={`${API}/api/video/stream/${video._id}`}
          controls
          style={{
            width: "100%",
            borderRadius: "10px",
            background: "#000"
          }}
        />

        <h2 style={{ marginTop: "15px" }}>{video.title}</h2>

        {/* USER */}
        <div style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginTop: "10px"
        }}>
          <div style={{ display: "flex", alignItems: "center" }}>
            <img
              src={video.user?.profilePic || "https://via.placeholder.com/40"}
              style={{
                width: 40,
                height: 40,
                borderRadius: "50%",
                marginRight: "10px"
              }}
              alt=""
            />
            <div>
              <b>{video.user?.username}</b>
              <div style={{ fontSize: "12px", color: "#aaa" }}>
                {video.views} views
              </div>
            </div>
          </div>

          <button onClick={subscribe} style={btn}>🔔 Subscribe</button>
        </div>

        {/* ACTION */}
        <div style={{ marginTop: "10px" }}>
          <button style={btn}>👍 {video.likes?.length}</button>
          <button style={btn}>👎 {video.dislikes?.length}</button>
        </div>

        {/* DESCRIPTION */}
        <div style={{
          marginTop: "15px",
          background: "#181818",
          padding: "10px",
          borderRadius: "10px"
        }}>
          {video.description}
        </div>

        {/* COMMENTS */}
        <div style={{ marginTop: "20px" }}>
          <h3>💬 Comments</h3>

          <div style={{ display: "flex", marginTop: "10px" }}>
            <input
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Write a comment..."
              style={{
                flex: 1,
                padding: "10px",
                borderRadius: "5px",
                border: "none"
              }}
            />
            <button onClick={addComment} style={btn}>Send</button>
          </div>

          {comments.map(c => (
            <div key={c._id} style={{ marginTop: "10px" }}>
              <b>{c.user?.username}</b>
              <p>{c.text}</p>
            </div>
          ))}
        </div>
      </div>

      {/* RIGHT */}
      <div style={{
        flex: 1,
        padding: "20px",
        borderLeft: "1px solid #222"
      }}>
        <h3>📺 Recommended</h3>

        {recommended.map(v => (
          <div
            key={v._id}
            style={{
              display: "flex",
              marginBottom: "15px",
              cursor: "pointer"
            }}
            onClick={() => window.location.href = `/watch/${v._id}`}
          >
            <img
              src={v.thumbnail || "https://via.placeholder.com/120"}
              style={{
                width: 120,
                height: 70,
                objectFit: "cover",
                borderRadius: "8px",
                marginRight: "10px"
              }}
              alt=""
            />

            <div>
              <div style={{ fontSize: "14px" }}>{v.title}</div>
              <div style={{ fontSize: "12px", color: "#aaa" }}>
                {v.user?.username}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

// ================= BUTTON STYLE =================
const btn = {
  background: "#222",
  color: "#fff",
  border: "none",
  padding: "8px 12px",
  marginLeft: "10px",
  borderRadius: "8px",
  cursor: "pointer"
}