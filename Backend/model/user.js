import dotenv from "dotenv";
dotenv.config();

import mongoose from "mongoose";
import passportLocalMongoose from "passport-local-mongoose";

const dburl = process.env.MONGO_URL

async function main() {
    await mongoose.connect(dburl);
}

main()
.then(() => {
    console.log("Connected to MongoDB");
})
.catch((err) => {
    console.error("Error connecting to MongoDB:", err);
});


const userSchema = new mongoose.Schema({
    email:{
        type:String,
        required:true,
    },
    profilePic:{
        type:String,
        default:"",
    },
    bio:{
        type:String,
    }
},{timestamps:true});

userSchema.plugin(passportLocalMongoose.default);

const User = mongoose.model("User",userSchema);

export default User;