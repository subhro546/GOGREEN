import nodemailer from "nodemailer";

// Environment Configuration
const accountSid = process.env.TWILIO_ACCOUNT_SID || "";
const authToken = process.env.TWILIO_AUTH_TOKEN || "";
const fromSmsNumber = process.env.TWILIO_FROM_SMS_NUMBER || ""; // e.g., +15017122661
const fromWhatsAppNumber = process.env.TWILIO_FROM_WHATSAPP_NUMBER || ""; // e.g., whatsapp:+14155238886

const adminEmail = process.env.ADMIN_EMAIL || "admin@gogreen.com";
const adminPhone = process.env.ADMIN_PHONE || ""; // e.g. +919999999999

const smtpHost = process.env.SMTP_HOST || "";
const smtpPort = parseInt(process.env.SMTP_PORT || "587");
const smtpUser = process.env.SMTP_USER || "";
const smtpPass = process.env.SMTP_PASS || "";
const smtpFrom = process.env.SMTP_FROM || "GoGreen Nursery <notifications@gogreen.com>";

const isTwilioConfigured = !!(accountSid && authToken);
const isSmtpConfigured = !!(smtpHost && smtpUser && smtpPass);

/**
 * Sends an email using SMTP. Falls back to console log if SMTP is not configured.
 */
export async function sendEmail(to: string, subject: string, text: string, html?: string) {
  if (!isSmtpConfigured) {
    console.log(`[MOCK EMAIL] To: ${to} | Subject: ${subject}`);
    console.log(`[MOCK EMAIL CONTENT]\n${text}\n-------------------`);
    return;
  }

  try {
    const transporter = nodemailer.createTransport({
      host: smtpHost,
      port: smtpPort,
      secure: smtpPort === 465,
      auth: {
        user: smtpUser,
        pass: smtpPass,
      },
    });

    await transporter.sendMail({
      from: smtpFrom,
      to,
      subject,
      text,
      html: html || text.replace(/\n/g, "<br>"),
    });
    console.log(`Email successfully sent to ${to}`);
  } catch (error) {
    console.error("Email sending error:", error);
  }
}

/**
 * Sends an SMS message via Twilio. Falls back to console log if not configured.
 */
