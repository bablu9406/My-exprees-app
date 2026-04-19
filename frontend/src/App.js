import { BrowserRouter, Routes, Route, Link } from "react-router-dom"
import { useEffect, useRef, useState } from "react"
import socket from "./socket"

import Sidebar from "./components/Sidebar"
import Upload from "./pages/Upload"
import EditVideo from "./pages/EditVideo"
import Home from "./pages/Home"
import Reels from "./pages/Reels"
import Feed from "./pages/Feed"
import Profile from "./pages/Profile"

const API = process.env.REACT_APP_API || "http://localhost:5000"

function App() {

  // ================= STATES =================
  const [onlineUsers, setOnlineUsers] = useState([])
  const [messages, setMessages] = useState([])
  const [message, setMessage] = useState("")
  const [selectedUser, setSelectedUser] = useState(null)
  const [unreadCounts, setUnreadCounts] = useState({})
  const [typingUser, setTypingUser] = useState(null)
  const [search, setSearch] = useState("")
  const [image, setImage] = useState(null)
  const [notifications, setNotifications] = useState([])
  const bottomRef = useRef(null)
  const typingTimeoutRef = useRef(null)
  const [open, setOpen] = useState(false)

  const [userId] = useState("user_" + Math.floor(Math.random() * 10000))
  
  useEffect(() => {
  socket.on("newNotification", (data) => {
    setNotifications(prev => [data, ...prev])
  })

  return () => socket.off("newNotification")
}, [])


  // ================= SOCKET JOIN =================
  useEffect(() => {
    socket.emit("join", userId)
  }, [userId])

  // ================= SOCKET LISTEN =================
  useEffect(() => {

    socket.on("newComment", (data) => {
      console.log("🔥 New Comment:", data)
    })

    socket.on("commentLiked", (data) => {
      console.log("❤️ Comment liked:", data)
    })

    socket.on("videoUpdated", (data) => {
      console.log("🎥 Video updated:", data)
    })

    return () => {
      socket.off("newComment")
      socket.off("commentLiked")
      socket.off("newNotification")
      socket.off("videoUpdated")
    }

  }, [])

  // ================= CHAT RECEIVE =================
  useEffect(() => {

    const handleMessage = (data) => {
      const isCurrent =
        selectedUser &&
        (
          (data.sender === userId && data.receiver === selectedUser) ||
          (data.sender === selectedUser && data.receiver === userId)
        )

      if (isCurrent) {
        setMessages(prev => {
          const exists = prev.find(m => m._id === data._id)
          if (exists) return prev
          return [...prev, data]
        })
      } else if (data.sender !== userId) {
        setUnreadCounts(prev => ({
          ...prev,
          [data.sender]: (prev[data.sender] || 0) + 1
        }))
      }
    }

    socket.on("chat-message", handleMessage)
    return () => socket.off("chat-message", handleMessage)

  }, [selectedUser, userId])

  // ================= ONLINE USERS =================
  useEffect(() => {
    socket.on("online-users", setOnlineUsers)
    return () => socket.off("online-users")
  }, [])

  // ================= FETCH OLD =================
  useEffect(() => {
    if (!selectedUser) return

    fetch(`${API}/api/messages/${userId}/${selectedUser}`)
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) setMessages(data)
      })

  }, [selectedUser, userId])

  // ================= AUTO SCROLL =================
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  // ================= SEND MESSAGE =================
  const sendMessage = async () => {

    if (!message.trim() && !image) return
    if (!selectedUser) return

    let imageUrl = null

    if (image) {
      const formData = new FormData()
      formData.append("file", image)

      const res = await fetch(`${API}/api/upload`, {
        method: "POST",
        body: formData
      })

      const data = await res.json()
      imageUrl = data.url
    }

    socket.emit("chat-message", {
      sender: userId,
      receiver: selectedUser,
      text: message,
      image: imageUrl
    })

    setMessage("")
    setImage(null)
  }

  // ================= UI =================
  const ChatUI = () => (
    <div style={{ padding: 20 }}>
      <h2>💬 Chat</h2>

      <div style={{ display: "flex", gap: 20 }}>

        {/* USERS */}
        <div style={{ width: 250 }}>
          <input
            placeholder="Search user"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          {onlineUsers.map(u => (
            <div key={u} onClick={() => setSelectedUser(u)}>
              🟢 {u} ({unreadCounts[u] || 0})
            </div>
          ))}
        </div>

        {/* CHAT */}
        <div style={{ flex: 1 }}>
          {messages.map(m => (
            <div key={m._id}>
              <b>{m.sender}</b>: {m.text}
              {m.image && <img src={m.image} width="200" alt="" />}
            </div>
          ))}

          <div ref={bottomRef}></div>

          <input
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          />

          <input type="file" onChange={(e) => setImage(e.target.files[0])} />

          <button onClick={sendMessage}>Send</button>
        </div>

      </div>
    </div>
  )

  // ================= MAIN =================
  return (
    <BrowserRouter>

      <div style={{ display: "flex", gap: 20, padding: 10, alignItems: "center" }}>
  <Link to="/">🏠 Home</Link>
  <Link to="/reels">🎬 Reels</Link>
  <Link to="/feed">📰 Feed</Link>
  <Link to="/profile">👤 Profile</Link>
  <Link to="/chat">💬 Chat</Link>
  <Link to="/upload">⬆ Upload</Link>

  {/* 🔔 NOTIFICATION */}
  <div style={{ position: "relative", cursor: "pointer" }}
       onClick={() => setOpen(!open)}>

    🔔 {notifications.length}

    {open && (
      <div style={{
        position: "absolute",
        top: 30,
        right: 0,
        background: "#fff",
        border: "1px solid #ccc",
        padding: 10,
        width: 250,
        maxHeight: 300,
        overflowY: "auto",
        zIndex: 999
      }}>
        {notifications.length === 0 && <div>No notifications</div>}

        {notifications.map((n, i) => (
          <div key={i} style={{
            borderBottom: "1px solid #eee",
            padding: 5
          }}>
            {n.message}
          </div>
        ))}
      </div>
    )}
  </div>
</div>

<div onClick={() => setOpen(!open)}>
  🔔 {notifications.length}

  {open && (
    <div> ... </div>
  )}
</div>

        
      <div style={{ display: "flex" }}>
        <Sidebar />

        <div style={{ marginLeft: 220, width: "100%" }}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/reels" element={<Reels />} />
            <Route path="/feed" element={<Feed />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/chat" element={<ChatUI />} />
            <Route path="/upload" element={<Upload />} />
            <Route path="/edit/:id" element={<EditVideo />} />
          </Routes>
        </div>
      </div>

    </BrowserRouter>
  )
}

export default App