const nodemailer = require("nodemailer");

const sendWelcomeEmail = (userEmail, userName) => {
    console.log("Starting email send process for:", userEmail);
    console.log("Email credentials - User:", process.env.EMAIL_USER);
    
    // Remove spaces from app password (Gmail passwords come with spaces)
    const emailPassword = process.env.EMAIL_PASSWORD?.replace(/\s/g, '') || '';
    console.log("Email password loaded:", emailPassword ? "YES" : "NO");
    
    const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: process.env.EMAIL_USER,
            pass: emailPassword
        }
    });

    const mailOptions = {
        from: `"${process.env.EMAIL_FROM_NAME}" <${process.env.EMAIL_USER}>`,
        to: userEmail,
        subject: "Welcome to Online CBT",
        html: `
            <div style="background-color: #f8fafc; padding: 0 0 10px; border-radius: 30px 30px 0 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; box-shadow: 0 4px 10px rgba(0,0,0,0.1);">
                <div style="padding-top: 30px; height: 80px; border-radius: 30px 30px 0 0; background-color: #0f172b; display: flex; align-items: center; justify-content: center; text-align: center;">
                    <h1 style="color: #f8fafc; text-align: center; font-size: 26px; letter-spacing: 1px;">Welcome to Online CBT</h1>
                </div>

                <div style="padding: 40px 30px 20px; text-align: center; color: #0f172b; background-color: #ffffff;">
                    <p style="font-size: 20px; margin-top: 0;">
                        <span style="font-weight: 700; color: #ab3500;">Congratulations!</span> Your sign-up was successful.
                    </p>

                    <p style="line-height: 1.8; padding: 15px 10px; font-size: 16px;">
                        Welcome to <strong style="color: #0f172b;">Online CBT</strong>, a secure, seamless, and smart online cbt platform. By joining us, you have taken the first step toward unlocking a seamless and distraction-free online examination experience. 
                        <br><br>
                        We would love to hear from you! If you have any questions or require assistance navigating your new account, please do not hesitate to reach out to our support team.
                    </p>

                    <!-- Footer Area -->
                    <div style="padding: 20px 0 10px;">
                        <hr style="width: 50%; border: none; border-top: 1px solid #e2e8f0; margin-bottom: 20px;">
                        <p style="margin-bottom: 5px; font-size: 16px; font-weight: 600;">Best Regards,</p>
                        <p style="color: #ab3500; margin-top: 0; font-size: 18px; font-weight: bold;">Dev Joseph</p>
                    </div>
                </div>
            </div>
        `
    };

    console.log("Mail options prepared for:", mailOptions.to);
    
    return transporter.sendMail(mailOptions)
        .then((info) => {
            console.log("✅ Welcome email sent successfully to:", userEmail);
            console.log("Email response:", info.response);
            return { success: true, message: "Email sent successfully" };
        })
        .catch((error) => {
            console.error("❌ Failed to send welcome email to:", userEmail);
            console.error("Email error details:", error);
            console.error("Error code:", error.code);
            console.error("Error response:", error.response);
            console.error("Using email:", process.env.EMAIL_USER);
            return { success: false, error: error.message };
        });
};

module.exports = { sendWelcomeEmail };
