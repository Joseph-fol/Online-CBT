const { Resend } = require('resend');

// Initialize Resend with API key
const resend = new Resend(process.env.RESEND_API_KEY);

const sendWelcomeEmail = (userEmail, userName) => {
    console.log("📧 Sending welcome email to:", userEmail);
    console.log("Resend API Key configured:", process.env.RESEND_API_KEY ? "✅ YES" : "❌ NO");
    
    // Validate API key
    if (!process.env.RESEND_API_KEY) {
        console.error("❌ RESEND_API_KEY not configured in environment variables");
        return Promise.resolve({ 
            success: false, 
            error: "Resend API key not configured" 
        });
    }

    const mailOptions = {
        from: 'noreply@resend.dev',
        to: userEmail,
        subject: "Welcome to Online CBT",
        html: `
            <div style="background-color: #f8fafc; padding: 0 0 10px; border-radius: 30px 30px 0 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; box-shadow: 0 4px 10px rgba(0,0,0,0.1);">
                <div style="padding-top: 30px; height: 80px; border-radius: 30px 30px 0 0; background-color: #0f172b; display: flex; align-items: center; justify-content: center; text-align: center;">
                    <h1 style="color: #f8fafc; text-align: center; font-size: 26px; letter-spacing: 1px;">Welcome to Online CBT</h1>
                </div>

                <div style="padding: 40px 30px 20px; text-align: center; color: #0f172b; background-color: #ffffff;">
                    <p style="font-size: 20px; margin-top: 0;">
                        <span style="font-weight: 700; color: #ab3500;">Congratulations ${userName}!</span> Your sign-up was successful.
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
                        <p style="color: #ab3500; margin-top: 0; font-size: 18px; font-weight: bold;">Online CBT Team</p>
                    </div>
                </div>
            </div>
        `
    };

    return resend.emails.send(mailOptions)
        .then((response) => {
            console.log("✅ Welcome email sent successfully to:", userEmail);
            console.log("Email ID:", response.id);
            return { success: true, message: "Email sent successfully", emailId: response.id };
        })
        .catch((error) => {
            console.error("❌ Failed to send welcome email to:", userEmail);
            console.error("Resend error details:", error);
            console.error("Error message:", error.message);
            return { success: false, error: error.message };
        });
};

const sendAdminInvitationEmail = (invitedEmail, invitationLink, invitedByName) => {
    console.log("📧 Sending admin invitation email to:", invitedEmail);
    console.log("Resend API Key configured:", process.env.RESEND_API_KEY ? "✅ YES" : "❌ NO");
    
    // Validate API key
    if (!process.env.RESEND_API_KEY) {
        console.error("❌ RESEND_API_KEY not configured");
        return Promise.resolve({ 
            success: false, 
            error: "Resend API key not configured" 
        });
    }

    const mailOptions = {
        from: 'noreply@resend.dev',
        to: invitedEmail,
        subject: "You're Invited to Become an Admin on Online CBT",
        html: `
            <div style="background-color: #f8fafc; padding: 0 0 10px; border-radius: 30px 30px 0 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; box-shadow: 0 4px 10px rgba(0,0,0,0.1);">
                <div style="padding-top: 30px; height: 80px; border-radius: 30px 30px 0 0; background-color: #0f172b; display: flex; align-items: center; justify-content: center; text-align: center;">
                    <h1 style="color: #f8fafc; text-align: center; font-size: 26px; letter-spacing: 1px;">Admin Invitation</h1>
                </div>

                <div style="padding: 40px 30px 20px; text-align: center; color: #0f172b; background-color: #ffffff;">
                    <p style="font-size: 18px; margin-top: 0;">
                        <span style="font-weight: 700; color: #ab3500;">You've been invited!</span>
                    </p>

                    <p style="line-height: 1.8; padding: 15px 10px; font-size: 16px;">
                        ${invitedByName} has invited you to become an admin on <strong>Online CBT</strong>. 
                        <br><br>
                        Click the button below to accept the invitation and create your admin account.
                    </p>

                    <div style="margin: 30px 0;">
                        <a href="${invitationLink}" style="display: inline-block; padding: 12px 30px; background-color: #ab3500; color: white; text-decoration: none; border-radius: 5px; font-weight: 600; font-size: 16px;">
                            Accept Invitation
                        </a>
                    </div>

                    <p style="font-size: 14px; color: #64748b;">
                        Or copy and paste this link in your browser:<br>
                        <a href="${invitationLink}" style="color: #ab3500; word-break: break-all;">${invitationLink}</a>
                    </p>

                    <p style="font-size: 13px; color: #94a3b8; padding-top: 15px; border-top: 1px solid #e2e8f0; margin-top: 20px;">
                        This invitation will expire in 7 days.
                    </p>

                    <!-- Footer Area -->
                    <div style="padding: 20px 0 10px;">
                        <p style="margin-bottom: 5px; font-size: 16px; font-weight: 600;">Best Regards,</p>
                        <p style="color: #ab3500; margin-top: 0; font-size: 18px; font-weight: bold;">Online CBT Admin Team</p>
                    </div>
                </div>
            </div>
        `
    };

    return resend.emails.send(mailOptions)
        .then((response) => {
            console.log("✅ Admin invitation email sent successfully to:", invitedEmail);
            console.log("Email ID:", response.id);
            return { success: true, message: "Invitation email sent successfully", emailId: response.id };
        })
        .catch((error) => {
            console.error("❌ Failed to send admin invitation to:", invitedEmail);
            console.error("Resend error details:", error);
            console.error("Error message:", error.message);
            return { success: false, error: error.message };
        });
};

module.exports = { sendWelcomeEmail, sendAdminInvitationEmail };
