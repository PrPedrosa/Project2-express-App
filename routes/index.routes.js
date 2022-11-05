const express = require('express');
const router = express.Router();
const axios = require("axios")
//getGames is a function for searching games
const getGames = require('../services/api.service');


/* GET home page */
router.get("/", async (req, res, next) => {

/*   try {
    const responseApi = await getGames("warzone");
    const games = responseApi.results
    console.log(responseApi.next)
    games.forEach(el => {
      gameTitle = el.name;
      genre = el.genres;
      platform = el.platforms;
      console.log(gameTitle, genre, platform);  
      
    });
    
    
  } catch (error) {
    console.log(error);
    next(error)
  } */

  res.render("index");
});

module.exports = router;
