const router = require("express").Router();
const User = require('../models/User.model');
/* const isLoggedOut = require("../middleware/isLoggedOut"); */
const isLoggedIn = require("../middleware/isLoggedIn");
const Game = require("../models/Game.model");
const fileUploader = require('../config/cloudinary.config');
const session = require("express-session");

//go to user Profile

router.get('/profile', isLoggedIn, async (req, res, next) =>{
    try {
        const {session} = req
        const currentUserId = req.session.currentUser._id;
        /* currentUser.populate('favoriteGames'); */
        const currentUser = await User.findById(currentUserId).populate('favoriteGames');
        res.render('profile/profile', {currentUser, session})
    } catch (error) {
        console.log(error);
        next(error)
    }
})

// delete User

router.post("/profile/delete/:id", async (req, res, next) =>{
    const {id} = req.params
    try {
        req.session.destroy();
        await User.findByIdAndRemove(id);
        res.redirect("/");
    } catch (error) {
        console.log(error);
        next(error)
    }
})

//delete game just from favs or from favs and database too

router.post("/deleteFavGame/:id", async (req, res, next) => {

    const gameId = req.params.id;
    const userId = req.session.currentUser._id

    try {
        const gameToRemove = await Game.findById(gameId);
        //this function makes the current user not be able to remove anothers user created game from the
        //games database
        //but allows him to remove the game from his favorites
        if(gameToRemove.creator !== req.session.currentUser.username && gameToRemove.user_created_game === true){
        await User.findByIdAndUpdate(userId, {$pull: {favoriteGames: gameId}});
        }
        //this makes the creator be able to delete his own games from games database
        else {
        await User.findByIdAndUpdate(userId, {$pull: {favoriteGames: gameId}});
        await Game.findByIdAndRemove(gameId);
        }

        res.redirect("/profile");
        
    } catch (error) {
        console.log(error)
        next(error)
    }
})

// edit profile picture

router.get("/edit-profile", (req, res, next) => {
    const {session} = req
    res.render("profile/edit-profile", {session})
})

router.post("/edit-profile", async (req, res, next) =>{
    const newProfilePicture = req.body.pic
    console.log(req.body.pic)
    const userId = req.session.currentUser._id
    console.log(req.session.currentUser)

    try {
        await User.findByIdAndUpdate(userId, {profilePicture: newProfilePicture})
        res.redirect("/profile")
    } catch (error) {
        console.log(error)
        next(error)
    }
})

// create a game

router.get("/create-game", (req, res, next) => {
    const {session} = req
    res.render("profile/create-game-form", {session})
})

router.post("/create-game", fileUploader.single('image'), async(req, res, next) =>{
    const user = req.session.currentUser;
    const userName = user.username;
    const {title, genre, platform, publisher, description, game_URL} = req.body;
    try {
        let imageUrl;

        if (req.file) {
            imageUrl = req.file.path;
          } else {
            imageUrl = 'https://upload.wikimedia.org/wikipedia/en/e/ed/Nyan_cat_250px_frame.PNG';
          }
        
        const createdGame = await Game.create({
            title,
            genre, 
            platform, 
            publisher, 
            description, 
            game_URL, 
            image: imageUrl, 
            user_created_game: true, 
            regular_game: false,
            creator: userName
        });
        await User.findByIdAndUpdate(user._id, {$push: {favoriteGames: createdGame}});
        res.redirect("/profile");
        
        /* for(let i = 0; i<99; i++){ SECRET CODE
            let gameId = createdGame._id
            await Game.findByIdAndUpdate(gameId, {$push:{likes: userName}})
        } */

       /*  for(let i = 0; i<99; i++){  SECRET CODE FOR 99 LIKES
            let gameId = createdGame._id
            await Game.findByIdAndUpdate(gameId, {$push:{likes: userName}})
        } */

    } catch (error) {
        console.log(error)
        next(error)
    } 
})


module.exports = router;


