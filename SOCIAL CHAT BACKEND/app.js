const express = require('express')
const app = express()
const mongoose  = require('mongoose')
const PORT = 4000
const {MONGOURI} = require('./keys')


mongoose.connect(MONGOURI,{
    useNewUrlParser:true,
    useUnifiedTopology: true
})
mongoose.connection.on('connected',()=>{
    console.log("conneted to mongo yeahh")
})
mongoose.connection.on('error',(err)=>{
    console.log("err connecting",err)
})

require('./models/user')
require('./models/post')

// write express.json() before ./routes/auth
app.use(express.json())
app.use(require('./routes/auth'))
app.use(require('./routes/post'))


app.listen(PORT,function(){
    console.log("server is running on http://localhost:4000")
})
