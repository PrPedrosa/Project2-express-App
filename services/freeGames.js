const axios = require("axios");

const getFreeGames = (gameId) => {
    let freeGames= {
        method: "GET",
        url: `https://www.freetogame.com/api/games`
      }

    let oneFreeGame = {
        method: 'GET',
        url: `https://www.freetogame.com/api/game?id=${gameId}`
    }

    if(gameId){
        return axios.request(oneFreeGame).then(function (response) {
            const games = response.data;
            return games; 
        })
        
    } else {
        return axios.request(freeGames).then(function (response) {
          const games = response.data;
          return games; 
      })
    }
}

module.exports= getFreeGames;