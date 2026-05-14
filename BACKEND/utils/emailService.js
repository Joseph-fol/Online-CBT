const { Resend } = require('resend');

// Initialize Resend with API key
const resend = new Resend(process.env.RESEND_API_KEY);

const sendWelcomeEmail = (userEmail, userName) => {
    console.log("📧 Sending welcome email to:", userEmail);
    console.log("Resend API Key configured:", process.env.RESEND_API_KEY ? "YES" : " NO");
    
    // Validate API key
    if (!process.env.RESEND_API_KEY) {
        console.error("RESEND_API_KEY not configured in environment variables");
        return Promise.resolve({ 
            success: false, 
            error: "Resend API key not configured" 
        });
    }

    const mailOptions = {
        from: 'noreply@resend.dev',
        to: userEmail,
        subject: "Welcome to Online CBT - Your Account is Ready",
        html: `
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Welcome to Online CBT</title>
            </head>
            <body style="margin: 0; padding: 0; background-color: #f5f7fa; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Helvetica Neue', Arial, sans-serif;">
                
                <!-- Main Container -->
                <div style="max-width: 600px; margin: 20px auto; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);">
                    
                    <!-- Header with Logo -->
                    <div style="background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%); padding: 40px 30px; text-align: center; border-bottom: 4px solid #ab3500;">
                        <!-- Logo Placeholder -->
                        <div style="width: 60px; height: 60px; background-color: rgba(171, 53, 0, 0.1); border-radius: 50%; margin: 0 auto 15px; display: flex; align-items: center; justify-content: center;">
                            <span style="font-size: 32px; color: #ab3500;">📚</span>
                        </div>
                        <h1 style="color: #ffffff; margin: 0; font-size: 28px; font-weight: 700; letter-spacing: 0.5px;">Online CBT</h1>
                        <p style="color: #cbd5e1; margin: 5px 0 0 0; font-size: 14px;">Computer-Based Testing Platform</p>
                    </div>

                    <!-- Greeting Section -->
                    <div style="padding: 40px 30px; background-color: #ffffff; border-bottom: 1px solid #e2e8f0;">
                        <h2 style="color: #0f172a; margin: 0 0 10px 0; font-size: 24px; font-weight: 600;">Welcome, ${userName}! 🎉</h2>
                        <p style="color: #64748b; margin: 10px 0 0 0; font-size: 16px; line-height: 1.6;">Your account has been successfully created and is ready to use.</p>
                    </div>

                    <!-- Main Content -->
                    <div style="padding: 40px 30px; background-color: #f8fafc;">
                        
                        <!-- What's Next Section -->
                        <div style="background-color: #ffffff; padding: 25px; border-radius: 8px; border-left: 4px solid #ab3500; margin-bottom: 30px;">
                            <h3 style="color: #0f172a; margin: 0 0 15px 0; font-size: 18px; font-weight: 600;">What's Next?</h3>
                            <ul style="margin: 0; padding-left: 20px; list-style: none;">
                                <li style="color: #475569; margin-bottom: 12px; font-size: 15px; line-height: 1.6;">
                                    <span style="color: #ab3500; font-weight: 600;">✓</span> Log in to your dashboard to explore available exams
                                </li>
                                <li style="color: #475569; margin-bottom: 12px; font-size: 15px; line-height: 1.6;">
                                    <span style="color: #ab3500; font-weight: 600;">✓</span> Complete your profile for a personalized experience
                                </li>
                                <li style="color: #475569; margin-bottom: 12px; font-size: 15px; line-height: 1.6;">
                                    <span style="color: #ab3500; font-weight: 600;">✓</span> Review exam guidelines and best practices
                                </li>
                                <li style="color: #475569; margin-bottom: 0; font-size: 15px; line-height: 1.6;">
                                    <span style="color: #ab3500; font-weight: 600;">✓</span> Start your first assessment when ready
                                </li>
                            </ul>
                        </div>

                        <!-- Features Section -->
                        <div style="background-color: #ffffff; padding: 25px; border-radius: 8px; margin-bottom: 30px;">
                            <h3 style="color: #0f172a; margin: 0 0 20px 0; font-size: 18px; font-weight: 600;">Platform Features</h3>
                            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px;">
                                <div style="text-align: center;">
                                    <div style="font-size: 24px; margin-bottom: 10px;">⚡</div>
                                    <p style="color: #475569; margin: 0; font-size: 14px;"><strong>Fast & Reliable</strong></p>
                                </div>
                                <div style="text-align: center;">
                                    <div style="font-size: 24px; margin-bottom: 10px;">🔒</div>
                                    <p style="color: #475569; margin: 0; font-size: 14px;"><strong>Secure</strong></p>
                                </div>
                                <div style="text-align: center;">
                                    <div style="font-size: 24px; margin-bottom: 10px;">📊</div>
                                    <p style="color: #475569; margin: 0; font-size: 14px;"><strong>Detailed Analytics</strong></p>
                                </div>
                                <div style="text-align: center;">
                                    <div style="font-size: 24px; margin-bottom: 10px;">🎯</div>
                                    <p style="color: #475569; margin: 0; font-size: 14px;"><strong>Smart Feedback</strong></p>
                                </div>
                            </div>
                        </div>

                        <!-- CTA Button -->
                        <div style="text-align: center; margin-bottom: 30px;">
                            <a href="https://cbt-exam.vercel.app/studentSignin" style="display: inline-block; background: linear-gradient(135deg, #ab3500 0%, #8a2a00 100%); color: #ffffff; text-decoration: none; padding: 14px 40px; border-radius: 6px; font-weight: 600; font-size: 16px; transition: all 0.3s ease; border: none; cursor: pointer; box-shadow: 0 4px 12px rgba(171, 53, 0, 0.3);">
                                Go to Dashboard
                            </a>
                        </div>

                        <!-- Support Section -->
                        <div style="background-color: #fef3c7; padding: 20px; border-radius: 8px; border-left: 4px solid #f59e0b; margin-bottom: 20px;">
                            <p style="color: #92400e; margin: 0; font-size: 14px; line-height: 1.6;">
                                <strong>Need Help?</strong> Our support team is here to assist you. Contact us at <a href="mailto:support@onlinecbt.com" style="color: #ab3500; text-decoration: none; font-weight: 600;">support@onlinecbt.com</a>
                            </p>
                        </div>

                    </div>

                    <!-- Footer -->
                    <div style="background-color: #0f172a; padding: 30px; text-align: center; border-top: 1px solid #1e293b;">
                        
                        <!-- Social Links -->
                        <div style="margin-bottom: 20px;">
                            <p style="color: #cbd5e1; margin: 0 0 15px 0; font-size: 13px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px;">Follow Us</p>
                            <div style="display: flex; justify-content: center; gap: 15px;">
                                <a href="#" style="display: inline-block; width: 36px; height: 36px; background-color: #1e293b; border-radius: 50%; text-align: center; line-height: 36px; text-decoration: none; color: #ab3500; font-weight: bold; transition: all 0.3s ease;">f</a>
                                <a href="#" style="display: inline-block; width: 36px; height: 36px; background-color: #1e293b; border-radius: 50%; text-align: center; line-height: 36px; text-decoration: none; color: #ab3500; font-weight: bold; transition: all 0.3s ease;">𝕏</a>
                                <a href="#" style="display: inline-block; width: 36px; height: 36px; background-color: #1e293b; border-radius: 50%; text-align: center; line-height: 36px; text-decoration: none; color: #ab3500; font-weight: bold; transition: all 0.3s ease;">in</a>
                            </div>
                        </div>

                        <!-- Contact Info -->
                        <div style="border-top: 1px solid #1e293b; padding-top: 20px;">
                            <p style="color: #cbd5e1; margin: 0 0 8px 0; font-size: 13px;">
                                <strong style="color: #ffffff;">Online CBT</strong> | Computer-Based Testing Platform
                            </p>
                            <p style="color: #64748b; margin: 0 0 15px 0; font-size: 12px;">
                                Email: <a href="mailto:info@onlinecbt.com" style="color: #ab3500; text-decoration: none;">info@onlinecbt.com</a>
                            </p>
                        </div>

                        <!-- Legal Links -->
                        <div style="border-top: 1px solid #1e293b; padding-top: 15px; margin-top: 15px;">
                            <p style="margin: 0; font-size: 12px;">
                                <a href="#" style="color: #64748b; text-decoration: none; margin-right: 15px;">Privacy Policy</a>
                                <a href="#" style="color: #64748b; text-decoration: none; margin-right: 15px;">Terms of Service</a>
                                <a href="#" style="color: #64748b; text-decoration: none;">Unsubscribe</a>
                            </p>
                        </div>

                        <!-- Copyright -->
                        <p style="color: #475569; margin: 15px 0 0 0; font-size: 11px;">
                            © 2024 Online CBT. All rights reserved.
                        </p>
                    </div>

                </div>

            </body>
            </html>
        `
    };

    return resend.emails.send(mailOptions)
        .then((response) => {
            console.log("Welcome email sent successfully to:", userEmail);
            console.log("Email ID:", response.id);
            return { success: true, message: "Email sent successfully", emailId: response.id };
        })
        .catch((error) => {
            console.error("Failed to send welcome email to:", userEmail);
            console.error("Resend error details:", error);
            console.error("Error message:", error.message);
            return { success: false, error: error.message };
        });
};

