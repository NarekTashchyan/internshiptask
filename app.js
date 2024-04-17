const express = require('express');
const mongoose = require('mongoose');
const { validate, ValidationError, Joi } = require('express-validation');
const authRoutes = require('./routes/authRoutes');
const postRoutes = require('./routes/postRoutes');
const app = express();
const PORT = process.env.PORT || 3000;
const DATABASE_URL = "mongodb://localhost:27017/internship";
const swaggerUi = require('swagger-ui-express');
const YAML = require('yamljs');
const swaggerDocument = YAML.load('./swagger.yaml');

app.use(express.json());
app.use('/auth', authRoutes);
app.use('/post', postRoutes);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.use(function (err, req, res, next) {
    if (err instanceof ValidationError) {
        return res.status(err.statusCode).json(err)
    }
    console.log(err)
    return res.status(500).json({})
})

const mongoDB = async () => {
    try {
        const conn = await mongoose.connect(`${DATABASE_URL}`);
        console.log(`MongoDB connected: ${conn.connection.host}:${conn.connection.port}`);
        return conn;
    } catch (error) {
        console.log(error);
        process.exit(1);
    }
};
mongoDB();

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
