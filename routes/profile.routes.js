const router = require("express").Router();
const User = require('../models/User.model');
const isLoggedOut = require("../middleware/isLoggedOut");
const isLoggedIn = require("../middleware/isLoggedIn");

//go to user Profile

router.get('/profile', isLoggedIn, async (req, res, next) =>{
    try {
        
        const currentUserId = req.session.currentUser._id;
        /* currentUser.populate('favoriteGames'); */
        const currentUser = await User.findById(currentUserId).populate('favoriteGames');
        console.log(currentUser)
        res.render('profile/profile', currentUser)
    } catch (error) {
        console.log(error);
        next(error)
    }
})

// delete User

router.post("/profile/delete/:id", async (req, res, next) =>{
    const {id} = req.params
    try {
        await User.findByIdAndRemove(id);
        res.redirect("/");
    } catch (error) {
        console.log(error);
        next(error)
    }
})



module.exports = router;


