const express = require("express")
const app = express()
const mongoose = require("mongoose")
const dotenv = require("dotenv")
const cors = require("cors")
dotenv.config()

// const port = 2114

const port = process.env.PORT 
const URI = process.env.MONGO_URI

const dns = require("node:dns");
dns.setDefaultResultOrder('ipv4first')
dns.setServers(['8.8.8.8', '8.8.4.4'])

app.use(cors())
mongoose.connect(URI)
.then(()=>{
    console.log("Connected to MongoDB");
})

.catch((err)=>{
    console.log("Error connecting to DB", err);
})

app.listen(port, (req, res) =>{
    console.log(`I am working on server ${port}`);
})