const router = require("express").Router();
const Game = require('../models/Game.model');
const getGames = require('../services/api.service');




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

