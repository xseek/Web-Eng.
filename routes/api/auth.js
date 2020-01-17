const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const auth = require("../../middleware/auth");
const jwt = require('jsonwebtoken');
const config = require('config');
const { chect, validationResult } = require('express-validator/check');

const User = require("../../models/User");

// @PUBLIC
router.get('/',auth, async(req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        res.json(user);
    } catch(err){
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});


// @PUBLIC
router.post('/', 
[
    check('name', 'Name is required')
        .not()
        .isEmpty(),
    check('email', 'Please include a valid email').isEmail(),
    check('password', 'Password is required').exists()
],
),
async (req, res) => {

    const errors = validationResult(req);
    if(!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });    
    }
    
        // auth user
    const{ email, password } = req.body;

    try {
            // auth user
        let user = await User.findOne({ email });
                //AKO NEMA USERA !:!:!
        if(!user) {
           return res.status(400).json({ errors: [{ msg: 'INVALID CREDENTIALS!' }]  });
        }

        //copara password u plain textu sa spasenim encrypt pw
        const isMatch = await bcrypt.compare(password, user.password);
        if(!isMatch) {
            return res.status(400).json({ errors: [{ msg: 'INVALID CREDENTIALS!' }]  });
        }

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
         
};

module.exports = router;
