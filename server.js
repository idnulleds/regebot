const { Client, LocalAuth, MessageMedia } = require('whatsapp-web.js');
const express = require('express');
const qrcode = require('qrcode');
const socketIO = require('socket.io');
const http = require('http');
const dotenv = require('dotenv');

// TODO: initialize server using express
dotenv.config()
const PORT = process.env.PORT || 4564;
const app = express();
const server = http.createServer(app);
const io = socketIO(server);
const client = new Client({
    authStrategy: new LocalAuth({
        clientId: "client-one"
    }),
    restartOnAuthFail: true,
    puppeteer: {
        headless: true,
        args: [
            '--no-sandbox',
            '--disable-setuid-sandbox',
            '--disable-dev-shm-usage',
            '--disable-accelerated-2d-canvas',
            '--no-first-run',
            '--no-zygote',
            '--single-process',
            '--disable-gpu'
        ],
    },
});

// TODO: index routing and middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.get('/', (req, res) => {
    res.sendFile('index.html', { root: __dirname });
});

// TODO: initialize whatsapp and the example event
client.initialize();

// TODO: socket connection
let today = new Date();
let now = today.toLocaleString();
io.on('connection', (socket) => {
    socket.emit('message', `${now} Connected`);

    client.on('qr', (qr) => {
        qrcode.toDataURL(qr, (err, url) => {
            socket.emit("qr", url);
            socket.emit('message', `${now} QR Code received`);
        });
    });

    client.on('ready', () => {
        socket.emit('message', `${now} WhatsApp is ready!`);
    });

    client.on('authenticated', () => {
        socket.emit('message', `${now} WhatsApp is authenticated!`);
    });

    client.on('auth_failure', function (session) {
        socket.emit('message', `${now} Auth failure, restarting...`);
    });

    client.on('disconnected', function () {
        socket.emit('message', `${now} Disconnected`);
    });
});

// TODO: send message routing
app.post('/send-message', (req, res) => {
    const phone = req.body.phone;
    const message = req.body.message;

    client.sendMessage(phone, message)
        .then(response => {
            res.status(200).json({
                error: false,
                data: {
                    message: 'Message Sending',
                    meta: response,
                },
            });
            io.emit('message', `${now} Send alert ${message} to ${phone}`);
        })
        .catch(error => {
            res.status(404).json({
                error: true,
                data: {
                    message: 'Error send message',
                    meta: error,
                },
            });
            io.emit('message', `${now} Error sending message to ${phone} with error ${error}`);
        });
});

// TODO: send message with attacment from local file
app.post('/send-attacment', (req, res) => {
    const phone = req.body.phone;
    const message = req.body.message;
    const doc = MessageMedia.fromFilePath('./document/CV and Portofolio_Romi Julianto_Data Analyst.pdf');
    console.log(doc)
    client.sendMessage(phone, doc, { caption: message })
        .then(response => {
            res.status(200).json({
                error: false,
                data: {
                    message: 'Sending message and attactment',
                    meta: response,
                },
            });
            io.emit('message', `${now} Send alert ${message} to ${phone}`);
        })
        .catch(error => {
            res.status(404).json({
                error: true,
                data: {
                    message: 'Error send message',
                    meta: error,
                },
            });
            io.emit('message', `${now} Error sending message to ${phone} with error ${error}`);
        });
});

app.post('/send-attacment-url', async (req, res) => {
    const phone = req.body.phone;
    const message = req.body.message;
    const url = req.body.url;
    const doc = await MessageMedia.fromUrl(url);
    console.log(doc)

    client.sendMessage(phone, doc, { caption: message })
        .then(response => {
            res.status(200).json({
                error: false,
                data: {
                    message: 'Sending message and attactment',
                    meta: response,
                },
            });
            io.emit('message', `${now} Send alert ${message} to ${phone}`);
        })
        .catch(error => {
            res.status(404).json({
                error: true,
                data: {
                    message: 'Error send message',
                    meta: error,
                },
            });
            io.emit('message', `${now} Error sending message to ${phone} with error ${error}`);
        });
});

server.listen(PORT, () => {
    console.log('Server WhatsaApp Pertamina listen', `http://localhost:${PORT}`);
});