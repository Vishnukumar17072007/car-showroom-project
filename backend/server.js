const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const cookieParser = require('cookie-parser');
require('dotenv').config();
const carsRoute = require('./routes/carsRoute');
const cartRoute = require('./routes/cartRoute');
const wishListRoute = require('./routes/wishListRoute');
const orderRoute = require('./routes/orderRoute');

const authRoutes = require('./routes/authRoute');

const app = express();

app.use(cors({
    origin: true,
    credentials: true
}));

app.use(cookieParser());

app.use(express.json());

app.get('/', (req, res) => {
    res.json({ message: 'Server is working!' });
});

app.use('/api/cars', carsRoute);
app.use('/api/auth', authRoutes);
app.use('/api/cart', cartRoute);
app.use('/api/wishlist', wishListRoute);
app.use('/api/order', orderRoute);

const PORT = process.env.PORT;

mongoose.connect(process.env.MONGO_URI)
.then(()=>{
    console.log("MongoDB Connected");
    app.listen(PORT, async () => {
        console.log(`Server running on port ${PORT}`);
    });
})
.catch((err) => {
    console.log("Connection failed");
});