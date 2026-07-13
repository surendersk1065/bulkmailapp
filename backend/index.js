const express = require("express")
const cors = require("cors")
const mongoose = require("mongoose")
const dns = require("dns")
dns.setServers(["1.1.1.1", "8.8.8.8"])
const uri = "mongodb+srv://sk:2002@cluster0.en56xwo.mongodb.net/passkey?appName=Cluster0"


const app = express()
app.use(express.json())
app.use(cors({
    origin: [
        "http://localhost:5173",
        "https://bulkmailapp-nine.vercel.app",
        "https://bulkmailapp-mu.vercel.app"
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
    console.log("Request received");

    var msg = req.body.msg;
    var email = req.body.email;

    console.log("Emails:", email.length);

    bulkmail.find().then(function (data) {

        console.log("MongoDB data fetched");

        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: data[0].toJSON().user,
                pass: data[0].toJSON().pass
            }
        });

        new Promise(async function (resolve, reject) {
            try {
                for (let i = 0; i < email.length; i++) {
                    console.log("Sending to:", email[i]);

                    try {
                        const info = await transporter.sendMail({
                            from: data[0].toJSON().user,
                            to: email[i],
                            subject: "A message from node mailer",
                            text: msg
                        });

                        console.log("Mail sent:", info.response);
                    } catch (err) {
                        console.log("SENDMAIL ERROR:", err);
                        throw err;
                    }
                }

                resolve("success");
            }
            catch (error) {
                console.log("Mail Error:", error);
                reject(error);
            }
        })
            .then(function () {
                console.log("Completed");
                res.send(true);
            })
            .catch(function (err) {
                console.log(err);
                res.status(500).send(false);
            });

    }).catch(function (err) {
        console.log("Mongo Error:", err);
        res.status(500).send(false);
    });
});