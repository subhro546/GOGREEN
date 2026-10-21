import nodemailer from "nodemailer";

// Environment Configuration
const accountSid = process.env.TWILIO_ACCOUNT_SID || "";
const authToken = process.env.TWILIO_AUTH_TOKEN || "";
const fromSmsNumber = process.env.TWILIO_FROM_SMS_NUMBER || "";
const fromWhatsAppNumber = process.env.TWILIO_FROM_WHATSAPP_NUMBER || "";

const adminEmail = process.env.ADMIN_EMAIL || "admin@gogreen.com";
const adminPhone = process.env.ADMIN_PHONE || "";

const smtpHost = process.env.SMTP_HOST || "";
const smtpPort = parseInt(process.env.SMTP_PORT || "587", 10);
const smtpUser = process.env.SMTP_USER || "";
const smtpPass = process.env.SMTP_PASS || "";
const smtpFrom = process.env.SMTP_FROM || "GoGreen Nursery <notifications@gogreen.com>";

export const isTwilioConfigured = !!(
  accountSid &&
  authToken &&
  !accountSid.includes("PASTE_YOUR") &&
  !authToken.includes("PASTE_YOUR")
);

export const isSmtpConfigured = !!(
  smtpHost &&
  smtpUser &&
  smtpPass &&
  !smtpHost.includes("PASTE_YOUR") &&
  !smtpUser.includes("PASTE_YOUR")
);

// In-memory idempotency tracker to prevent duplicate emails across retries
const processedConfirmationOrders = new Set<string>();
const processedStatusUpdates = new Set<string>();

export function resetNotificationDeduplicationForTests() {
  processedConfirmationOrders.clear();
  processedStatusUpdates.clear();
}

export function maskEmail(email: string): string {
  if (!email || !email.includes("@")) return "***";
  const [user, domain] = email.split("@");
  return `${user.slice(0, 2)}***@${domain}`;
}

export function maskPhone(phone: string): string {
  if (!phone) return "***";
  const clean = phone.replace(/\D/g, "");
  if (clean.length < 4) return "***";
  return `***${clean.slice(-4)}`;
}

function escapeHtml(str: string): string {
  if (!str) return "";
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

/**
 * Sends an email using SMTP. Falls back to safe log in development if SMTP is not configured.
 * Returns true if sent or simulated, false on failure.
 */
export async function sendEmail(
  to: string,
  subject: string,
  text: string,
  html?: string
): Promise<boolean> {
  if (!isSmtpConfigured) {
    if (process.env.NODE_ENV !== "production") {
      console.log(`[DEV NOTIFICATION] Mock Email queued for: ${maskEmail(to)} | Subject: ${subject}`);
    }
    return true; // Successfully bypassed in dev
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
      connectionTimeout: 10000,
      greetingTimeout: 10000,
      socketTimeout: 15000,
    });

    await transporter.sendMail({
      from: smtpFrom,
      to,
      subject,
      text,
      html: html || text.replace(/\n/g, "<br>"),
    });

    console.log(`Email successfully dispatched to ${maskEmail(to)}`);
    return true;
  } catch (error) {
    console.error("Email sending error:", error instanceof Error ? error.message : "Unknown error");
    return false;
  }
}

/**
 * Reserved for future SMS notifications
 */