const sendAdminInvitationEmail = (invitedEmail, invitationLink, invitedByName) => {
    console.log("📧 Sending admin invitation email to:", invitedEmail);
    console.log("Resend API Key configured:", process.env.RESEND_API_KEY ? "YES" : "NO");
    
    // Validate API key
    if (!process.env.RESEND_API_KEY) {
        console.error("RESEND_API_KEY not configured");
        return Promise.resolve({ 
            success: false, 
            error: "Resend API key not configured" 
        });
    }

    const mailOptions = {
        from: 'noreply@resend.dev',
        to: invitedEmail,
        subject: "Admin Invitation - Online CBT Platform",
        html: `
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Admin Invitation - Online CBT</title>
            </head>
            <body style="margin: 0; padding: 0; background-color: #f5f7fa; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Helvetica Neue', Arial, sans-serif;">
                
                <!-- Main Container -->
                <div style="max-width: 600px; margin: 20px auto; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);">
                    
                    <!-- Header with Logo -->
                    <div style="background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%); padding: 40px 30px; text-align: center; border-bottom: 4px solid #ab3500;">
                        <!-- Logo Placeholder -->
                        <div style="width: 60px; height: 60px; background-color: rgba(171, 53, 0, 0.1); border-radius: 50%; margin: 0 auto 15px; display: flex; align-items: center; justify-content: center;">
                            <span style="font-size: 32px;">👨‍💼</span>
                        </div>
                        <h1 style="color: #ffffff; margin: 0; font-size: 28px; font-weight: 700; letter-spacing: 0.5px;">Online CBT</h1>
                        <p style="color: #cbd5e1; margin: 5px 0 0 0; font-size: 14px;">Admin Invitation</p>
                    </div>

                    <!-- Invitation Banner -->
                    <div style="background: linear-gradient(135deg, #ab3500 0%, #8a2a00 100%); padding: 30px; text-align: center; color: #ffffff;">
                        <h2 style="margin: 0; font-size: 24px; font-weight: 700;">You've Been Selected! 🎖️</h2>
                        <p style="margin: 8px 0 0 0; font-size: 16px; opacity: 0.95;">Become an Administrator on Online CBT</p>
                    </div>

                    <!-- Main Content -->
                    <div style="padding: 40px 30px; background-color: #f8fafc;">
                        
                        <!-- Welcome Message -->
                        <div style="background-color: #ffffff; padding: 25px; border-radius: 8px; margin-bottom: 30px; border-left: 4px solid #ab3500;">
                            <p style="color: #0f172a; margin: 0 0 15px 0; font-size: 16px; line-height: 1.8;">
                                Hello,
                            </p>
                            <p style="color: #475569; margin: 0; font-size: 15px; line-height: 1.8;">
                                <strong style="color: #0f172a;">${invitedByName}</strong> has personally invited you to join our admin team at <strong>Online CBT</strong>. We believe you have the expertise and dedication to help us maintain and grow our platform.
                            </p>
                        </div>

                        <!-- Admin Responsibilities -->
                        <div style="background-color: #ffffff; padding: 25px; border-radius: 8px; margin-bottom: 30px;">
                            <h3 style="color: #0f172a; margin: 0 0 20px 0; font-size: 18px; font-weight: 600;">As an Admin, You'll Be Able To:</h3>
                            <ul style="margin: 0; padding-left: 20px; list-style: none;">
                                <li style="color: #475569; margin-bottom: 12px; font-size: 15px; line-height: 1.6;">
                                    <span style="color: #ab3500; font-weight: 600;">✓</span> Manage question banks and exam content
                                </li>
                                <li style="color: #475569; margin-bottom: 12px; font-size: 15px; line-height: 1.6;">
                                    <span style="color: #ab3500; font-weight: 600;">✓</span> Monitor student performance and results
                                </li>
                                <li style="color: #475569; margin-bottom: 12px; font-size: 15px; line-height: 1.6;">
                                    <span style="color: #ab3500; font-weight: 600;">✓</span> Create and assign assessments
                                </li>
                                <li style="color: #475569; margin-bottom: 12px; font-size: 15px; line-height: 1.6;">
                                    <span style="color: #ab3500; font-weight: 600;">✓</span> Generate detailed analytics and reports
                                </li>
                                <li style="color: #475569; margin-bottom: 0; font-size: 15px; line-height: 1.6;">
                                    <span style="color: #ab3500; font-weight: 600;">✓</span> Access administrative dashboard and settings
                                </li>
                            </ul>
                        </div>

                        <!-- Time Sensitive Warning -->
                        <div style="background-color: #fef3c7; padding: 20px; border-radius: 8px; border-left: 4px solid #f59e0b; margin-bottom: 30px;">
                            <p style="color: #92400e; margin: 0; font-size: 14px; line-height: 1.6;">
                                <strong>⏰ Important:</strong> This invitation expires in <strong>7 days</strong>. Please accept it before it expires.
                            </p>
                        </div>

                        <!-- CTA Button -->
                        <div style="text-align: center; margin-bottom: 30px;">
                            <a href="${invitationLink}" style="display: inline-block; background: linear-gradient(135deg, #ab3500 0%, #8a2a00 100%); color: #ffffff; text-decoration: none; padding: 16px 50px; border-radius: 6px; font-weight: 700; font-size: 16px; transition: all 0.3s ease; border: none; cursor: pointer; box-shadow: 0 4px 12px rgba(171, 53, 0, 0.3);">
                                Accept Invitation
                            </a>
                        </div>

                        <!-- Alternative Link -->
                        <div style="background-color: #ffffff; padding: 20px; border-radius: 8px; text-align: center; border: 1px dashed #cbd5e1;">
                            <p style="color: #64748b; margin: 0 0 10px 0; font-size: 13px; font-weight: 600;">Can't click the button? Copy this link:</p>
                            <p style="word-break: break-all; color: #ab3500; margin: 0; font-size: 12px; font-family: 'Courier New', monospace;">
                                ${invitationLink}
                            </p>
                        </div>

                    </div>

                    <!-- Footer -->
                    <div style="background-color: #0f172a; padding: 30px; text-align: center; border-top: 1px solid #1e293b;">
                        
                        <!-- Questions Section -->
                        <div style="margin-bottom: 20px; padding-bottom: 20px; border-bottom: 1px solid #1e293b;">
                            <p style="color: #cbd5e1; margin: 0; font-size: 13px;">
                                <strong>Questions about this invitation?</strong><br>
                                Contact us at <a href="mailto:support@onlinecbt.com" style="color: #ab3500; text-decoration: none; font-weight: 600;">support@onlinecbt.com</a>
                            </p>
                        </div>

                        <!-- Contact Info -->
                        <div style="border-bottom: 1px solid #1e293b; padding-bottom: 20px; margin-bottom: 20px;">
                            <p style="color: #cbd5e1; margin: 0 0 8px 0; font-size: 13px;">
                                <strong style="color: #ffffff;">Online CBT</strong> | Computer-Based Testing Platform
                            </p>
                            <p style="color: #64748b; margin: 0; font-size: 12px;">
                                Email: <a href="mailto:admin@onlinecbt.com" style="color: #ab3500; text-decoration: none;">admin@onlinecbt.com</a>
                            </p>
                        </div>

                        <!-- Legal Links -->
                        <p style="margin: 0; font-size: 12px;">
                            <a href="#" style="color: #64748b; text-decoration: none; margin-right: 15px;">Privacy Policy</a>
                            <a href="#" style="color: #64748b; text-decoration: none; margin-right: 15px;">Terms of Service</a>
                            <a href="#" style="color: #64748b; text-decoration: none;">Help Center</a>
                        </p>

                        <!-- Copyright -->
                        <p style="color: #475569; margin: 15px 0 0 0; font-size: 11px;">
                            © 2024 Online CBT. All rights reserved.
                        </p>
                    </div>

                </div>

            </body>
            </html>
        `
    };

    return resend.emails.send(mailOptions)
        .then((response) => {
            console.log("Admin invitation email sent successfully to:", invitedEmail);
            console.log("Email ID:", response.id);
            return { success: true, message: "Invitation email sent successfully", emailId: response.id };
        })
        .catch((error) => {
            console.error("Failed to send admin invitation to:", invitedEmail);
            console.error("Resend error details:", error);
            console.error("Error message:", error.message);
            return { success: false, error: error.message };
        });
};

module.exports = { sendWelcomeEmail, sendAdminInvitationEmail };
