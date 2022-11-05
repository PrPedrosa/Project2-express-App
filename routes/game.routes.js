const router = require("express").Router();
const Game = require('../models/Game.model');
const getGames = require('../services/api.service');
const getOneGame = require('../services/getOneGame');



router.get("/details/:id", async(req, res, next) =>{
    try {
        const gameId = req.params.id;
        const game = await getOneGame(gameId);
        const description = game.description;
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



module.exports = router;

