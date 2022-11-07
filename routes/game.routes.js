const router = require("express").Router();
const Game = require('../models/Game.model');
const getGames = require('../services/api.service');
const getOneGame = require('../services/getOneGame');
const User = require('../models/User.model');
/* const axios = require("axios") */;

//get game details

router.get("/details/:id", async(req, res, next) =>{
    try {
        const gameId = req.params.id;
        const game = await getOneGame(gameId);
        console.log(game)
        res.render("games/game-details", game);
    } catch (error) {
       console.log(error); 
    }
    
})

//search games

router.post("/search", async (req, res, next) => {
    const gameName = req.body.game;
    try {
        const apiResponse = await getGames(gameName);
        const games = apiResponse.games.results
        const numOfGames = apiResponse.games.count
        const numOfPages = Math.ceil(numOfGames/10);
        const page = apiResponse.page
        /* const displayedGames = page*10 */
   
        res.render("games/game-list", {games, page, gameName, numOfGames, numOfPages});
    } catch (error) {
        console.log(error)
        next(error);
    }
})

//pagination on search games
//error when searching without gamename
router.post("/search/:page/:gameName/:state", async (req, res, next) => {
    let page = req.params.page;
    let gameName = req.params.gameName;
    let {state} = req.params;
    if(state === "next") page = +(page) +1;
    else page = +(page) -1

    try {
        const apiResponse = await getGames(gameName, page);
        const games = apiResponse.games.results
        const numOfGames = apiResponse.games.count
        page = apiResponse.page
        const numOfPages = Math.ceil(numOfGames/9);

        
   
        res.render("games/game-list", {games, page, gameName, numOfGames, numOfPages});
    } catch (error) {
        console.log(error);
        /* if(error.status === 404) res.redirect("/")   how to?????*/
        next(error);
    }
})

//create games

router.post('/addGame/:id', async (req, res, next) => {
    const gameId = req.params.id;
    const currentUser = req.session.currentUser;

    try {
        const favoriteGame = await getOneGame(gameId);
        const{name, website, genres, background_image, publishers, id, platform, rating, released_at} = favoriteGame;
        const gameToAdd = await Game.create({
            title:name, 
            genre:genres, 
            image:background_image, 
            game_URL:website,
            game_publisher:publishers,
            apiId:id,
            platform_game:platform,
            game_rating:rating,
            game_release_date:released_at,
            user_created_game: true

        })

        await User.findByIdAndUpdate(currentUser._id, {$push:{favoriteGames:gameToAdd._id}})
        res.redirect('/profile');
    } catch (error) {
        console.log(error)
        next(error)
    }
    
})



module.exports = router;

