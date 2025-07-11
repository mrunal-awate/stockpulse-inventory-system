const twilio = require("twilio");

const accountSid = "process.env.TWILIO_ACCOUNT_SID";
const authToken = "process.env.TWILIO_ACCOUNT_SID";
const client = twilio(accountSid, authToken);

const TO_NUMBER = "whatsapp:+9100000000"; // Your verified WhatsApp number

const sendWhatsAppAlert = async (productName, quantity, forecast) => {
  const message = `🚨 *Stock Alert for ${productName}*:\nOnly ${quantity} left in stock.\nForecast (next 7 days): ${forecast}\n📦 Restock suggested.`;

  try {
    await client.messages.create({
      from: "whatsapp:+1000000000", // Twilio sandbox WhatsApp number
      to: TO_NUMBER,
      body: message,
    });
    console.log("✅ WhatsApp message sent");
  } catch (err) {
    console.error("❌ Error sending WhatsApp message:", err.message);
  }
};

module.exports = sendWhatsAppAlert;
