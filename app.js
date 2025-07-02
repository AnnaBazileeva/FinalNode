const express = require('express');
const cors = require('cors');
require('dotenv').config();
require('express-async-errors');

const connectDB = require('./db/connect');


const helmet = require('helmet')
const xss = require('xss-clean')
const rateLimiter = require('express-rate-limit')
const app = express();

const authRoutes = require('./routes/auth');
const serviceRoutes = require('./routes/services');
const bookingRoutes = require('./routes/booking');
const availabilityRoutes = require('./routes/availability');

const notFoundMiddleware = require('./middleware/not-found');
const errorHandlerMiddleware = require('./middleware/error-handler');

app.set('trust proxy', 1);
app.use(rateLimiter({ windowMs: 15 * 60 * 1000, max: 100 }));
app.use(cors({
    origin: 'http://localhost:5174',
    credentials: true
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(helmet())

app.use(xss())

app.use((req, res, next) => {
    if (req.path == "/multiply") {
        res.set("Content-Type", "application/json");
    } else {
        res.set("Content-Type", "text/html");
    }
    next();
});

app.use('/api/auth', authRoutes);
app.use('/api/services', serviceRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/availability', availabilityRoutes);

const path = require('path');

app.use(express.static(path.join(__dirname, 'dist')));

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});



app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

module.exports = app;
