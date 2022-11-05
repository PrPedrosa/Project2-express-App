const router = require("express").Router();
const User = require('../models/User.model');
const isLoggedOut = require("../middleware/isLoggedOut");
const isLoggedIn = require("../middleware/isLoggedIn");

router.get('/profile', isLoggedIn, async (req, res, next) =>{
    try {
        
        const currentUser = req.session.currentUser
        console.log(currentUser)
        res.render('profile/edit-profile', currentUser)
    } catch (error) {
        console.log(error);
        next(error)
    }
})

module.exports = router;


