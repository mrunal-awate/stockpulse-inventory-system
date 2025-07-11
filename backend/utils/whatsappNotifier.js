const twilio = require("twilio");

const accountSid = "AC4cb39edce5638aa37adcee4cf9b20595";
const authToken = "9fed8b3f78aa3999bc3651e143f0a9c5";
const client = twilio(accountSid, authToken);

const TO_NUMBER = "whatsapp:+918591061115"; // Your verified WhatsApp number

const sendWhatsAppAlert = async (productName, quantity, forecast) => {
  const message = `🚨 *Stock Alert for ${productName}*:\nOnly ${quantity} left in stock.\nForecast (next 7 days): ${forecast}\n📦 Restock suggested.`;

  try {
    await client.messages.create({
      from: "whatsapp:+14155238886", // Twilio sandbox WhatsApp number
      to: TO_NUMBER,
      body: message,
    });
    console.log("✅ WhatsApp message sent");
  } catch (err) {
    console.error("❌ Error sending WhatsApp message:", err.message);
  }
};

module.exports = sendWhatsAppAlert;
