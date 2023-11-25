let onlineUsers=[];
export default function(socket,io){
//    user joins or open an conversation
     socket.on("join",(user)=>{
        console.log("user has joined :",user);
        socket.join(user);
        //add joined user to onlinr
        if(!onlineUsers.some((u)=>u.userId===user)){
            console.log(`user; ${user} is online`)
            onlineUsers.push({userId:user,socketId:socket.id})
        }
   
        //send online users to frontend
        io.emit("get-online-users",onlineUsers);
     });

     //socket disconnect
     socket.on("disconnect",()=>{
        onlineUsers=onlineUsers.filter((user)=>user.socketId!==socket.id);
        console.log("user has disconnected")
        socket.emit("get-online-users",onlineUsers) 
    })
    //  Join a conversation room
    socket.on("join conversation", (conversation)=>{
        socket.join(conversation);
        console.log("User has joined conversation:",conversation)
    });

    //send and receive message
    socket.on("send message",(message)=>{
        console.log("message received=>>>",message)
        let conversation=message.conversation;
        if(!conversation.users) return ;
        conversation.users.forEach((user) => {
            if(user._id===message.sender._id) return;
            socket.in(user._id).emit("ReceiveMsg",message);
          
        });

    })
    //typing
    socket.on('typing',(conversation)=>{
        console.log("TYPING...")
        socket.in(conversation).emit("typing",conversation);

    })
    socket.on('stop typing',(conversation)=>{
        console.log("stop TYPING...")
        socket.in(conversation).emit("stop typing");

    })
}