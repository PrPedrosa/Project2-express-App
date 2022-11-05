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


const searchGames=(name, genre, platform)=> {
    let getAllGame = {
      method: "GET",
      url: `https://api.rawg.io/api/games?key=91126f5a9acd457aa8ad4ce73cd3a59f&search=${name}&genres=${genre}&platforms=${platform}`,
      headers: {
        key: process.env.API_KEY
      },
    };
    return axios.request(getAllGame).then(function (response) {
      const game = response.data;
      return game;
    });
  }


module.exports= searchGames;