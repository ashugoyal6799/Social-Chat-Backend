const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const requireLogin = require('../middlewares/requireLogin')
const Post = mongoose.model("Post")

//! FOR MAKING A ROUTE PROTECTED USE requireLogin MIDDLEWARE


router.post('/createpost',requireLogin,(req,res)=>{
    const {title,body} = req.body 
    if(!title || !body ){
      return  res.status(422).json({error:"Plase add all the fields"})
    }
    req.user.password = undefined
    const post = new Post({
        title : title,
        body : body,
        postedBy : req.user
    })
    post.save().then(result =>{
        res.json({post:result})
    })
    .catch(err=>{
        console.log(err)
    })
})

router.get('/allpost',(req,res)=>{
    Post.find()
    .populate("postedBy", "name _id")
    .then(posts=>{
        res.json({posts:posts})
    })
    .catch(err=>{
        console.lof(err)
    })
})

router.get('/mypost',requireLogin,(req,res)=>{
    Post.find({postedBy:req.user._id})
    .populate("PostedBy","_id name")
    .then(mypost=>{
        res.json({mypost : mypost})
    })
    .catch(err=>{
        console.log(err)
    })
})

module.exports =router