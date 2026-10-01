export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") return res.status(204).end();
  if (req.method !== "POST") {
    return res.status(405).json({ ok: false, error: "Method not allowed" });
  }

  try {
    const { phone, message } = req.body || {};

    if (!phone || !message) {
      return res.status(400).json({
        ok: false,
        error: "phone dan message wajib diisi"
      });
    }

    const normalizedPhone = String(phone).replace(/[^\d]/g, "");
    if (!/^62\d{8,15}$/.test(normalizedPhone)) {
      return res.status(400).json({
        ok: false,
        error: "Nomor harus format internasional, contoh 628123456789"
      });
    }

    if (String(message).length > 4096) {
      return res.status(400).json({
        ok: false,
        error: "Pesan terlalu panjang (maksimal 4096 karakter)"
      });
    }

    const phoneNumberId = process.env.WHATSAPP_PHONE_NUMBER_ID;
    const accessToken = process.env.WHATSAPP_ACCESS_TOKEN;
    const apiVersion = process.env.WHATSAPP_API_VERSION || "v23.0";

    if (!phoneNumberId || !accessToken) {
      return res.status(500).json({
        ok: false,
        error: "Environment Variables WhatsApp belum dikonfigurasi di Vercel"
      });
    }

    const response = await fetch(
      `https://graph.facebook.com/${apiVersion}/${phoneNumberId}/messages`,
      {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${accessToken}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          messaging_product: "whatsapp",
          recipient_type: "individual",
          to: normalizedPhone,
          type: "text",
          text: {
            preview_url: false,
            body: String(message)
          }
        })
      }
    );

    const data = await response.json();

    if (!response.ok) {
      return res.status(response.status).json({
        ok: false,
        error: data?.error?.message || "WhatsApp API menolak permintaan",
        details: data?.error?.code || null
      });
    }

    return res.status(200).json({
      ok: true,
      message_id: data?.messages?.[0]?.id || null
    });
  } catch (error) {
    return res.status(500).json({
      ok: false,
      error: "Server error",
      details: error instanceof Error ? error.message : String(error)
    });
  }
}
