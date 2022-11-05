const router = require("express").Router();
const User = require('../models/User.model');

module.exports = router;

router.get('/profile', async (req, res, next) =>{
    try {
        res.render('profile/edit-profile')
    } catch (error) {
        console.log(error);
    }
})

