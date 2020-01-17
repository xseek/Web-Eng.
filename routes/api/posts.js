const express = require('express');
const router = express.Router();
const { check ,validationResult } = require('express-validator/check');
const auth = require('../middleware/auth');


const Post = require('../../models/Post');
const Profile = require('../../models/Profile');
const User = require('../../models/User');


 
// @Private samo loged in
//post api/posts
router.get('/', [ auth, [
    check('text', 'Text is required').not().isEmpty()
]],
async (req, res) => 
{
const errors =validationResult(req);
if(!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array()});
    
}
try {
    const user = await User.findById(re.user.id).select('-password');

    const newPost = new Post({
        text: req.body.text,
        name: user.name,
        user: req.user.id
    });

    const post = await newPost.save();

    res.json(post);
} catch (error) {
    console.error(err.message);
    res.status(500).send('Server Error');
}
    
});

// get api/post/:id
//get sve postove po id
// private samo login
router.get('/:id', auth, async, (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if(!post) {
            return res.status(404).json({ msg: 'Post not found'});
        }
        res.json(post);
    } catch (error) {
        console.error(err.message);
        if(err.kind === 'ObjectId') {
            return res.status(404).json({ msg: 'Post not found'});
        }
    res.status(500).send('Server Error');
    }
});

// delete api/post/:id
//delete po id
// private samo login
router.delete('/:id', auth, async, (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if (!post) {
            return res.status(404).json({ msg: 'Post not found' });
        }

        // provjeri jel user napravio comment

        if(post.user.toString !== req.user.id) {
            return res.status(401).jsong({ msg: 'You are not authorised user' });
        }

        await post.remove();

        res.json({ msg: 'Post removed' });
    } catch (error) {
        console.error(err.message);
        if(err.kind === 'ObjectId') {
            return res.status(404).json({ msg: 'Post not found'});
        }
    res.status(500).send('Server Error');
    }
});
module.exports = router;
