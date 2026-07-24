import dotenv from "dotenv";
dotenv.config();

import express from "express";
import session from "express-session";
import ExpressError from "./utils/ExpressError.js";
import cors from "cors";
import http from "http";
import passport from "passport";
import LocalStrategy from "passport-local";
import User from "./model/user.js";
import Message from "./model/message.js"
import { Server } from "socket.io";
import cloudinary from "./utils/cloudinary.js"
import multer from "multer";
import { Readable } from "stream";
import MongoStore from "connect-mongo";


const app = express();
const server = http.createServer(app);

const io = new Server(server,{
    cors:{
        origin: process.env.CLIENT_URL,
        credentials:true
    }
});

const userSocketMap = {};

io.on('connection', (socket) => {
  const userId = socket.handshake.query.userId;
  console.log("User Connected",userId);

  if (userId && userId !== "undefined") {
    userSocketMap[userId] = socket.id;
  }

  io.emit('getOnlineUsers', Object.keys(userSocketMap));

  socket.on("disconnect",()=>{
    console.log("User Disconnected",userId);
    delete userSocketMap[userId];
    io.emit('getOnlineUsers',Object.keys(userSocketMap))
  })
});

app.set('trust proxy', 1);

app.use(cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
}));
app.use(express.urlencoded({extended:true}));
app.use(express.json());

const store = MongoStore.create({
    mongoUrl:process.env.MONGO_URL,
    crypto: {
        secret:process.env.SESSION_SECRET,
    },
    touchAfter:24 * 3600,
})

app.use(session({
    store,
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie : {
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",   // cookie only over HTTPS
        sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    }
}));

const upload = multer({
  storage: multer.memoryStorage(),
});


app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.get('/',(req,res)=>{
    res.send("working");
})

app.post('/api/signup',async (req,res,next)=>{
    try {
        let {username,email,password} = req.body;
        let newUser = new User({
            email:email,
            username:username,
        })

        let user = await User.register(newUser,password);


       req.login(user,(err)=> {
            if(err) {
                return next(err);
            }
        
            res.json({ 
                success:true,
                message:"User Recieved",
            })
        })
    }
    catch(err) {
        return next(err);
    }
})


app.post("/api/login", (req, res, next) => {
  passport.authenticate("local", (err, user) => {

    if (err) return next(err);
    if (!user) {
      return res.status(201).json({
        success: false,
        message: "Invalid username or password",
      });
    }

    req.login(user, (err) => {
      if (err) return next(err);

      return res.json({
        success: true,
        message: "Access Granted",
      });
    });

  })(req, res, next);

});


app.get('/api/logout',(req,res,next)=> {
  if(!req.user) {
    return next(new ExpressError(401,"Invalid request"))
  }

  req.logout((err)=> {
    if(err) {
      return next(err);
    }

    res.json({
      success:true,
      message:"Sucessfully logout"
    })
  })
})


app.get('/api/auth',(req,res)=>{
  if(req.isAuthenticated()) {
    res.json({
      loggedIn:true,
      message:"authenticated",
      user:req.user,
    })
  }
  else {
    res.json({
      loggedIn:false,
      message:"unauthenticated"
    })
  }
})

app.get('/api/users',async (req,res,next)=>{
  try {
    
    if(!req.user) {
      return next(new ExpressError(401,"Login required"));
    }
    
    let userId = req.user._id;
    const filteredUsers = await User.find({_id: {$ne:userId}}).select("-hash -salt");

    const unseenMessages = {};
    const promises = filteredUsers.map(async (user)=>{
      const messages = await Message.find({senderId: user._id,receiverId:userId,seen:false});

      if(messages.length>0) {
        unseenMessages[user._id]=messages.length;
      }
    })

    await Promise.all(promises);
    res.json({
      success:true,
      users:filteredUsers,
      unseenMessages,
    })
  } 
  catch(e) {
    next(e);
  }
})


// Get message for all selected users

app.get('/api/getmessages/:id',async (req,res,next)=>{
  try {
    let {id} = req.params;
    let userId=id;
    let myId = req.user._id;

    const messages = await Message.find({
      $or: [
        {senderId:myId,receiverId:userId},
        {senderId:userId,receiverId:myId},
      ]
    })

    await Message.updateMany({senderId:userId,receiverId:myId},{seen:true});

    res.json({
      success:true,
      messages
    });
  }
  catch(e) {
    next(e);
  }
})

// mark messages as seen

app.put('/api/mark/:id',async (req,res,next) => {
  try {
    let {id} = req.params;
    await Message.findByIdAndUpdate(id,{seen:true})
    res.json({
      success:true,
    })
  }
  catch(e) {
    next(e);
  }
})



// Send message to user 

app.post('/api/sendmessage/:id',async (req,res,next)=>{
  try {
    let receiverId = req.params.id;
    let senderId = req.user._id;
    let {text,image} = req.body;

    // claoudinary part soon

    const newMessage = await Message.create({
      senderId,
      receiverId,
      text,
    })

    const receiverSocketId = userSocketMap[receiverId];
    if(receiverSocketId) {
      io.to(receiverSocketId).emit("newMessage",newMessage);
    }

    res.json({
      success:true,
      newMessage,
    })
  }
  catch(e) {
    next(e);
  }
})


app.put("/api/profile",upload.single("image"),async (req, res) => {
    try {
      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: "Unauthorized",
        });
      }

      const { bio } = req.body;

      const updatedData = {};

      if (bio) updatedData.bio = bio;

      // Upload image to Cloudinary
      if (req.file) {
          const result = await new Promise((resolve, reject) => {
            const upload = cloudinary.uploader.upload_stream(
              {
                folder: "chatrix/profile-pictures",
                resource_type: "image",
              },
              (error, result) => {
                if (error) return reject(error);
                resolve(result);
              }
          );

          Readable.from(req.file.buffer).pipe(upload);
        });
        updatedData.profilePic = result.secure_url;
      }

      const user = await User.findByIdAndUpdate(
        req.user._id,
        updatedData,
        {
          new: true,
        }
      );

      console.log("After image upload");

      res.json({
        success: true,
        user,
      });

    } catch (err) {
     console.error(err);

     return res.status(500).json({
      success: false,
      message: err.message,
    });
    }
  }
);




app.use((err,req,res,next)=>{
  let {status=500,message="something went wrong"} = err;
  res.status(status).json({
    success:false,
    message:message,
  })
})

const port=process.env.PORT || 8000;
server.listen(port,()=>{   
    console.log(`App is listning on port ${port}`);
})