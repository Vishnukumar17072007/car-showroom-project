const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const open = require('open');
const fs = require('fs');
require('dotenv').config();
const carsRoute = require('./routes/carsRoute');
const cartRoute = require('./routes/cartRoute');
const wishListRoute = require('./routes/wishListRoute');
const orderRoute = require('./routes/orderRoute');

const authRoutes = require('./routes/authRoute');

const app = express();

app.use(cors({
    origin: ["http://localhost:1200"], // ← exact frontend URL
    credentials: true,                // ← allows cookies to be sent
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],  // ✅ allow DELETE and OPTIONS
    allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(cookieParser());

app.use(express.json());

app.get('/test', (req, res) => {
    res.json({ message: 'Server is working!' });
});

app.use('/api/cars', carsRoute);
app.use('/api/auth', authRoutes);
app.use('/api/cart', cartRoute);
app.use('/api/wishlist', wishListRoute);
app.use('/api/order', orderRoute);

const FLAG_FILE = './.browser_opened';

mongoose.connect(process.env.MONGO_URI)
.then(()=>{
    console.log("MongoDB Connected");
    app.listen(process.env.PORT, async () => {
        console.log(`Server running on port ${process.env.PORT}`);
        if (!fs.existsSync(FLAG_FILE)) {
            fs.writeFileSync(FLAG_FILE, 'opened');
            const { default: open } = await import('open');
            open('http://localhost:1200');
        }
    });
})
.catch((err) => {
    console.log("Connection failed");
});