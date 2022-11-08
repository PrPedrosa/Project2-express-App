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


const searchGames=(gameName, page = 1)=> {

    if(!gameName) gameName = ""
    if(page === 0) page = 1

    let getAllGames = {
      method: "GET",
      url: `https://api.rawg.io/api/games?key=91126f5a9acd457aa8ad4ce73cd3a59f&search=${gameName}&search_precise=true&page_size=9&page=${page}`,
  /*     headers: {
        key: process.env.API_KEY
      }, */
    };
    return axios.request(getAllGames).then(function (response) {
      const games = response.data;
      /* console.log(response) */
      return {games, page, gameName};
    })
    .catch(error => console.log(error))
  }


  

module.exports= searchGames;
