const axios = require("axios");

/* class ApiService {
    constructor() {
      this.api = axios.create({
        baseURL: 'https://api.rawg.io/api/games'
      });
    }

    searchGames(name, genre, platform){
        return this.api.get(`/&search=${name}&genre=${genre}&platform=${platform}`)
    }
}
 */
let allGenres = "action,adventure,shooter,strategy,indie,role-playing-games-rpg,casual,simulation,puzzle,arcade,platformer,racing,massively-multiplayer,sports,fighting,family,board-games,educational,card"


const searchGames=(gameName)=> {
    let getAllGame = {
      method: "GET",
      url: `https://api.rawg.io/api/games?key=91126f5a9acd457aa8ad4ce73cd3a59f&search=${gameName}&page_size=30`,
  /*     headers: {
        key: process.env.API_KEY
      }, */
    };
    return axios.request(getAllGame).then(function (response) {
      const game = response.data;
      return game;
    });
  }


module.exports= searchGames;