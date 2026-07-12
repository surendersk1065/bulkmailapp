const express = require("express")
const cors = require("cors")
const mongoose = require("mongoose")


const app = express()
app.use(express.json())
app.use(cors())
app.listen(3000, function () {
    console.log("server started")
})

mongoose.connect("mongodb://user1:2002@ac-8yztyxf-shard-00-00.en56xwo.mongodb.net:27017,ac-8yztyxf-shard-00-01.en56xwo.mongodb.net:27017,ac-8yztyxf-shard-00-02.en56xwo.mongodb.net:27017/passkey?ssl=true&replicaSet=atlas-139ih2-shard-0&authSource=admin&appName=Cluster0").then(function () {
    console.log("connected")
}).catch(function (err) {
    console.log(err)
})
const details = mongoose.model("details", {}, "bulkmail")


const nodemailer = require("nodemailer")



app.post("/sendmail", function (req, res) {
    var msg = req.body.msg
    var email = req.body.email

    details.find().then(function (data) {
        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: data[0].toJSON().user,
                pass: data[0].toJSON().pass
            }
        })
        new Promise(async function (resolve, reject) {
            try {
                for (i = 0; i < email.length; i++) {
                    await transporter.sendMail(
                        {
                            from: "surendersk1065@gmail.com",
                            to: email[i],
                            subject: "A message from node mailer",
                            text: msg
                        },
                    )
                }
                resolve("success")
            }
            catch (error) {
                resject("failed")
            }
        }).then(function () {
            res.send(true)
        }).catch(function () {
            res.send(false)
        })
    }).catch(function (error) {
        console.log(error)
    })




})