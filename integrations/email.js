// integrations/email.js
const { ImapFlow } = require("imapflow");
const { simpleParser } = require("mailparser");
const admin = require("firebase-admin");
const db = admin.firestore();

/**
 * Shopier sipariş maillerini okur ve Firestore'a yazar
 * config:
 *  {
 *    host: "imap.gmail.com",
 *    port: 993,
 *    secure: true,
 *    user: "mailadresin",
 *    password: "mailSifrenVeyaAppPassword"
 *  }
 */
async function checkShopierEmails(config) {
  const client = new ImapFlow({
    host: config.host,
    port: config.port,
    secure: config.secure,
    auth: {
      user: config.user,
      pass: config.password
    }
  });

  try {
    console.log("📧 IMAP bağlantısı kuruluyor...");
    await client.connect();

    // INBOX klasörünü aç
    let lock = await client.getMailboxLock("INBOX");
    try {
      // Son 50 mail içinde, Shopier geçen mailleri ara
      let searchCriteria = [
        ["FROM", "shopier"], // gönderen
      ];

      for await (let message of client.fetch(await client.search(searchCriteria), { source: true })) {
        const parsed = await simpleParser(message.source);
        console.log("📩 Shopier mail bulundu:", parsed.subject);

        // Basit örnek parse (sonra daha detaylı hale getiririz)
        const rawText = parsed.text || "";
        
        // Sipariş numarasını metinden basit regex ile çekmeye çalış
        const orderMatch = rawText.match(/Sipari[sş] Numara[sıi]:?\s*(\d+)/i);
        const invoiceId = orderMatch ? orderMatch[1] : null;

        // Firestore'a kaydet
        await db.collection("shopier_orders").add({
          subject: parsed.subject,
          from: parsed.from?.text || null,
          to: parsed.to?.text || null,
          invoice_id: invoiceId,
          raw_text: rawText,
          createdAt: new Date()
        });

        console.log("✅ Sipariş maili Firestore'a kaydedildi:", invoiceId);
      }
    } finally {
      lock.release();
    }

    await client.logout();
    console.log("📧 IMAP bağlantısı kapatıldı.");

  } catch (err) {
    console.error("IMAP / Shopier email error:", err);
    throw err;
  }
}

module.exports = { checkShopierEmails };
