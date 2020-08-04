const mongoose = require('mongoose')
const {ObjectId} = mongoose.Schema.Types
const postSchema = new mongoose.Schema({
    title:{
        type:String,
        required:true
    },
    body:{
        type:String,
        required:true
    },
    photo:{
        type:String,
        default : "no photo"
    },
    postedBy:{
        // here we are making connection b/w user model and post model
       type:ObjectId,
       ref:"User"       // User should be same as User model
    }
})
mongoose.model("Post",postSchema)