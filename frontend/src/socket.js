import { io } from "socket.io-client";

io.on("connection",(socket)=>{

 console.log("User connected")

 socket.on("join",(userId)=>{
  socket.join(userId)
 })

 socket.on("sendNotification",(data)=>{

  io.to(data.userId).emit("notification",data)

 })

})
socket.on("disconnect", () => {
  for (let [userId, socketId] of onlineUsers) {
    if (socketId === socket.id) {
      onlineUsers.delete(userId)
      break
    }
  }

  io.emit("online-users", Array.from(onlineUsers.keys()))
})

export const socket = io("http://localhost:5000", {
  transports: ["websocket"],   // 🔥 important
  autoConnect: true,
});