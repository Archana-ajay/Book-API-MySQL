const express = require('express');
const app = express();
require('express-async-errors');
const db = require('./models');

const authRouter = require('./routes/authRoute');

const notFoundMiddleware = require('./middleware/not-found');
const errorHandlerMiddleware = require('./middleware/error-handler');

app.use(express.json());

// routes
app.use('/api/v1/', authRouter);

//middleware
app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

db.sequelize
    .sync()
    .then(() => {
        // eslint-disable-next-line no-console
        console.log('Synced db.');
    })
    .catch((err) => {
        // eslint-disable-next-line no-console
        console.log('Failed to sync db: ' + err.message);
    });
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    // eslint-disable-next-line no-console
    console.log(`Server is running on port ${PORT}.`);
});
