require("dotenv").config();
const TelegramBot = require("node-telegram-bot-api");
const axios = require("axios");

const bot = new TelegramBot(process.env.BOT_TOKEN, { polling: true });
const API_BASE_URL = process.env.API_BASE_URL;
const API_KEY = process.env.API_KEY;

bot.onText(/\/start/, (msg) => {
  bot.sendMessage(
    msg.chat.id,
    "Assalomu alaykum! Ism yoki telefon raqamini yuboring, men laboratoriya natijasini topib beraman."
  );
});

bot.on("message", async (msg) => {
  if (msg.text && msg.text.startsWith("/")) return;

  const chatId = msg.chat.id;
  const text = (msg.text || "").trim();

  if (!text) return;

  const isPhone = /^[+\d][\d\s\-()]+$/.test(text);
  const body = isPhone ? { phone_number: text } : { first_name: text };

  const waitMsg = await bot.sendMessage(chatId, "⏳ Qidirilmoqda...");
  await axios.post(
    `${API_BASE_URL}/documents/pdf`,
    body,
    {
      headers: {
        "Content-Type": "application/json",
        "x-api-key": API_KEY,
      },
      responseType: "arraybuffer",
    }
  )
  .then(async (response) => {
    try {
      const buffer = Buffer.from(response.data);
      const contentType = response.headers["content-type"] || "application/octet-stream";
      const extMap = {
        "application/pdf": "hujjat.pdf",
        "image/jpeg": "hujjat.jpg",
        "image/png": "hujjat.png",
        "image/gif": "hujjat.gif",
        "application/msword": "hujjat.doc",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document": "hujjat.docx",
      };
      const filename = extMap[contentType.split(";")[0].trim()] || "hujjat";
      await bot.sendDocument(
        chatId,
        buffer,
        {},
        { filename, contentType }
      );
    } catch (error) {
      await bot.sendMessage(chatId, "❌ Xatolik yuz berdi. Qayta urinib ko'ring.");
    }
  })
  .catch(async (err) => {
    let errorMessage = "❌ Xatolik yuz berdi. Qayta urinib ko'ring.";
    if (err.response?.data) {
      try {
        const json = JSON.parse(Buffer.from(err.response.data).toString("utf-8"));
        if (json.message) {
          errorMessage = "❌ " + json.message;
        }
      } catch (_) {}
    }
    await bot.sendMessage(chatId, errorMessage);
  })
  .finally(() => {
    bot.deleteMessage(chatId, waitMsg.message_id).catch(() => {});
  })
});

console.log("Bot ishga tushdi...");
