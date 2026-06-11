const nodemailer = require('nodemailer');
const Notification = require('../models/Notification');
const User = require('../models/User');

/**
 * Sends a milestone notification (Simulates Telegram/Email, logs to DB, and triggers real SMTP/APIs if configured)
 */
const sendAlert = async ({ userId, projectId, type, recipient, title, message, direction }) => {
  try {
    // 1. Log alert to Database for dashboard display
    const notification = await Notification.create({
      userId,
      projectId,
      recipient,
      type,
      title,
      message,
      direction
    });

    // 2. Terminal Console Simulator (Stunning card layout for testing)
    const isTelegram = type === 'telegram';
    const header = isTelegram ? '📱 TELEGRAM ALERT SIMULATOR' : '📧 EMAIL ALERT SIMULATOR';
    const borderChar = isTelegram ? '🟩' : '🟦';
    
    if (process.env.NODE_ENV !== 'production') {
      console.log(`\n${borderChar} ${header} ${borderChar}`);
      console.log(`To:        ${recipient}`);
      console.log(`Recipient: ${direction === 'to_user' ? 'Client' : 'Administrator'}`);
      console.log(`Subject:   ${title}`);
      console.log(`Message:\n------------------------------------------------------------`);
      console.log(message);
      console.log(`------------------------------------------------------------\n`);
    }

    // 3. Real Email Delivery if SMTP is configured
    if (!isTelegram && process.env.EMAIL_USER && process.env.EMAIL_PASS && process.env.EMAIL_HOST) {
      try {
        const transporter = nodemailer.createTransport({
          host: process.env.EMAIL_HOST,
          port: parseInt(process.env.EMAIL_PORT) || 587,
          secure: parseInt(process.env.EMAIL_PORT) === 465,
          auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
          }
        });

        const mailOptions = {
          from: `"${process.env.EMAIL_FROM_NAME || 'DevQueue Studio'}" <${process.env.EMAIL_FROM || 'noreply@devqueue.studio'}>`,
          to: recipient,
          subject: title,
          html: `
            <div style="font-family: 'Inter', sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; background-color: #111318; color: #e8eaf0; border-radius: 16px; border: 1px solid rgba(255,255,255,0.08);">
              <h2 style="color: #fbbf24; text-align: center; font-family: 'Syne', sans-serif; margin-bottom: 20px;">${title}</h2>
              <div style="background-color: rgba(255,255,255,0.02); border: 1px solid rgba(255,255,255,0.04); padding: 20px; border-radius: 12px; line-height: 1.6;">
                <p style="font-size: 15px; margin: 0 0 16px 0; color: #e8eaf0;">${message.replace(/\n/g, '<br/>')}</p>
                <div style="text-align: center; margin-top: 24px;">
                  <a href="${process.env.CLIENT_URL || 'http://localhost:5173'}/dashboard" style="background: #fbbf24; color: #111318; padding: 12px 28px; text-decoration: none; border-radius: 99px; font-weight: bold; display: inline-block; box-shadow: 0 4px 14px rgba(251,191,36,0.3);">Access DevQueue Workspace</a>
                </div>
              </div>
              <hr style="border: 0; border-top: 1px solid rgba(255,255,255,0.06); margin: 24px 0;" />
              <p style="font-size: 11px; color: #5a6075; text-align: center;">This is an automated operational milestone alert sent regarding your project tracking. DevQueue Studio.</p>
            </div>
          `
        };

        await transporter.sendMail(mailOptions);
        console.log(`[AlertService] Real email alert dispatched successfully to ${recipient}`);
      } catch (err) {
        console.error('[AlertService] Real SMTP delivery failed:', err.message);
      }
    }

    // 4. Real Telegram Delivery via HTTP API
    if (isTelegram && process.env.TELEGRAM_BOT_TOKEN && process.env.TELEGRAM_CHAT_ID) {
      try {
        const token = process.env.TELEGRAM_BOT_TOKEN;
        const chatId = process.env.TELEGRAM_CHAT_ID;
        const url = `https://api.telegram.org/bot${token}/sendMessage`;
        
        const response = await fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            chat_id: chatId,
            text: message,
            parse_mode: 'Markdown'
          })
        });
        const data = await response.json();
        if (data.ok) {
          console.log(`[AlertService] Real Telegram alert sent successfully to Chat ID: ${chatId}`);
        } else {
          console.warn(`[AlertService] Telegram API error: ${data.description}`);
        }
      } catch (err) {
        console.error('[AlertService] Real Telegram delivery failed:', err.message);
      }
    }

    return notification;
  } catch (error) {
    console.error('[AlertService] Error sending milestone alert:', error);
  }
};

