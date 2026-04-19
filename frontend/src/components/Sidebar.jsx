import { Link } from "react-router-dom"

export default function Sidebar() {

  const linkStyle = {
    color: "#fff",
    textDecoration: "none",
    padding: "10px",
    borderRadius: "8px",
    display: "block"
  }

  return (
    <div style={{
      width: 220,
      height: "100vh",
      background: "#0f0f0f",
      color: "#fff",
      padding: "20px 10px",
      position: "fixed",
      top: 0,
      left: 0,
      borderRight: "1px solid #222"
    }}>

      <h2 style={{marginBottom:20}}>🔥 Menu</h2>

      {/* LINKS */}
      <Link
        to="/"
        style={linkStyle}
        onMouseEnter={(e)=> e.currentTarget.style.background="#222"}
        onMouseLeave={(e)=> e.currentTarget.style.background="transparent"}
      >
        🏠 Home
      </Link>

      <Link
        to="/reels"
        style={linkStyle}
        onMouseEnter={(e)=> e.currentTarget.style.background="#222"}
        onMouseLeave={(e)=> e.currentTarget.style.background="transparent"}
      >
        🎬 Reels
      </Link>

      <Link
        to="/feed"
        style={linkStyle}
        onMouseEnter={(e)=> e.currentTarget.style.background="#222"}
        onMouseLeave={(e)=> e.currentTarget.style.background="transparent"}
      >
        📱 Feed
      </Link>

      <Link
        to="/profile"
        style={linkStyle}
        onMouseEnter={(e)=> e.currentTarget.style.background="#222"}
        onMouseLeave={(e)=> e.currentTarget.style.background="transparent"}
      >
        👤 Profile
      </Link>

      <Link
        to="/chat"
        style={linkStyle}
        onMouseEnter={(e)=> e.currentTarget.style.background="#222"}
        onMouseLeave={(e)=> e.currentTarget.style.background="transparent"}
      >
        💬 Chat
      </Link>

      <Link
        to="/stories"
        style={linkStyle}
        onMouseEnter={(e)=> e.currentTarget.style.background="#222"}
        onMouseLeave={(e)=> e.currentTarget.style.background="transparent"}
      >
        📚 Stories
      </Link>

      <Link
        to="/live"
        style={linkStyle}
        onMouseEnter={(e)=> e.currentTarget.style.background="#222"}
        onMouseLeave={(e)=> e.currentTarget.style.background="transparent"}
      >
        🔴 Live
      </Link>

    </div>
  )
}