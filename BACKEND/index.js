const express = require("express")
const app = express()
const dotenv = require("dotenv")
const mongoose = require("mongoose")
const ejs = require("ejs")
const bcrypt = require("bcrypt")
const studentRoutes = require("./routes/student.route")
const cors = require("cors")

dotenv.config()

app.set("view engine", "ejs")
app.use(express.json())
app.use(express.urlencoded({
    extended: true
}))

const port = process.env.PORT 
const URI = process.env.MONGO_URI
// const students = []

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
app.use("/user", studentRoutes)

app.listen(port, (req, res) =>{
    console.log(`I am working on server ${port}`);
})