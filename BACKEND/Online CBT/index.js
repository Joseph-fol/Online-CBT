const express = require("express")
const app = express()
const mongoose = require("mongoose")
const dotenv = require("dotenv")
const cors = require("cors")

const portNumber = 5423


app.listen(portNumber, (req, res) =>{
    
    console.log(`I am working on server  ${portNumber}`);
})