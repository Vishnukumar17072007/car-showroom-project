require('dotenv').config();
const { validateEnv } = require('./config/env');
validateEnv();

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');

const carsRoute = require('./routes/carsRoute');
const cartRoute = require('./routes/cartRoute');
const wishListRoute = require('./routes/wishListRoute');
const orderRoute = require('./routes/orderRoute');
const authRoutes = require('./routes/authRoute');
const errorHandler = require('./middleware/errorHandler');

const app = express();
const isProd = process.env.NODE_ENV === 'production';

if (isProd) {
    app.set('trust proxy', 1);
}

app.use(helmet());
app.use(express.json({ limit: '100kb' }));
app.use(cookieParser());

const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 30,
    standardHeaders: true,
    legacyHeaders: false,
    message: { message: 'Too many attempts. Please try again later.' },
});

function getAllowedOrigins() {
    const defaults = [
        'http://localhost:5173',
        'https://car-showroom-project-d4e5.vercel.app',
        'https://carfield.vercel.app',
    ];
    const fromEnv = (process.env.CLIENT_URL || '')
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean);
    return [...new Set([...defaults, ...fromEnv])];
}

const allowedOrigins = getAllowedOrigins();
const vercelPreview = /^https:\/\/car-showroom-project-d4e5.*\.vercel\.app$/;

app.use(cors({
    origin(origin, callback) {
        // No origin = same-origin or server-to-server tools — allow
        if (!origin) {
            return callback(null, true);
        }
        if (allowedOrigins.includes(origin) || vercelPreview.test(origin)) {
            return callback(null, true);
        }
        // Deny without throwing (callback(null, false))
        return callback(null, false);
    },
    credentials: true,
}));

app.get('/health', (req, res) => {
    const dbOk = mongoose.connection.readyState === 1;
    res.status(dbOk ? 200 : 503).json({ ok: dbOk });
});

app.get('/test', (req, res) => {
    res.json({ message: 'Server is working!' });
});

app.use('/api/auth/login', authLimiter);
app.use('/api/auth/register', authLimiter);
app.use('/api/cars', carsRoute);
app.use('/api/auth', authRoutes);
app.use('/api/cart', cartRoute);
app.use('/api/wishlist', wishListRoute);
app.use('/api/order', orderRoute);

app.use(errorHandler);

const PORT = process.env.PORT;

mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        console.log('MongoDB Connected');
        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });
    })
    .catch((err) => {
        console.error('MongoDB connection failed:', err.message);
        process.exit(1);
    });

mongoose.connection.on('disconnected', () => {
    console.error('MongoDB disconnected');
});

process.on('SIGTERM', async () => {
    await mongoose.connection.close();
    process.exit(0);
});
