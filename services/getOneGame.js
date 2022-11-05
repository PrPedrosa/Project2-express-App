const axios = require("axios");

const getOneGame = (gameId) => {
    let getGameDetails = {
      method: "GET",
      url: `https://api.rawg.io/api/games/${gameId}?key=91126f5a9acd457aa8ad4ce73cd3a59f`,
  /*     headers: {
        key: process.env.API_KEY
      }, */
    };
    return axios.request(getGameDetails).then(function (response) {
      const game = response.data;
      return game;
    });
  }

  module.exports= getOneGame;