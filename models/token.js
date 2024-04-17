// token.js
const mongoose = require('mongoose');

const tokenSchema = new mongoose.Schema({
    token: { type: String, required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    createdAt: { type: Date, default: Date.now, expires: '1h' }
});

const Token = mongoose.model('Token', tokenSchema);

module.exports = Token;
