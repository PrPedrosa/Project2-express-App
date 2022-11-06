const router = require("express").Router();
const Game = require('../models/Game.model');
const getGames = require('../services/api.service');
const getOneGame = require('../services/getOneGame');
const User = require('../models/User.model');



router.get("/details/:id", async(req, res, next) =>{
    try {
        const gameId = req.params.id;
        const game = await getOneGame(gameId);
        console.log(game)
        /* const description = game.description; */
        /* const metacritic = game.metacritic;
        if(metacritic ==='null' && metacritic === 0){
            return 0;
        } */
        /* console.log(description)
        const bestDescription = description.substring(3, description.length - 3) */
        res.render("games/game-details", game);
    } catch (error) {
       console.log(error); 
    }
    
})


router.post("/search", async (req, res, next) => {
    const searchTerm = req.body.game;
    try {
        const apiResponse = await getGames(searchTerm);
        const games = apiResponse.results
   
        res.render("games/game-list", {games});
    } catch (error) {
        console.log(error)
        next(error);
    }
})

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
            game_release_date:released_at

        })
        await User.findByIdAndUpdate(currentUser._id, {$push:{favoriteGames:gameToAdd._id}})
        res.redirect('/profile');
    } catch (error) {
        console.log(error)
        next(error)
    }
    
})



module.exports = router;