export async function sendSms(to: string, message: string) {
  if (!isTwilioConfigured || !fromSmsNumber) {
    console.log(`[MOCK SMS] To: ${to} | Message: ${message}`);
    return;
  }

  try {
    const url = `https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Messages.json`;
    const auth = Buffer.from(`${accountSid}:${authToken}`).toString("base64");
    const body = new URLSearchParams();
    body.append("To", to);
    body.append("From", fromSmsNumber);
    body.append("Body", message);

    const res = await fetch(url, {
      method: "POST",
      headers: {
        "Authorization": `Basic ${auth}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: body.toString(),
    });

    if (!res.ok) {
      const errData = await res.json();
      throw new Error(errData.message || "Failed to send Twilio SMS");
    }
    console.log(`SMS successfully sent to ${to}`);
  } catch (error) {
    console.error("SMS sending error:", error);
  }
}

/**
 * Sends a WhatsApp message via Twilio WhatsApp API. Falls back to console log if not configured.
 */
export async function sendWhatsApp(to: string, message: string) {
  const formattedTo = to.startsWith("whatsapp:") ? to : `whatsapp:${to}`;
  const formattedFrom = fromWhatsAppNumber.startsWith("whatsapp:") ? fromWhatsAppNumber : `whatsapp:${fromWhatsAppNumber}`;

  if (!isTwilioConfigured || !fromWhatsAppNumber) {
    console.log(`[MOCK WHATSAPP] To: ${formattedTo} | Message: ${message}`);
    return;
  }

  try {
    const url = `https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Messages.json`;
    const auth = Buffer.from(`${accountSid}:${authToken}`).toString("base64");
    const body = new URLSearchParams();
    body.append("To", formattedTo);
    body.append("From", formattedFrom);
    body.append("Body", message);

    const res = await fetch(url, {
      method: "POST",
      headers: {
        "Authorization": `Basic ${auth}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: body.toString(),
    });

    if (!res.ok) {
      const errData = await res.json();
      throw new Error(errData.message || "Failed to send Twilio WhatsApp");
    }
    console.log(`WhatsApp successfully sent to ${formattedTo}`);
  } catch (error) {
    console.error("WhatsApp sending error:", error);
  }
}

export interface OrderNotificationData {
  id: string;
  totalAmount: number;
  razorpayOrderId?: string | null;
  shippingAddress: string;
  user?: {
    name?: string | null;
    email?: string;
    phone?: string | null;
  } | null;
  items?: Array<{
    price: number;
    quantity: number;
    product: {
      name: string;
      description: string;
      images: string;
      sku?: string | null;
    };
  }>;
}

/**
 * Notify User and Admin when a new order is placed
 */
export async function notifyOrderPlacement(order: OrderNotificationData) {
  try {
    const orderIdShort = order.id.slice(-8).toUpperCase();
    const isCod = order.razorpayOrderId?.startsWith("cod_");
    const paymentMethodText = isCod ? "Cash on Delivery (COD)" : "Prepaid Online";
    const totalFormatted = order.totalAmount.toFixed(2);
    
    // Extracted phone and user info
    const customerPhone = order.user?.phone || order.items?.[0]?.product?.sku?.match(/Ph:\s*(\d{10})/)?.[1] || "";
    const customerName = order.user?.name || "Customer";
    const customerEmail = order.user?.email || "";

    // ── 1. USER MESSAGES ──
    const userMessage = `Hi ${customerName}, thank you for ordering from GoGreen Nursery! 🌿 Your Order #${orderIdShort} has been placed successfully via ${paymentMethodText}. Total Amount: ₹${totalFormatted}. We are preparing your plants!`;
    
    // Send SMS to user if phone exists
    if (customerPhone) {
      await sendSms(customerPhone, userMessage);
      await sendWhatsApp(customerPhone, userMessage);
    } else {
      // Look for phone number in shippingAddress string
      const phoneMatch = order.shippingAddress?.match(/Ph:\s*(\d{10})/);
      if (phoneMatch && phoneMatch[1]) {
        await sendSms(phoneMatch[1], userMessage);
        await sendWhatsApp(phoneMatch[1], userMessage);
      }
    }

    // ── 2. ADMIN MESSAGES ──
    const adminMessage = `🚨 NEW ORDER RECEIVED! Order #${orderIdShort} has been placed by ${customerName} (${customerEmail}) for ₹${totalFormatted} via ${paymentMethodText}.\nShipping Address:\n${order.shippingAddress}`;
    
    // Email Admin
    await sendEmail(
      adminEmail, 
      `🚨 New Order Received #${orderIdShort} - GoGreen Nursery`, 
      adminMessage
    );

    // WhatsApp Admin
    if (adminPhone) {
      await sendWhatsApp(adminPhone, adminMessage);
    }
  } catch (err) {
    console.error("Failed to notify order placement:", err);
  }
}

/**
 * Notify User and Admin when an order status is updated
 */
export async function notifyOrderStatusUpdate(order: OrderNotificationData, oldStatus: string, newStatus: string) {
  try {
    const orderIdShort = order.id.slice(-8).toUpperCase();
    const totalFormatted = order.totalAmount.toFixed(2);
    const customerName = order.user?.name || "Customer";
    const customerEmail = order.user?.email || "";
    
    // Extracted phone
    const customerPhone = order.user?.phone || "";

    // ── 1. USER MESSAGE ──
    const userMessage = `Hi ${customerName}, your GoGreen Nursery order #${orderIdShort} has been updated to: ${newStatus}! 🌿 Total: ₹${totalFormatted}. Thank you for shopping with us!`;
    
    if (customerPhone) {
      await sendSms(customerPhone, userMessage);
      await sendWhatsApp(customerPhone, userMessage);
    } else {
      const phoneMatch = order.shippingAddress?.match(/Ph:\s*(\d{10})/);
      if (phoneMatch && phoneMatch[1]) {
        await sendSms(phoneMatch[1], userMessage);
        await sendWhatsApp(phoneMatch[1], userMessage);
      }
    }

    // ── 2. ADMIN MESSAGE ──
    const adminMessage = `🔔 ORDER UPDATE! Order #${orderIdShort} status changed from ${oldStatus} to ${newStatus}.\nCustomer: ${customerName} (${customerEmail})\nTotal: ₹${totalFormatted}`;
    
    // Email Admin
    await sendEmail(
      adminEmail,
      `🔔 Order Status Updated #${orderIdShort} -> ${newStatus}`,
      adminMessage
    );

    // WhatsApp Admin
    if (adminPhone) {
      await sendWhatsApp(adminPhone, adminMessage);
    }
  } catch (err) {
    console.error("Failed to notify status update:", err);
  }
}
