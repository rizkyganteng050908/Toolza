# Toolza — WhatsApp Official Test Sender (Vercel)

Backend ini memakai WhatsApp Cloud API resmi dan hanya mengirim satu pesan per request.

## Environment Variables di Vercel

Tambahkan:

- `WHATSAPP_PHONE_NUMBER_ID` = Phone Number ID dari Meta
- `WHATSAPP_ACCESS_TOKEN` = Access Token rahasia
- `WHATSAPP_API_VERSION` = opsional, misalnya `v23.0`

Jangan menaruh access token di HTML/JavaScript frontend.

## Endpoint

POST `/api/whatsapp-send`

JSON:
```json
{
  "phone": "628123456789",
  "message": "Tes dari Toolza"
}
```

## Deploy

1. Upload folder ini ke repository GitHub.
2. Import repository tersebut ke Vercel.
3. Tambahkan Environment Variables di Vercel.
4. Deploy.
5. Frontend Toolza harus memanggil:
   `/api/whatsapp-send`

Catatan:
- Gunakan untuk nomor dan penerima yang memang berwenang kamu uji.
- WhatsApp/Meta dapat menerapkan aturan template, opt-in, jendela layanan, rate limits, dan pembatasan akun.
