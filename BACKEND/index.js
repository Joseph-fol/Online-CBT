const dotenv = require("dotenv")
dotenv.config()

const express = require("express")
const app = express()
const mongoose = require("mongoose")
const ejs = require("ejs")
const bcrypt = require("bcrypt")
const studentRoutes = require("./routes/student.route")
const subjectRoutes = require("./routes/subject.routes")
const cors = require("cors")

app.set("view engine", "ejs")
app.use(express.json())
app.use(express.urlencoded({
    extended: true
}))

const port = process.env.PORT 
const URI = process.env.MONGO_URI

const dns = require("node:dns");
dns.setDefaultResultOrder('ipv4first')
dns.setServers(['8.8.8.8', '8.8.4.4'])

app.use(cors())
mongoose.connect(URI, {
    serverSelectionTimeoutMS: 5000,
    socketTimeoutMS: 45000,
    retryWrites: true,
})

.then(()=>{
    console.log("Connected to MongoDB");
})
.catch((err)=>{
    console.log("Error connecting to DB:", err);
})

app.use("/user", studentRoutes)
app.use("/subjects", subjectRoutes)

// http://localhost:2114/admin/questions/addQuestions

app.listen(port, (req, res) =>{
    console.log(`I am working on server ${port}`);
})