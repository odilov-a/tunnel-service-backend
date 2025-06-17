# 🛠️ MyTunnel Backend

**MyTunnel Backend** — bu WebSocket asosidagi tunneling server bo‘lib, foydalanuvchilarga oʻz lokal portlarini subdomain orqali public URL sifatida ochish imkonini beradi.

## 📆 Texnologiyalar

- Node.js
- Express.js
- WebSocket (`ws`)
- JWT (foydalanuvchini autentifikatsiyalash uchun)
- MongoDB (subdomainlar va foydalanuvchilarni saqlash uchun)

## 🚀 Boshlash

```bash
git clone https://github.com/odilov-a/tunnel-service-backend.git
cd tunnel-service-backend
npm install
```

### ⚙️ `.env` fayli namunasi

```
PORT=7000
MONGO_URI=mongodb://localhost:27017/mytunnel
JWT_SECRET=your_jwt_secret_key
```

### 🏁 Serverni ishga tushurish

```bash
npm start
```

## 📡 WebSocket ishlash tartibi

1. Foydalanuvchi WebSocket orqali ulanadi:\
   `ws://localhost:7000`

2. Ulanishdan so‘ng, mijoz `register` tipidagi xabar yuboradi:

```json
{
  "type": "register",
  "subdomain": "mycli",
  "token": "eyJhbGciOiJIUzI1NiIs..."
}
```

3. Backend tokenni tekshiradi va subdomainni ro‘yxatdan o‘tkazadi.

4. Endi `http://localhost:7000/api/tunnels/mycli/*` so‘rovlar mijozning lokal portiga forward qilinadi.

## 🔧 Middleware: `authenticate`

Har bir WebSocket orqali kelgan token JWT sifatida tekshiriladi:

```js
{
  id: "...",
  role: "user",
  username: "...",
  iat: ...,
  exp: ...
}
```

Agar token noto‘g‘ri bo‘lsa yoki roli mavjud bo‘lmasa — ulanish rad etiladi.

## 📁 Loyihaning asosiy tuzilmasi

```
mytunnel-backend/
│
├── server.js          # WebSocket server
├── src/               # HTTP route'lar
│   └── tunnels.js     # Subdomain router
├── middleware/        # Autentikatsiya va boshqa middlewarelar
├── utils/             # JWT va umumiy util funksiyalar
├── models/            # Mongoose modellari
├── .env               # Muhit o'zgaruvchilari
└── package.json
```

## 🔄 HTTP API endpointlar

| Endpoint                       | Tavsif                            |
| ------------------------------ | --------------------------------- |
| `POST /api/users/register`     | Ro‘yxatdan o‘tish                 |
| `POST /api/users/login`        | Tizimga kirish va token olish     |
| `GET /api/tunnels/:subdomain`  | Subdomain mavjudligini tekshirish |

## ❗️ Xatoliklar

- `401 Unauthorized` – Token mavjud emas yoki yaroqsiz
- `403 Forbidden` – Ruxsat yo‘q
- `409 Conflict` – Subdomain allaqachon band

## 📄 Litsenziya

MIT

