import nodemailer from 'nodemailer';

type MeetingDetails = {
  title: string;
  date: string;
  time: string;
  location: string;
  description: string;
  meetLink?: string;
  clubName: string;
};

type EmailRecipient = {
  email: string;
  name: string;
};

// Create reusable transporter object using Gmail SMTP
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'koitobanda@gmail.com',
    pass: 'pzqv cgpc izkh xccz', // App password for Gmail
  },
});

/**
 * Send meeting invitation emails to club members
 */
export async function sendMeetingInvitation(
  recipients: EmailRecipient[],
  meetingDetails: MeetingDetails
): Promise<boolean> {
  try {
    // Verify transporter connection configuration
    await transporter.verify();
    
    // Create meeting invitation HTML template
    const htmlContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #1e293b; color: #ffffff; border-radius: 8px;">
        <div style="text-align: center; padding-bottom: 20px; border-bottom: 1px solid #334155;">
          <h1 style="color: #94a3b8; margin-bottom: 5px;">${meetingDetails.clubName}</h1>
          <h2 style="color: #f8fafc; margin-top: 5px;">Meeting Invitation</h2>
        </div>
        
        <div style="padding: 20px 0;">
          <h3 style="color: #e2e8f0;">${meetingDetails.title}</h3>
          
          <div style="background-color: #334155; padding: 15px; border-radius: 6px; margin: 15px 0;">
            <p style="margin: 5px 0;"><strong>Date:</strong> ${meetingDetails.date}</p>
            <p style="margin: 5px 0;"><strong>Time:</strong> ${meetingDetails.time}</p>
            <p style="margin: 5px 0;"><strong>Location:</strong> ${meetingDetails.location}</p>
            ${meetingDetails.meetLink ? `<p style="margin: 5px 0;"><strong>Meeting Link:</strong> <a href="${meetingDetails.meetLink}" style="color: #38bdf8;">${meetingDetails.meetLink}</a></p>` : ''}
          </div>
          
          <p style="line-height: 1.6; color: #cbd5e1;">${meetingDetails.description}</p>
        </div>
        
        <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #334155;">
          <p style="font-size: 14px; color: #94a3b8;">This is an automated message. Please do not reply to this email.</p>
        </div>
      </div>
    `;
    
    // Send emails to all recipients
    const emailPromises = recipients.map(recipient => {
      const mailOptions = {
        from: {
          name: `${meetingDetails.clubName} Club`,
          address: 'koitobanda@gmail.com'
        },
        to: {
          name: recipient.name,
          address: recipient.email
        },
        subject: `Meeting Invitation: ${meetingDetails.title}`,
        html: htmlContent,
        text: `${meetingDetails.clubName} Meeting Invitation: ${meetingDetails.title}\n\nDate: ${meetingDetails.date}\nTime: ${meetingDetails.time}\nLocation: ${meetingDetails.location}\n${meetingDetails.meetLink ? `Meeting Link: ${meetingDetails.meetLink}\n` : ''}\n${meetingDetails.description}`
      };
      
      return transporter.sendMail(mailOptions);
    });
    
    await Promise.all(emailPromises);
    return true;
  } catch (error) {
    console.error('Error sending meeting invitation emails:', error);
    return false;
  }
} 