/**
 * Triggers dual Telegram & Email alerts for User & Admin milestones
 */
const triggerMilestoneAlerts = async ({ user, project, eventName, customDetails = {} }) => {
  const adminEmail = process.env.ADMIN_EMAIL || 'Reqworks.tech@gmail.com';
  const adminTelegramId = process.env.TELEGRAM_CHAT_ID || 'admin_telegram_channel';
  
  const userEmail = user.email;
  const projName = project.projectName;
  const clientName = user.name;

  let title = '';
  let userMsg = '';
  let adminMsg = '';

  switch (eventName) {
    case 'SUBMITTED':
      title = `Project Proposal Submitted: ${projName}`;
      userMsg = `Hello ${clientName},\n\nYour project proposal "${projName}" has been successfully submitted to the DevQueue intake queue! Our engineers are reviewing your specifications and uploaded files. We will update you with a cost estimation shortly.\n\nNote: A 25% confirmation deposit will be required to activate the project and begin the Planning Phase once the estimate is ready.\n\nBest regards,\nDevQueue Engineering Team`;
      adminMsg = `🚨 *NEW BLUEPRINT SUBMITTED* 🚨\n\nClient *${clientName}* (${userEmail}) has submitted a new proposal:\n• *Project*: ${projName}\n• *Stack*: ${project.stack}\n• *Budget*: ${project.budget}\n• *AI Integration*: ${project.needsAi ? 'Yes' : 'No'}\n• *Files*: ${project.files.length} attached.\n\nPlease review requirements and assign a price estimation.`;
      
      const submittedTelegramMsg = `🚨 *NEW BLUEPRINT SUBMITTED* 🚨\n\nA new project proposal has been submitted to the queue:\n• *Project*: ${projName}\n• *Stack*: ${project.stack}\n• *AI Integration*: ${project.needsAi ? 'Yes' : 'No'}\n• *Files*: ${project.files.length} attached.\n\nPlease review specifications securely on the admin dashboard: ${process.env.CLIENT_URL || 'http://localhost:5173'}/admin/dashboard`;

      // Notify User (Email) & Admin (Telegram + Email)
      await sendAlert({ userId: user._id, projectId: project._id, type: 'email', recipient: userEmail, title, message: userMsg, direction: 'to_user' });
      await sendAlert({ userId: user._id, projectId: project._id, type: 'telegram', recipient: adminTelegramId, title, message: submittedTelegramMsg, direction: 'to_admin' });
      await sendAlert({ userId: user._id, projectId: project._id, type: 'email', recipient: adminEmail, title, message: adminMsg, direction: 'to_admin' });
      break;

    case 'ESTIMATED':
      const priceVal = customDetails.price;
      const depositVal = Math.round(Number(priceVal) * 0.25);
      const formattedPrice = `₹${Number(priceVal).toLocaleString('en-IN')}`;
      const formattedDeposit = `₹${depositVal.toLocaleString('en-IN')}`;
      title = `Action Required: Pay 25% Deposit for ${projName}`;
      userMsg = `Dear ${clientName},\n\nDevQueue has completed the technical audit for your project "${projName}". We have estimated the total contract price at ${formattedPrice}.\n\n⚠️ IMPORTANT: You are required to pay a 25% confirmation deposit of ${formattedDeposit} before our engineering team can begin planning and development.\n\nOnce paid, your project will automatically enter the active build queue in the Planning Phase.\n\nReview estimation & pay deposit on your Billing dashboard: ${process.env.CLIENT_URL || 'http://localhost:5173'}/dashboard/billing`;
      
      // Notify User (Email)
      await sendAlert({ userId: user._id, projectId: project._id, type: 'email', recipient: userEmail, title, message: userMsg, direction: 'to_user' });
      break;

    case 'BARGAINED':
      const originalEst = `$${project.estimatedPrice}`;
      const counterPrice = `$${customDetails.price}`;
      title = `Counter-Offer Proposed: ${projName}`;
      adminMsg = `⚖️ *CLIENT COUNTER-OFFER* ⚖️\n\nClient *${clientName}* has suggested a bargain for *${projName}*:\n• *Original Estimate*: ${originalEst}\n• *Counter Price*: ${counterPrice}\n• *Message*: "${customDetails.message || 'No comment'}"\n\nPlease manage the offer in the Admin panel.`;
      
      const bargainedTelegramMsg = `⚖️ *CLIENT COUNTER-OFFER* ⚖️\n\nA bargain counter-proposal has been submitted:\n• *Project*: ${projName}\n• *Original Estimate*: ${originalEst}\n• *Counter Price*: ${counterPrice}\n\nPlease manage the offer securely on the admin dashboard: ${process.env.CLIENT_URL || 'http://localhost:5173'}/admin/dashboard`;

      // Notify Admin (Telegram + Email)
      await sendAlert({ userId: user._id, projectId: project._id, type: 'telegram', recipient: adminTelegramId, title: `⚖️ Bargain counter: ${counterPrice}`, message: bargainedTelegramMsg, direction: 'to_admin' });
      await sendAlert({ userId: user._id, projectId: project._id, type: 'email', recipient: adminEmail, title, message: adminMsg, direction: 'to_admin' });
      break;

    case 'DELETED':
      title = `Proposal Cancelled: ${projName}`;
      adminMsg = `🗑️ *PROPOSAL DELETED* 🗑️\n\nClient *${clientName}* has deleted their project proposal "${projName}". This project has been removed from intake logs.`;
      
      const deletedTelegramMsg = `🗑️ *PROPOSAL DELETED* 🗑️\n\nProject proposal "${projName}" has been deleted by the client and removed from intake logs.`;

      // Notify Admin (Telegram + Email)
      await sendAlert({ userId: user._id, projectId: project._id, type: 'telegram', recipient: adminTelegramId, title, message: deletedTelegramMsg, direction: 'to_admin' });
      await sendAlert({ userId: user._id, projectId: project._id, type: 'email', recipient: adminEmail, title, message: adminMsg, direction: 'to_admin' });
      break;

    case 'BOOKED':
      const depositPaid = `₹${customDetails.depositAmount}`;
      const totalBudget = `${project.budget}`;
      const qPos = customDetails.queuePosition;
      
      // Parse requirements JSON
      let reqs = {};
      try {
        if (project.requirements) {
          reqs = JSON.parse(project.requirements);
        }
      } catch (e) {
        reqs = { description: project.requirements };
      }

      const desc = reqs.description || 'No description provided';
      const tagline = reqs.tagline || 'No tagline';
      const deadline = reqs.deadline || 'Not specified';
      const priority = reqs.priority || 'Normal';
      const platform = reqs.deployPlatform || 'Not specified';

      title = `🚨 Project Booked: ${projName}`;
      
      userMsg = `Congratulations ${clientName}!\n\nYour 25% deposit of ${depositPaid} has been verified via Razorpay! Your project "${projName}" is officially booked and has entered our active engineering cycle at Queue Position #${qPos}.\n\nYou can track the project stage live in your portal!`;
      
      adminMsg = `⚡ *PROJECT BOOKED & QUEUED* ⚡\n\n` +
                 `*CLIENT INFORMATION*:\n` +
                 `• *Name*: ${clientName}\n` +
                 `• *Email*: ${userEmail}\n` +
                 `• *Phone*: ${user.phone || 'N/A'}\n\n` +
                 `*PROJECT DETAILS*:\n` +
                 `• *Project*: ${projName}\n` +
                 `• *Tagline*: ${tagline}\n` +
                 `• *Description*: ${desc}\n` +
                 `• *Stack*: ${project.stack}\n` +
                 `• *Deposit Paid*: ${depositPaid}\n` +
                 `• *Total Contract Price*: ${totalBudget}\n` +
                 `• *Target Deadline*: ${deadline}\n` +
                 `• *Priority*: ${priority}\n` +
                 `• *Deployment Host*: ${platform}\n` +
                 `• *AI Integration*: ${project.needsAi ? 'Yes' : 'No'}\n\n` +
                 `*QUEUE STATUS*:\n` +
                 `• *Position*: #${qPos} (Planning Stage)\n\n` +
                 `Please review specifications in the Admin Dashboard: ${process.env.CLIENT_URL || 'http://localhost:5173'}/admin/dashboard`;

      const bookedTelegramMsg = `⚡ *PROJECT BOOKED & QUEUED* ⚡\n\n` +
                                `A new project has been officially booked and queued:\n` +
                                `• *Project*: ${projName}\n` +
                                `• *Stack*: ${project.stack}\n` +
                                `• *Deposit Paid*: ${depositPaid}\n` +
                                `• *AI Integration*: ${project.needsAi ? 'Yes' : 'No'}\n\n` +
                                `*QUEUE STATUS*:\n` +
                                `• *Position*: #${qPos} (Planning Stage)\n\n` +
                                `Please log in to access user contact info and project specifications securely: ${process.env.CLIENT_URL || 'http://localhost:5173'}/admin/dashboard`;

      // Notify User (Email) & Admin (Telegram + Email)
      await sendAlert({ userId: user._id, projectId: project._id, type: 'email', recipient: userEmail, title, message: userMsg, direction: 'to_user' });
      await sendAlert({ userId: user._id, projectId: project._id, type: 'telegram', recipient: adminTelegramId, title: `💰 Project Booked: ${projName}`, message: bookedTelegramMsg, direction: 'to_admin' });
      await sendAlert({ userId: user._id, projectId: project._id, type: 'email', recipient: adminEmail, title, message: adminMsg, direction: 'to_admin' });
      break;

    case 'STAGE_CHANGED':
      const newStage = project.stage;
      title = `Pipeline Phase Update: ${projName}`;
      
      let phaseNum = 1;
      let stageDescription = '';
      if (newStage === 'Review') { phaseNum = 1; stageDescription = 'We are verifying technical blueprint specifications and dependencies.'; }
      else if (newStage === 'Planning') { phaseNum = 2; stageDescription = 'Database schemas, interface mockups, and route architectures are being mapped.'; }
      else if (newStage === 'Building') { phaseNum = 3; stageDescription = 'Active engineering! Coding backend endpoints, database integration, and UI modules.'; }
      else if (newStage === 'Testing') { phaseNum = 4; stageDescription = 'Performing QA integration audits, load tests, and security scanning.'; }
      else if (newStage === 'Final Checks') { phaseNum = 5; stageDescription = 'Applying polishing touches, preparing production hosting configurations, and reviewing deliverables.'; }
      else if (newStage === 'Completed') { phaseNum = 5; stageDescription = 'All milestones met! Full deliverable codebases deployed and final billing closed.'; }

      userMsg = `Hello ${clientName},\n\nYour project "${projName}" has successfully advanced to the next milestone:\n\n🚩 CURRENT PHASE: Phase ${phaseNum}/5 — ${newStage}\n📝 DETAILS: ${stageDescription}\n\nTrack progress live: ${process.env.CLIENT_URL || 'http://localhost:5173'}/dashboard`;
      
      // Notify User (Email)
      await sendAlert({ userId: user._id, projectId: project._id, type: 'email', recipient: userEmail, title, message: userMsg, direction: 'to_user' });
      break;

    default:
      break;
  }
};

module.exports = { triggerMilestoneAlerts, sendAlert };
