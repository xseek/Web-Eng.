const mongoose = require('mongoose');
const config = require ('config');
const db = config.get('mongoURI');

const connedtDB = async () => {
    try {
        await mongoose.connect(db, {
            useNewUrlParser: true,
            useCreateIndex: true,
            useFindAndModify: false
        });

        console.log('MongoDB Connected...');
    }catch(err){
        console.error(err.message);
        //Exit proces with faliure
        process.exit(1);
    }
}

module.exports = connedtDB;