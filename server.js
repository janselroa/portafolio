const express = require('express')
const nodemailer = require('nodemailer')
const app = express()

app.use(express.urlencoded({
    extended: false
}))
app.use(express.json())
app.use("/static", express.static("static"))

app.get("/", (req, res) => {
    res.sendFile("views/index.html", { root: __dirname })
    console.log(process.env.EMAIL_CLIENT, process.env.EMAIL_PASSWORD)
});

app.post("/send-mail", (req, res) => {
    const { title, message, mail } = req.body
        // create reusable transporter object using the default SMTP transport
    let transporter = nodemailer.createTransport({
        host: "smtp.mailtrap.io",
        port: 587,
        secure: false, // true for 465, false for other ports
        auth: {
            user: process.env.EMAIL, // generated ethereal user
            pass: process.env.EMAIL_PASSWORD, // generated ethereal password
        },
    });
    // send mail with defined transport object
    return transporter.sendMail({
            from: mail, // sender address
            to: process.env.EMAIL_CLIENT, // list of receivers
            subject: title, // Subject line
            text: message, // plain text body
        },
        (err, data) => {
            if (err) res.status(200).send({ success: false, err })
            return res.redirect("/")
        }
    );
})
const port =  process.env.PORT || 3000;
app.listen(port);
