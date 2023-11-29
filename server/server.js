require('dotenv').config()
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');
const router = require('./router/index');
const path = require('path');
const errorMiddleware = require('./middlewares/error-middleware');

const app = express();
const PORT = process.env.PORT || 5000;

// Налаштовуємо статичну директорію для обслуговування статичних файлів
app.use('/assets', express.static(__dirname + '/../client/assets'));

// Обробляємо запити до кореневого URL
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'client', 'index.html'));
});

app.use(express.json());
app.use(cookieParser());
app.use(cors({
    credentials: true,
    origin: process.env.CLIENT_URL
}));
app.use('/api', router);
app.use(errorMiddleware);


// Запускаємо сервер

const start = async () => {
    try {
        await mongoose.connect(process.env.DB_URL)
        app.listen(PORT, () => console.log(`Сервер працює на порту ${PORT}`))
    } catch (e) {
        console.log(e);
    }
}

start();
