const express = require("express")
const cors = require("cors")
const mongoose = require("mongoose")
const dns = require("dns")
dns.setServers(["1.1.1.1","8.8.8.8"])
const uri = "mongodb+srv://sk:2002@cluster0.en56xwo.mongodb.net/passkey?appName=Cluster0"


const app = express()
app.use(express.json())
app.use(cors({
  origin: [
    "http://localhost:3000",
    "https://bulkmailapp-nine.vercel.app"
  ],
  methods: ["GET", "POST"],
  credentials: true
}));

app.use(express.json())
app.listen(3000, function () {
    console.log("server started")
})

mongoose.connect(uri).then(function () {
    console.log("connected")
}).catch(function (err) {
    console.log(err)
})
const bulkmail = mongoose.model("bulkmail", {}, "bulkmail")


const nodemailer = require("nodemailer")

app.post("/sendmail", function (req, res) {
    var msg = req.body.msg
    var email = req.body.email

    bulkmail.find().then(function (data) {
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
                reject("failed")
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