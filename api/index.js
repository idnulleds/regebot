const { Client } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');

module.exports = (req, res) => {
  // Inisialisasi client WhatsApp Web
  const client = new Client();

  client.on('qr', (qr) => {
    // Menampilkan QR Code di response dalam format teks
    qrcode.generate(qr, { small: true });
    res.send(`
      <html>
        <body>
          <h1>Scan QR Code untuk menghubungkan WhatsApp Web</h1>
          <pre>${qr}</pre>
        </body>
      </html>
    `);
  });

  client.on('ready', () => {
    console.log('WhatsApp Web is ready!');
  });

  client.on('message', (msg) => {
    console.log('Message received:', msg.body);
  });

  client.initialize();
};
