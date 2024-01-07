# WhatsApp API
### Send Messages Automatic using API

```
npm install
```

```
npm start
```

### How to use this API
1. Open server in http://localhost:4564
2. Scan QR Code using WhatsApp Scanner
3. Use API Client to make request POST in : http://localhost:4564/send
4. Make the body request:
```
// TODO: body for send message
{
    "phone": "628123456@c.us",
    "message": "Your custom message"
}
```

```
// TODO: body for send message with attacment
{
    "phone": "628123456@c.us",
    "message": "Your custom message".
    "url": "https://path_to_file.[filetype]"
}
```