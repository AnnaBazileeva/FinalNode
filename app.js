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
app.use(rateLimiter({windowMs: 15 *60*1000, max:100,}
))
app.use(express.json());
app.use(helmet())
app.use(cors())
app.use(xss())


app.use('/api/auth', authRoutes);
app.use('/api/services', serviceRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/availability', availabilityRoutes);

app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

const PORT = process.env.PORT || 3000;

const start = async () => {
    try {
        await connectDB(process.env.MONGO_URI)
        app.listen(PORT, () =>
            console.log(`Server is listening on port ${PORT}...`)
        );
    } catch (error) {
        console.log(error);
    }
};

start();