export async function sendSms(to: string, message: string): Promise<void> {
  if (!isTwilioConfigured || !fromSmsNumber) {
    if (process.env.NODE_ENV !== "production") {
      console.log(`[DEV NOTIFICATION] Mock SMS queued for: ${maskPhone(to)}`);
    }
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
        Authorization: `Basic ${auth}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: body.toString(),
    });

    if (!res.ok) {
      const errData = await res.json();
      throw new Error(errData.message || "Failed to send Twilio SMS");
    }
  } catch (error) {
    console.error("SMS sending error:", error instanceof Error ? error.message : "Error");
  }
}

/**
 * Reserved for future WhatsApp notifications
 */
export async function sendWhatsApp(to: string, message: string): Promise<void> {
  const formattedTo = to.startsWith("whatsapp:") ? to : `whatsapp:${to}`;
  const formattedFrom = fromWhatsAppNumber.startsWith("whatsapp:")
    ? fromWhatsAppNumber
    : `whatsapp:${fromWhatsAppNumber}`;

  if (!isTwilioConfigured || !fromWhatsAppNumber) {
    if (process.env.NODE_ENV !== "production") {
      console.log(`[DEV NOTIFICATION] Mock WhatsApp queued for: ${maskPhone(formattedTo)}`);
    }
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
        Authorization: `Basic ${auth}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: body.toString(),
    });

    if (!res.ok) {
      const errData = await res.json();
      throw new Error(errData.message || "Failed to send Twilio WhatsApp");
    }
  } catch (error) {
    console.error("WhatsApp sending error:", error instanceof Error ? error.message : "Error");
  }
}

export interface OrderNotificationItem {
  price: number;
  quantity: number;
  product: {
    name: string;
    description?: string;
    images?: string;
    sku?: string | null;
  };
}

export interface OrderNotificationData {
  id: string;
  totalAmount: number;
  discount?: number;
  status?: string;
  razorpayOrderId?: string | null;
  shippingAddress: string;
  user?: {
    name?: string | null;
    email?: string;
    phone?: string | null;
  } | null;
  items?: OrderNotificationItem[];
}

/**
 * Generates email content (HTML and plain text) for order confirmation
 */
