
// Basic EmailJS service encapsulating all notification logic
import emailjs from '@emailjs/browser';

// Environment variables for security
const SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID;
const TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
const PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;

export const emailService = {
    // 1. Welcome Email (on Registration)
    sendWelcomeEmail: (user) => {
        const templateParams = {
            to_email: user.email,
            user_name: user.username || user.fullName,
            message: `Welcome to MicroLift, ${user.username || user.fullName}! Your account has been created. Please wait for admin verification.`,
        };
        return sendEmail(templateParams);
    },

    // 2. Verification Email (when Admin verifies user)
    sendVerificationEmail: (user) => {
        const templateParams = {
            to_email: user.email,
            user_name: user.username || user.fullName,
            message: `Congratulations! Your account has been VERIFIED by the admin. You can now create campaigns.`,
        };
        return sendEmail(templateParams);
    },

    // 3. Campaign Approved (when Admin sets status to LIVE)
    sendCampaignApprovedEmail: (campaign, user) => {
        const templateParams = {
            to_email: user ? user.email : '',
            user_name: user ? (user.username || user.fullName) : 'Campaign Owner',
            message: `Your campaign "${campaign.title}" is now LIVE! Good luck raising funds.`,
        };
        return sendEmail(templateParams);
    },

    // 4. Donation Received (to Beneficiary)
    sendDonationReceivedEmail: (beneficiaryEmail, beneficiaryName, amount, campaignTitle, donorName) => {
        const templateParams = {
            to_email: beneficiaryEmail,
            user_name: beneficiaryName,
            message: `Great news! You received a donation of ₹${amount} for your campaign "${campaignTitle}" from ${donorName}.`,
        };
        return sendEmail(templateParams);
    }
};

// Internal helper function
const sendEmail = (params) => {
    // EmailJS sends emails using standard parameters:
    // - to_email: Recipient's email address
    // - user_name: Name to display in the email
    // - message: The actual email content

    console.log(`[EmailJS] Sending email to ${params.to_email}...`, params);

    return emailjs.send(SERVICE_ID, TEMPLATE_ID, params, PUBLIC_KEY)
        .then((response) => {
            console.log('[EmailJS] SUCCESS!', response.status, response.text);
            return response;
        }, (error) => {
            console.log('[EmailJS] FAILED...', error);
            // We don't want to break the app flow if email fails, so we just log it.
            return Promise.resolve({ status: 'failed', error });
        });
};
