const express = require('express');
const router = express.Router();
const axios = require("axios")
//getGames is a function for searching games
const getGames = require('../services/api.service');


/* GET home page */
router.get("/", async (req, res, next) => {
/*   if(req.session) {
    res.render("index", req.session.currentUser.username)
    return;
  }; */


  res.render("index");
});

module.exports = router;