export function generateOrderConfirmationEmail(order: OrderNotificationData) {
  const orderIdShort = order.id.slice(-8).toUpperCase();
  const isCod = order.razorpayOrderId?.startsWith("cod_");
  const paymentMethodLabel = isCod ? "Cash on Delivery (COD)" : "Prepaid Online (Razorpay Verified)";
  const customerName = order.user?.name || "Valued Customer";
  const items = order.items || [];

  const itemsSubtotal = items.reduce((acc, it) => acc + it.price * it.quantity, 0);
  const discountAmount = order.discount && order.discount > 0 ? order.discount : 0;
  const codFee = isCod ? 49 : 0;
  const grandTotal = order.totalAmount;

  const subject = `🌿 Order Confirmed! #${orderIdShort} — GoGreen Nursery`;

  // Build items rows for HTML table
  const itemsHtmlRows = items
    .map((item) => {
      const lineTotal = (item.price * item.quantity).toFixed(2);
      return `
        <tr>
          <td style="padding: 12px; border-bottom: 1px solid #e5e7eb; color: #1f2937; font-weight: 500;">
            ${escapeHtml(item.product.name)}
          </td>
          <td style="padding: 12px; border-bottom: 1px solid #e5e7eb; text-align: center; color: #4b5563;">
            ${item.quantity}
          </td>
          <td style="padding: 12px; border-bottom: 1px solid #e5e7eb; text-align: right; color: #4b5563;">
            ₹${item.price.toFixed(2)}
          </td>
          <td style="padding: 12px; border-bottom: 1px solid #e5e7eb; text-align: right; color: #111827; font-weight: 600;">
            ₹${lineTotal}
          </td>
        </tr>
      `;
    })
    .join("");

  // Build items list for plain text
  const itemsTextList = items
    .map(
      (item) =>
        `- ${item.product.name} x ${item.quantity} @ ₹${item.price.toFixed(2)} = ₹${(item.price * item.quantity).toFixed(2)}`
    )
    .join("\n");

  const formattedAddressHtml = escapeHtml(order.shippingAddress || "Not provided").replace(/\n/g, "<br>");

  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Order Confirmation</title>
</head>
<body style="margin: 0; padding: 0; background-color: #f4f6f8; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #2d3748; line-height: 1.6;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f4f6f8; padding: 30px 15px;">
    <tr>
      <td align="center">
        <table width="100%" cellpadding="0" cellspacing="0" style="max-width: 600px; background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.06); border: 1px solid #e5e7eb;">
          
          <!-- Header -->
          <tr>
            <td style="background: linear-gradient(135deg, #1b4332 0%, #2d6a4f 100%); padding: 32px 28px; text-align: center;">
              <span style="font-size: 38px; line-height: 1;">🪴</span>
              <h1 style="color: #ffffff; margin: 8px 0 4px 0; font-size: 24px; font-weight: 700; letter-spacing: -0.5px;">GoGreen Nursery</h1>
              <p style="color: #d8f3dc; margin: 0; font-size: 13px; font-weight: 500;">Bringing Nature Closer to Your Home</p>
            </td>
          </tr>

          <!-- Banner / Greeting -->
          <tr>
            <td style="padding: 28px 28px 20px 28px;">
              <div style="background-color: #ecfdf5; border: 1px solid #a7f3d0; border-radius: 12px; padding: 14px 18px; margin-bottom: 24px;">
                <p style="margin: 0; color: #065f46; font-weight: 700; font-size: 15px;">
                  ✓ Order Placed Successfully!
                </p>
                <p style="margin: 4px 0 0 0; color: #047857; font-size: 13px;">
                  Thank you for your order, ${escapeHtml(customerName)}. We are carefully preparing your healthy plants for dispatch.
                </p>
              </div>

              <!-- Order Meta Grid -->
              <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f9fafb; border-radius: 12px; padding: 14px 18px; margin-bottom: 24px; font-size: 13px;">
                <tr>
                  <td style="padding: 6px 0; color: #6b7280; width: 40%;">Order Number:</td>
                  <td style="padding: 6px 0; color: #111827; font-weight: 700;">#${escapeHtml(orderIdShort)}</td>
                </tr>
                <tr>
                  <td style="padding: 6px 0; color: #6b7280;">Payment Method:</td>
                  <td style="padding: 6px 0; color: #111827; font-weight: 600;">${escapeHtml(paymentMethodLabel)}</td>
                </tr>
                <tr>
                  <td style="padding: 6px 0; color: #6b7280;">Order Status:</td>
                  <td style="padding: 6px 0; color: #047857; font-weight: 700;">${isCod ? "PENDING (Pay On Delivery)" : "PAID (Verified)"}</td>
                </tr>
              </table>

              <!-- Items Table -->
              <h3 style="font-size: 15px; font-weight: 700; color: #111827; margin: 0 0 12px 0;">Order Summary</h3>
              <table width="100%" cellpadding="0" cellspacing="0" style="border-collapse: collapse; font-size: 13px; margin-bottom: 20px;">
                <thead>
                  <tr style="background-color: #f3f4f6; color: #374151;">
                    <th style="padding: 10px 12px; text-align: left; border-bottom: 2px solid #e5e7eb; font-weight: 600;">Item</th>
                    <th style="padding: 10px 12px; text-align: center; border-bottom: 2px solid #e5e7eb; font-weight: 600;">Qty</th>
                    <th style="padding: 10px 12px; text-align: right; border-bottom: 2px solid #e5e7eb; font-weight: 600;">Price</th>
                    <th style="padding: 10px 12px; text-align: right; border-bottom: 2px solid #e5e7eb; font-weight: 600;">Total</th>
                  </tr>
                </thead>
                <tbody>
                  ${itemsHtmlRows || `<tr><td colspan="4" style="padding: 12px; text-align: center; color: #6b7280;">Item details recorded in order</td></tr>`}
                </tbody>
              </table>

              <!-- Price Totals -->
              <table width="100%" cellpadding="0" cellspacing="0" style="font-size: 13px; margin-bottom: 24px;">
                <tr>
                  <td style="padding: 4px 0; color: #6b7280;">Subtotal:</td>
                  <td style="padding: 4px 0; text-align: right; color: #111827; font-weight: 500;">₹${itemsSubtotal.toFixed(2)}</td>
                </tr>
                ${
                  discountAmount > 0
                    ? `<tr>
                        <td style="padding: 4px 0; color: #059669;">Coupon Discount:</td>
                        <td style="padding: 4px 0; text-align: right; color: #059669; font-weight: 600;">-₹${discountAmount.toFixed(2)}</td>
                      </tr>`
                    : ""
                }
                ${
                  isCod
                    ? `<tr>
                        <td style="padding: 4px 0; color: #6b7280;">COD Handling Fee:</td>
                        <td style="padding: 4px 0; text-align: right; color: #111827; font-weight: 500;">₹49.00</td>
                      </tr>`
                    : ""
                }
                <tr>
                  <td style="padding: 4px 0; color: #6b7280;">Shipping:</td>
                  <td style="padding: 4px 0; text-align: right; color: #059669; font-weight: 600;">Free</td>
                </tr>
                <tr style="border-top: 2px solid #e5e7eb;">
                  <td style="padding: 10px 0 0 0; font-size: 16px; font-weight: 700; color: #111827;">Total Amount:</td>
                  <td style="padding: 10px 0 0 0; text-align: right; font-size: 18px; font-weight: 700; color: #1b4332;">₹${grandTotal.toFixed(2)}</td>
                </tr>
              </table>

              <!-- Shipping Address Box -->
              <div style="background-color: #f9fafb; border: 1px solid #e5e7eb; border-radius: 12px; padding: 16px 18px; margin-bottom: 24px;">
                <p style="margin: 0 0 6px 0; font-size: 13px; font-weight: 700; color: #111827;">
                  📍 Delivery Address
                </p>
                <p style="margin: 0; font-size: 13px; color: #4b5563; line-height: 1.5;">
                  ${formattedAddressHtml}
                </p>
              </div>

              <!-- Care Note -->
              <div style="border-left: 3px solid #2d6a4f; padding-left: 12px; margin-bottom: 12px;">
                <p style="margin: 0; font-size: 12px; color: #4b5563;">
                  🌿 <strong>Plant Care Tip:</strong> When your green companions arrive, give them some water and let them rest in indirect sunlight for 24 hours to recover from transit.
                </p>
              </div>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color: #f9fafb; padding: 20px 28px; text-align: center; border-top: 1px solid #e5e7eb;">
              <p style="margin: 0; font-size: 12px; color: #6b7280;">
                Have questions about your order? Reach us at <a href="mailto:gogreen.nursery20@gmail.com" style="color: #2d6a4f; text-decoration: underline;">gogreen.nursery20@gmail.com</a>
              </p>
              <p style="margin: 8px 0 0 0; font-size: 11px; color: #9ca3af;">
                GoGreen Nursery • Kolkata, West Bengal • All Rights Reserved
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `.trim();

  const text = `
🌿 GoGreen Nursery — Order Confirmation #${orderIdShort}

Hello ${customerName},

Thank you for your order! We have received your order and are carefully preparing your plants for dispatch.

--------------------------------------------------
ORDER DETAILS
--------------------------------------------------
Order ID: #${orderIdShort}
Payment Method: ${paymentMethodLabel}
Status: ${isCod ? "PENDING (Pay on delivery)" : "PAID (Verified)"}

ITEMS ORDERED:
${itemsTextList || "Item details recorded in order"}

--------------------------------------------------
Subtotal: ₹${itemsSubtotal.toFixed(2)}
${discountAmount > 0 ? `Coupon Discount: -₹${discountAmount.toFixed(2)}\n` : ""}${isCod ? `COD Fee: ₹49.00\n` : ""}Shipping: Free
TOTAL AMOUNT: ₹${grandTotal.toFixed(2)}
--------------------------------------------------

DELIVERY ADDRESS:
${order.shippingAddress || "Not provided"}

Thank you for bringing green life into your space!
If you have questions, contact us at gogreen.nursery20@gmail.com

Warm regards,
GoGreen Nursery Team
  `.trim();

  return { subject, text, html };
}

/**
 * Generates email content (HTML and plain text) for order status updates
 */
export function generateOrderStatusUpdateEmail(
  order: OrderNotificationData,
  oldStatus: string,
  newStatus: string
) {
  const orderIdShort = order.id.slice(-8).toUpperCase();
  const customerName = order.user?.name || "Valued Customer";
  const grandTotal = order.totalAmount.toFixed(2);
  const items = order.items || [];

  const subject = `📦 Order #${orderIdShort} Status: ${newStatus} — GoGreen Nursery`;

  const statusColorMap: Record<string, { bg: string; text: string; label: string; message: string }> = {
    APPROVED: {
      bg: "#e0e7ff",
      text: "#3730a3",
      label: "Order Approved",
      message: "Your order has been approved by our nursery staff and is being prepared for packaging.",
    },
    PAID: {
      bg: "#ecfdf5",
      text: "#065f46",
      label: "Payment Verified",
      message: "Payment for your order has been successfully verified. We are now processing your shipment.",
    },
    SHIPPED: {
      bg: "#e0f2fe",
      text: "#0369a1",
      label: "Dispatched & On The Way",
      message: "Great news! Your plant package has been shipped and is on its way to your delivery address.",
    },
    DELIVERED: {
      bg: "#ecfdf5",
      text: "#047857",
      label: "Delivered",
      message: "Your order has been delivered! We hope you love your new green companions.",
    },
    CANCELLED: {
      bg: "#fee2e2",
      text: "#991b1b",
      label: "Order Cancelled",
      message: "Your order has been cancelled. If any payment was captured, the refund process has been initiated.",
    },
  };

  const currentStatusInfo = statusColorMap[newStatus.toUpperCase()] || {
    bg: "#f3f4f6",
    text: "#1f2937",
    label: newStatus,
    message: `Your order status has been updated to ${newStatus}.`,
  };

  const itemsListText = items
    .map((item) => `- ${item.product.name} (Qty: ${item.quantity})`)
    .join("\n");

  const itemsListHtml = items
    .map(
      (item) => `
      <li style="margin-bottom: 6px; color: #374151;">
        <strong>${escapeHtml(item.product.name)}</strong> — Qty: ${item.quantity} (₹${(item.price * item.quantity).toFixed(2)})
      </li>
    `
    )
    .join("");

  const formattedAddressHtml = escapeHtml(order.shippingAddress || "Not provided").replace(/\n/g, "<br>");

  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Order Status Update</title>
</head>
<body style="margin: 0; padding: 0; background-color: #f4f6f8; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #2d3748; line-height: 1.6;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f4f6f8; padding: 30px 15px;">
    <tr>
      <td align="center">
        <table width="100%" cellpadding="0" cellspacing="0" style="max-width: 600px; background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.06); border: 1px solid #e5e7eb;">
          
          <!-- Header -->
          <tr>
            <td style="background: linear-gradient(135deg, #1b4332 0%, #2d6a4f 100%); padding: 32px 28px; text-align: center;">
              <span style="font-size: 38px; line-height: 1;">📦</span>
              <h1 style="color: #ffffff; margin: 8px 0 4px 0; font-size: 24px; font-weight: 700; letter-spacing: -0.5px;">GoGreen Nursery</h1>
              <p style="color: #d8f3dc; margin: 0; font-size: 13px; font-weight: 500;">Order Status Notification</p>
            </td>
          </tr>

          <!-- Content -->
          <tr>
            <td style="padding: 28px;">
              
              <!-- Status Badge Banner -->
              <div style="background-color: ${currentStatusInfo.bg}; border-radius: 12px; padding: 18px; text-align: center; margin-bottom: 24px;">
                <p style="margin: 0; font-size: 12px; color: ${currentStatusInfo.text}; text-transform: uppercase; font-weight: 700; letter-spacing: 0.5px;">
                  Status Update
                </p>
                <h2 style="margin: 6px 0 8px 0; color: ${currentStatusInfo.text}; font-size: 22px; font-weight: 800;">
                  ${escapeHtml(currentStatusInfo.label)}
                </h2>
                <p style="margin: 0; font-size: 13px; color: ${currentStatusInfo.text}; line-height: 1.4;">
                  ${escapeHtml(currentStatusInfo.message)}
                </p>
              </div>

              <!-- Transition Badge -->
              <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f9fafb; border-radius: 12px; padding: 14px 18px; margin-bottom: 24px; font-size: 13px;">
                <tr>
                  <td style="padding: 4px 0; color: #6b7280; width: 40%;">Order Number:</td>
                  <td style="padding: 4px 0; color: #111827; font-weight: 700;">#${escapeHtml(orderIdShort)}</td>
                </tr>
                <tr>
                  <td style="padding: 4px 0; color: #6b7280;">Previous Status:</td>
                  <td style="padding: 4px 0; color: #4b5563;">${escapeHtml(oldStatus)}</td>
                </tr>
                <tr>
                  <td style="padding: 4px 0; color: #6b7280;">New Status:</td>
                  <td style="padding: 4px 0; color: #1b4332; font-weight: 700;">${escapeHtml(newStatus)}</td>
                </tr>
                <tr>
                  <td style="padding: 4px 0; color: #6b7280;">Order Total:</td>
                  <td style="padding: 4px 0; color: #111827; font-weight: 700;">₹${escapeHtml(grandTotal)}</td>
                </tr>
              </table>

              ${
                items.length > 0
                  ? `
                <h3 style="font-size: 14px; font-weight: 700; color: #111827; margin: 0 0 10px 0;">Items in this Order</h3>
                <ul style="padding-left: 20px; margin: 0 0 20px 0; font-size: 13px;">
                  ${itemsListHtml}
                </ul>
              `
                  : ""
              }

              <!-- Shipping Address Box -->
              <div style="background-color: #f9fafb; border: 1px solid #e5e7eb; border-radius: 12px; padding: 14px 18px; margin-bottom: 20px;">
                <p style="margin: 0 0 6px 0; font-size: 13px; font-weight: 700; color: #111827;">
                  📍 Delivery Address
                </p>
                <p style="margin: 0; font-size: 13px; color: #4b5563; line-height: 1.5;">
                  ${formattedAddressHtml}
                </p>
              </div>

            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color: #f9fafb; padding: 20px 28px; text-align: center; border-top: 1px solid #e5e7eb;">
              <p style="margin: 0; font-size: 12px; color: #6b7280;">
                Have questions or need assistance? Reply to this email or reach us at <a href="mailto:gogreen.nursery20@gmail.com" style="color: #2d6a4f; text-decoration: underline;">gogreen.nursery20@gmail.com</a>
              </p>
              <p style="margin: 8px 0 0 0; font-size: 11px; color: #9ca3af;">
                GoGreen Nursery • Kolkata, West Bengal • All Rights Reserved
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `.trim();

  const text = `
📦 GoGreen Nursery — Order Status Update: #${orderIdShort}

Hello ${customerName},

Your order #${orderIdShort} has changed status from ${oldStatus} to ${newStatus}.

Status Details:
${currentStatusInfo.label} — ${currentStatusInfo.message}

Order Total: ₹${grandTotal}

${items.length > 0 ? `ITEMS:\n${itemsListText}\n\n` : ""}DELIVERY ADDRESS:
${order.shippingAddress || "Not provided"}

Thank you for choosing GoGreen Nursery!
Contact support: gogreen.nursery20@gmail.com
  `.trim();

  return { subject, text, html };
}

/**
 * Notify User and Admin when a new order is placed (COD or Verified Prepaid)
 * Safe and idempotent: Prevents duplicate dispatches if called multiple times.
 */
export async function notifyOrderPlacement(order: OrderNotificationData): Promise<void> {
  if (!order || !order.id) return;

  // Prevent duplicate confirmation emails for the same order ID
  if (processedConfirmationOrders.has(order.id)) {
    console.log(`[NOTIFICATIONS] Skipping duplicate confirmation email for Order #${order.id.slice(-8)}`);
    return;
  }
  processedConfirmationOrders.add(order.id);

  try {
    const orderIdShort = order.id.slice(-8).toUpperCase();
    const customerEmail = order.user?.email?.trim();
    const isCod = order.razorpayOrderId?.startsWith("cod_");
    const paymentMethodText = isCod ? "Cash on Delivery (COD)" : "Prepaid Online (Verified)";
    const totalFormatted = order.totalAmount.toFixed(2);

    const emailContent = generateOrderConfirmationEmail(order);

    // 1. Send Order Confirmation Email to Customer
    if (customerEmail) {
      await sendEmail(customerEmail, emailContent.subject, emailContent.text, emailContent.html);
    } else {
      console.warn(`[NOTIFICATIONS] No customer email available for Order #${orderIdShort}`);
    }

    // 2. Send Alert Email to Admin
    if (adminEmail) {
      const adminSubject = `🚨 New Order Received #${orderIdShort} [₹${totalFormatted}] via ${paymentMethodText}`;
      const adminText = `
New Order Received!
Order ID: #${orderIdShort}
Customer: ${order.user?.name || "Customer"} (${customerEmail || "No email"})
Amount: ₹${totalFormatted}
Payment Method: ${paymentMethodText}

Shipping Address:
${order.shippingAddress}
      `.trim();

      await sendEmail(adminEmail, adminSubject, adminText, emailContent.html);
    }
  } catch (err) {
    // Fail gracefully without interrupting checkout or payment processing
    console.error("[NOTIFICATIONS] Error in notifyOrderPlacement:", err instanceof Error ? err.message : err);
  }
}

