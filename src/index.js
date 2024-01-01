import mongoose from "mongoose";
import app from "./app.js"
import dotenv from "dotenv"
import logger from "./configs/logger.config.js";
import { Server } from "socket.io";
import SocketServer from "./SocketServer.js";

//dotEnv config
dotenv.config();

//env variables
const {DATABASE_URL}=process.env;
const PORT =process.env.PORT || 8000;



//exit on mongodb error
mongoose.connection.on('error',(err)=>{
    logger.error(`MongoDB connection error ${err}`)
    process.exit(1);
})

//mongodb debug mode
if(process.env.NODE_ENV!=="production"){
    mongoose.set('debug',true)
}

//mongodb connect
mongoose.connect(DATABASE_URL,{
    useNewUrlParser:true,
    useUnifiedTopology:true,
    serverSelectionTimeoutMS:30000,
}).then(()=>{
    logger.info("Connected to MONGODB")
})


let server;
server= app.listen(PORT,()=>{
    logger.info(`Server has started on port ${PORT}`,)
    console.log("process id",process.pid)
});
// Socket Io
const io=new Server(server,
    {
        pingTimeout:60000,
        cors:{
            origin:process.env.REACT_APP_CLIENT_API_ENDPOINT,
        }
    });

io.on("connection",(socket)=>{
    logger.info("Socket io connected successfully"),
    SocketServer(socket,io)
})    


// handle server errors
const exitHandler=()=>{
    if(server){
      logger.info("Server closed")
      process.exit(1);
    }else{
        process.exit(1);
    }
};

const unexpectedErrorHandler=(error)=>{
    logger.error(error);
    exitHandler();
}

process.on("uncaughtException",unexpectedErrorHandler);
process.on("unhandledRejection",unexpectedErrorHandler)

//Sigterm
process.on("SIGTERM",()=>{
    if(server){
        logger.info("Server closed")
        process.exit(1);
      }
})