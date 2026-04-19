import { BrowserRouter,Routes,Route } from "react-router-dom"

import Navbar from "./components/Navbar"
import BottomNav from "./components/BottomNav"

import Feed from "./pages/Feed"
import Chat from "./pages/Chat"
import Reels from "./pages/Reels"
import Stories from "./pages/Stories"
import Live from "./pages/Live"
import Profile from "./pages/Profile"
import Notifications from "./pages/Notifications"

export default function App(){

return(

<BrowserRouter>

<Navbar/>

<Routes>

<Route path="/" element={<Feed/>}/>
<Route path="/chat" element={<Chat/>}/>
<Route path="/reels" element={<Reels/>}/>
<Route path="/stories" element={<Stories/>}/>
<Route path="/live" element={<Live/>}/>
<Route path="/profile" element={<Profile/>}/>
<Route path="/notifications" element={<Notifications/>}/>

</Routes>

<BottomNav/>

</BrowserRouter>

)

}