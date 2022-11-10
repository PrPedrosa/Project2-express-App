const express = require('express');
const router = express.Router();
const axios = require("axios")
//getGames is a function for searching games
const getGames = require('../services/api.service');


/* GET home page */
router.get("/", async (req, res, next) => {
  const {session} = req;

  res.render("index", {session});
});

module.exports = router;
