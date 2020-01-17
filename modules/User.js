import { mongo } from "mongoose";

const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        requered: true
    },
    emal: {
        type: String,
        requered: true,
        unique: true
    },
    password: {
        type: String,
        requered: true
    },
    date: {
        type: Date,
        default: Date.now
    }
});

modules.exports = User = mongoose.model('user', UserSchema);