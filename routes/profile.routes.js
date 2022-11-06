const router = require("express").Router();
const User = require('../models/User.model');
const isLoggedOut = require("../middleware/isLoggedOut");
const isLoggedIn = require("../middleware/isLoggedIn");
const Game = require("../models/Game.model");

//go to user Profile

router.get('/profile', isLoggedIn, async (req, res, next) =>{
    try {
        
        const currentUserId = req.session.currentUser._id;
        /* currentUser.populate('favoriteGames'); */
        const currentUser = await User.findById(currentUserId).populate('favoriteGames');
       /*  console.log(currentUser) */
       /*  const userGames = currentUser.favoriteGames; */
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

router.post("/deleteFavGame/:id", async (req, res, next) => {

    const gameId = req.params.id;
    const userId = req.session.currentUser._id

    try {
        /* const gameToRemove = await Game.findById(gameId) */

        await User.findByIdAndUpdate(userId, {$pull: {favoriteGames: gameId}});
        res.redirect("/profile")
    } catch (error) {
        console.log(error)
        next(error)
    }
})

module.exports = router;


