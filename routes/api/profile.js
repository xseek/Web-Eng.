const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const { check, validationResult } = require('express-validator/check');

const Profile = require('../../models/Profile');
const User = require('../../models/User');

// @Private
//ovo je get req
// curent useri profili

router.get('/me', (req, res) => {
    try {
        const profile = await Profile.findOne({ user: req.user.id }).populate('user', ['name']);
        if(!profile) {
            return req.status(400).json({ msg: 'There is no profile for this user' });
        }

        res.json(profile);
    } catch(err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// post req za api/profile
// create ili update profile

router.post('/', [auth, [
    check('favorites', 'Status is required'),
     
]
], async(req, res) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    const {
        favorites,
        youtube,
        facebook,
        instagram
    } = req.body;

    //objekat profila
    const profileFields = {};
    profileFields.user = req.user.id;
    if (favorites) {
        profileFields.favorites = favorites.split(',').map(favorite => favorite.trim());
    }
    
    //objekat social
    profileFields.social = {}
    if (youtube) profileFields.social.youtube = youtube;
    if (facebook) profileFields.social.facebook = facebook;
    if (instagram) profileFields.social.instagram = instagram;

    try {
        let profile = await Profile.findOne(
            { user: req.user.id });

        if(profile) {
            //update profila
            profile = await Profile.findOneAndUpdate(
                { user: req.user.id },
                 { $set: profileFields},
                  { new: true}
                  );
            return req.json(Profile);
        }
        //ako nema profila onda create

        profile =new Profile(profileFields);
        
        await Profile.save();
        res.json(profile);


    } catch(err) {
        console.err(err.message);
        res.status(500).send('Server Error');
    }
});


// get sve profile api/profile
//public
router.get('/', async (req, res) => {
try{
    const profiles = await Profile.find().populate('user,' ['name']);
    res.json(profile);
} catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
}
});

// get profile po user ideu api/profile/user/:user_id
//public
router.get('/user/:user_id', async (req, res) => {
    try{
        const profile = await Profile.findOne({ user: req.params.user_id }).populate('user,' ['name']);

        if(!profile) return res.status(400).json({ msg: 'This user does not exist'});

        res.json(profile);
    } catch (err) {
        console.error(err.message);
        if(err.kind == 'ObjectId') {
            return res.status(400).json({ msg: 'This user does not exist'});
        }
        res.status(500).send('Server Error');
    }
    });


    // delete api/profile usera
    // private
    router.delete('/', auth, async (req, res) => {
        try{
            //remove profile auth je jer je private

            //remove profile
            await Profile.findOneAndRemove({ user: req.user.id });
            //remove usera
            await User.findOneAndRemove({ _id: req.user.id })

            res.json(msg: 'User deleted');
        } catch (err) {
            console.error(err.message);
            res.status(500).send('Server Error');
        }
        });

    

module.exports = router;
