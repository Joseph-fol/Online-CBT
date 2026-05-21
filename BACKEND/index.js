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

// Setup routes
app.use("/user", studentRoutes)
app.use("/subjects", subjectRoutes)

// Connect to MongoDB with improved error handling
mongoose.connect(URI, {
    serverSelectionTimeoutMS: 10000,
    socketTimeoutMS: 45000,
    retryWrites: true,
    connectTimeoutMS: 10000,
})

.then(() => {
    console.log("Connected to MongoDB successfully");
    // Start server AFTER MongoDB is connected
    app.listen(port, (req, res) => {
        console.log(`Server running on port ${port}`);
    })
})

.catch((err) => {
    console.error("MongoDB Connection Failed:");
    console.error("Error message:", err.message);
    console.error("Error code:", err.code);
    console.error("MongoDB URI:", URI ? "Configured" : "NOT CONFIGURED - Add MONGO_URI to .env file");
    
    // Exit process if can't connect to DB
    console.error("\n Server will not start without database connection");
    process.exit(1);
})