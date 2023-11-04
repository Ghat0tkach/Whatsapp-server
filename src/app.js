import  express  from "express";
import morgan from "morgan";
import helmet from "helmet";
import mongoSanitize from "express-mongo-sanitize";
import cookieParser from "cookie-parser";
import compression from "compression";
import fileUpload from "express-fileupload";
import cors from "cors"
import createHttpError from "http-errors";
import routes from './routes/index.js'
//create express app
const app=express();


//morgan
if(process.env.NODE_ENV !== "production"){
    app.use(morgan("dev"))
}

//Helmet
app.use(helmet())

//parse json request  body
app.use(express.json())
app.use(express.urlencoded({extended:true}))

//sanitize request data
app.use(mongoSanitize())

//Enable cookie parser
app.use(cookieParser());


//gzip compression
app.use(compression())


//file upload
app.use(fileUpload({
    useTempFiles:true,
}))

//cors
app.use(cors())
app.post ('/',(req,res)=>{
    throw createHttpError.BadRequest("this route has an error")
    res.send("hello from server")
})
//api v1 routes
app.use("/api/v1",routes)  //http://localhost:8000/api/v1/auth/register


app.use(async(req,res,next)=>{
    next(createHttpError.NotFound("This route does not exist"))
})
//error handling
app.use(async(err,req,res,next)=>{
    res.status(err.status || 500)
    res.send(
        {
            error:{
                status:err.status || 500,
                message:err.message,
            }
        }
    )
})
export default app;