/**
 * Notify User and Admin when an order status is updated
 * Safe and idempotent: Skips identical transitions and duplicate triggers.
 */
export async function notifyOrderStatusUpdate(
  order: OrderNotificationData,
  oldStatus: string,
  newStatus: string
): Promise<void> {
  if (!order || !order.id) return;

  // Skip redundant status updates
  if (oldStatus.trim().toUpperCase() === newStatus.trim().toUpperCase()) {
    return;
  }

  // Idempotency check: don't send duplicate notification for same order + target status
  const updateKey = `${order.id}:${newStatus.trim().toUpperCase()}`;
  if (processedStatusUpdates.has(updateKey)) {
    console.log(`[NOTIFICATIONS] Skipping duplicate status update notification for key: ${updateKey}`);
    return;
  }
  processedStatusUpdates.add(updateKey);

  try {
    const orderIdShort = order.id.slice(-8).toUpperCase();
    const customerEmail = order.user?.email?.trim();
    const totalFormatted = order.totalAmount.toFixed(2);

    const emailContent = generateOrderStatusUpdateEmail(order, oldStatus, newStatus);

    // 1. Send Status Update Email to Customer
    if (customerEmail) {
      await sendEmail(customerEmail, emailContent.subject, emailContent.text, emailContent.html);
    } else {
      console.warn(`[NOTIFICATIONS] No customer email available for status update on Order #${orderIdShort}`);
    }

    // 2. Send Notification Email to Admin
    if (adminEmail) {
      const adminSubject = `🔔 Order #${orderIdShort} Status Updated: ${oldStatus} ➔ ${newStatus}`;
      const adminText = `
Order Status Update:
Order ID: #${orderIdShort}
Customer: ${order.user?.name || "Customer"} (${customerEmail || "No email"})
Status: ${oldStatus} ➔ ${newStatus}
Total: ₹${totalFormatted}
      `.trim();

      await sendEmail(adminEmail, adminSubject, adminText, emailContent.html);
    }
  } catch (err) {
    console.error("[NOTIFICATIONS] Error in notifyOrderStatusUpdate:", err instanceof Error ? err.message : err);
  }
}
