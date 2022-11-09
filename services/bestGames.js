const axios = require("axios");

const getBestGames=(genres) => {
    let bestGamesByGenre = {
      method: "GET",
      url: `https://api.rawg.io/api/games?key=91126f5a9acd457aa8ad4ce73cd3a59f&genres=${genres}&search_precise=true&page_size=9&ordering=-metacritic&dates=2022-01-01,2022-12-31`,
    }

    let bestGames = {
      method: "GET",
      url: `https://api.rawg.io/api/games?key=91126f5a9acd457aa8ad4ce73cd3a59f&search_precise=true&page_size=9&ordering=-metacritic&dates=2022-01-01,2022-12-31`,
    }
    if(genres) {
    return axios.request(bestGamesByGenre).then(function (response) {
      const games = response.data;
      return games; 
    })
  } else {
    return axios.request(bestGames).then(function (response) {
      const games = response.data;
      return games; 
  })
 } 
}

  module.exports= getBestGames;