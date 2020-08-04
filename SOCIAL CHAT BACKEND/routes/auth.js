const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const User = mongoose.model("User")
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const {JWT_SECRET} = require('../keys')
const requireLogin = require('../middlewares/requireLogin')

router.get('/',(req,res)=>{
    res.send("hello")
})


router.post('/signup',(req,res)=>{
    const {name,email,password} = req.body 
    if(!email || !password || !name){
       return res.status(422).json({error:"please add all the fields"})
    }
    User.findOne({email:email})
    .then((savedUser)=>{
        if(savedUser){
            return res.status(422).json({error:"user already exists with that email"})
        }
        bcrypt.hash(password,12)
        .then(hashedpassword=>{
            const user = new User({
                email,
                password:hashedpassword,
                name
            })
    
            user.save()
            .then(user=>{
                res.json({message:"saved successfully"})
            })
            .catch(err=>{
                console.log(err)
            })
        })        
    })
    .catch(err=>{
        console.log(err)
    })
})

// now making sign-in routes
router.post('/signin',(req,res)=>{
    const {email,password} = req.body
    if(!email || !password){
       return res.status(422).json({error:"please add email or password"})
    }
    User.findOne({email:email})
    .then(savedUser=>{
        if(!savedUser){
            // user not found with that email
           return res.status(422).json({error:"Invalid Email or password"})
        }
        bcrypt.compare(password,savedUser.password)  // password -> got from user ,                 savedUser.password-> password that is saved in database so we are comparing both.
        .then(doMatch=>{
            if(doMatch){
                // doMatch is true means password is correct
                // res.json({message:"successfully signed in"}) (instead of this given token to user)
                const token = jwt.sign({_id:savedUser._id},JWT_SECRET)
                res.json({token:token}) // if key and value are same then                                  u can also use   res.json({token}) instead of res.json({token:token})
            }
            else{
                // doMatch is false means password is incorrect
                return res.status(422).json({error:"Invalid Email or password"})
            }
        })
        .catch(err=>{
            console.log(err)
        })
    })
})
module.exports = router
