const axios = require("axios");

const getBestGames=(genres) => {
    let bestGames = {
      method: "GET",
      url: `https://api.rawg.io/api/games?key=91126f5a9acd457aa8ad4ce73cd3a59f&genres=${genres}&search_precise=true&page_size=9&ordering=-metacritic&dates=2022-01-01,2022-12-31`,
    }
    return axios.request(bestGames).then(function (response) {
      const games = response.data;
      return games; 
    })
  }

  module.exports= getBestGames;