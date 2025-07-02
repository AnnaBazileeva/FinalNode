const app = require('./app');
const connectDB = require('./db/connect');

const PORT = process.env.PORT || 3000;

let mongoURL = process.env.MONGO_URI;
if (process.env.NODE_ENV === "test") {
    mongoURL = process.env.MONGO_URI_TEST;
}

const start = async () => {
    try {
        await connectDB(mongoURL);
        app.listen(PORT, () =>
            console.log(`Server is listening on port ${PORT}...`)
        );
    } catch (error) {
        console.error(error);
    }
};

start();
