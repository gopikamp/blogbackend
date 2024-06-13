const express = require("express")
const mongoose = require("mongoose")
const cors = require("cors")
const bcrypt = require("bcryptjs")
const { blogmodel } = require("./models/blog")

const app = express()
app.use(cors())
app.use(express.json())
mongoose.connect("mongodb+srv://gopikamp:Gopika2002@cluster0.75vbtwq.mongodb.net/blogDB?retryWrites=true&w=majority&appName=Cluster0")

const generateHashedPassword = async (password) => {
    const salt = await bcrypt.genSalt(10)//salt value
    return bcrypt.hash(password, salt)
}

app.post("/signup", async (req, res) => {
    let input = req.body
    let hashedPassword = await generateHashedPassword(input.password)
    console.log(hashedPassword)
    input.password = hashedPassword
    let blog = new blogmodel(input)
    blog.save()
    res.json({ "status": "success" })
})

app.post("/signin", (req, res) => {
    let input = req.body
    blogmodel.find({ "emailid": req.body.emailid }).then(
        (Response) => {
            if (Response.length > 0) {
                let dbPassword = Response[0].password
                console.log(dbPassword)
                bcrypt.compare(input.password, dbPassword, (error, isMatch) => {
                    if (isMatch) {
                        res.json({ "status": "success", "userId": Response[0]._id })
                    } else {
                        res.json({ "status": "incorrect password" })
                    }
                })
            } else {
                res.json({ "status": "User not found" })
            }
        }
    ).catch()
})

app.listen(8000, () => {
    console.log("Server Started")
})