const express = require('express');
const connectDB = require('./config/db');

const app = express();

//konektovanje na bazu
connectDB();

//midleware
app.use(express.json({ extended: false}));

app.get('/', (req, res) => res.send('API Running'));


//rutteeee
app.use('/api/users', require('./routes/api/users'));
app.use('/api/users', require('./routes/api/auth'));
app.use('/api/users', require('./routes/api/profile'));
app.use('/api/users', require('./routes/api/posts'));


const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log('Server starter on port ${PORT}'));
