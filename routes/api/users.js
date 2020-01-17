const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('config');
const { chect, validationResult } = require('express-validator/check');



const User = require('../../modules/User');

// @PUBLIC
router.post('/', [
    check('name', 'Name is required')
        .not()
        .isEmpty(),
    check('email', 'Please include a valid email').isEmail(),
    check('password', 'Please enter a password').isLength({ min: 6 })

],
async (req, res) => {

    const errors = validationResult(req);
    if(!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });    
    }
    
        // dali postoji user
    const{ name, email, password } = req.body;

    try {
            // dali postoji user
        let user = await User.findOne({ email });

        if(user) {
           return res.status(400).json({ errors: [{ msg: 'User alredy exists' }]  });
        }

        user = new User({
            name,
            email,
            password
        });
            // enkripcija pw sa bcrypt

        const salt = await bcrypt.genSalt(10);

        user.password = await bcrypt.hash(password, salt);

        await user.save();

            // return jsonwebtoken

       const payload = {
           user: {
               id: user.id
           }
       }

        jwt.sign(payload, config.get('jwtSecret'),
        { expiresIn: 3600},
        (err, token) => {
            if(err) throw err;
            res.json({ token });
        }
        );

    } catch(err) {
        console.error(err.message);
        res.status(500).send('Server error'); 
    }
         
});

module.exports = router;

