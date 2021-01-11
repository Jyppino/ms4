/*jshint esversion: 6 */
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    goodreadsId: {type: String, unique: true, required: true},
    name: {type: String, required: true},
    token: {type: String, required: true},
    token_secret: {type: String, required: true}
});

const User = mongoose.model('user', userSchema);

module.exports = User;
