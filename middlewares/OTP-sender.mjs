import nodemailer from 'nodemailer';








const sendMailOTP = async (req, res) => {
    const testAccount = await nodemailer.createTestAccount();

    const transporter = nodemailer.createTransport({
        host: 'smtp.ethereal.email',
        port: 587,
        auth: {
            user: 'oran.dickens21@ethereal.email',
            pass: 'RwP8XzHQHjrAy6Gt9Q'
        }
    });


    let info = await transporter.sendMail({
        from: '" social posting app " <social@posting.com>', // sender address
        to: req.body.email, // list of receivers
        subject: " Password reset OTP ", // Subject line
        text: "here is your OTP of forget password", // plain text body
        html: "<b>Forget Password</b>", // html body
    });
}