const mongoose = require('mongoose');

const ProfileSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
    },
    favorites: {
        type: String
    },
    social:{
        youtube:{
            type: String
        },
        facebook:{
            type: String
        },
        instagram:{
            type: String
        }
    },
    date: {
        type: Date,
        default: Date.now
    }
});

module.exports = Progile = mongoose.model('profile', ProfileSchema);