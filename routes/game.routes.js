const router = require("express").Router();
const Game = require('../models/Game.model');
const getGames = require('../services/api.service');
const getOneGame = require('../services/getOneGame');
const User = require('../models/User.model');
const getBestGames = require('../services/bestGames');
const capitalize = require("../utils/capitalize");
const getFreeGames = require("../services/freeGames");
const isLoggedIn = require("../middleware/isLoggedIn");
/* const axios = require("axios") */;
//GamingHub for name??

//get game details

router.get("/details/:id", async(req, res, next) =>{
    try {
        const gameId = req.params.id;

        if(gameId.length < 7){
            const game = await getOneGame(gameId);
            /* console.log(game) */
            res.render("games/game-details", game);
        } else{
            const userGame = await Game.findById(gameId);
            /* console.log(userGame) */
            res.render("games/user-game-details", userGame);
        }

        
    } catch (error) {
       console.log(error); 
    }
    
})

//search games

router.post("/search", async (req, res, next) => {
    const gameName = req.body.game;
    let isFirstPage = true;
    let isLastPage = false;
    try {
        const apiResponse = await getGames(gameName);
        const games = apiResponse.games.results
        const numOfGames = apiResponse.games.count
        const numOfPages = Math.ceil(numOfGames/9);
        const page = apiResponse.page

        //for search with filters see req.query.filter??
   
        res.render("games/game-list", {games, page, gameName, numOfGames, numOfPages, isFirstPage, isLastPage});
    } catch (error) {
        console.log(error)
        next(error);
    }
})

//pagination on search games
router.post("/search/:page/:state/:gameName?", async (req, res, next) => {
    let page = req.params.page;
    let gameName = req.params.gameName;
    let {state} = req.params;
    if(state === "next") page = +(page) +1;
    else page = +(page) -1

    

    try {
        const apiResponse = await getGames(gameName, page);
        const games = apiResponse.games.results
        const numOfGames = apiResponse.games.count
        page = apiResponse.page
        const numOfPages = Math.ceil(numOfGames/9);
        
        let isFirstPage;
        if(page > 1) isFirstPage = false;
        else isFirstPage = true;

        let isLastPage;
        if(page < numOfPages) isLastPage = false;
        else isLastPage = true;
        
        res.render("games/game-list", {games, page, gameName, numOfGames, numOfPages, isFirstPage, isLastPage});
    } catch (error) {
        console.log(error);
        next(error);
    }
})

//add games and userGames to favorites

router.post('/addGame/:id', isLoggedIn, async (req, res, next) => {
    const gameId = req.params.id;
    const currentUser = req.session.currentUser;
    const username = currentUser.username;

    try {
        if(gameId.length < 7){

            const favoriteGame = await getOneGame(gameId);
            const{name, website, genres, background_image, publishers, id, platform, rating, released_at} = favoriteGame;
            const gameToAdd = await Game.create({
                title:name, 
                genre:genres, 
                image:background_image, 
                game_URL:website,
                game_publisher:publishers,
                apiId:id,
                platform_game:platform,
                game_rating:rating,
                game_release_date:released_at
            })
            await User.findByIdAndUpdate(currentUser._id, {$push:{favoriteGames:gameToAdd._id}})
        } else {
            const userCreatedFavoritedGame = await Game.findById(gameId);
            await User.findByIdAndUpdate(currentUser._id, {$push:{favoriteGames: userCreatedFavoritedGame._id}});
            //likes
            if(!(userCreatedFavoritedGame.likes.includes(username)))
            await Game.findByIdAndUpdate(gameId, {$push:{likes: username}})
        }
        res.redirect('/profile');
    } catch (error) {
        console.log(error)
        next(error)
    }
    
})

//add free games to favorites

router.post("/addFreeGame/:id", isLoggedIn, async (req, res, next) =>{
    const freeGameId = req.params.id;
    const currentUser = req.session.currentUser;
    try {
        const freeGame = await getFreeGames(freeGameId);
        const {title, thumbnail, short_description, game_url, genre, platform, publisher, release_date, id} = freeGame;
        const gameToAdd = await Game.create({
            title: title, 
            genre: genre, 
            image: thumbnail, 
            game_URL: game_url,
            game_publisher: publisher,
            apiId: id,
            platform_game: platform,
            game_release_date: release_date,
            description: short_description,
            free_game: true,
            regular_game: false
        })
        await User.findByIdAndUpdate(currentUser._id, {$push:{favoriteGames:gameToAdd._id}})
        res.redirect("/profile");
    } catch (error) {
        console.log(error)
        next(error)
    }
})

//get best games

router.get("/best-games", isLoggedIn, async (req, res, next) => {
    try {
        const apiResponse = await getBestGames();
        const games = apiResponse.results;
        console.log(games);
        res.render("games/best-games", {games});
    } catch (error) {
        console.log(error);
        next(error);
    }
})

router.post('/bestGames/:genres', async (req, res, next) => {
    let genres = req.params.genres;
    let bigGenres = capitalize(genres)
    //do good rpg genre

    try {
    const apiResponse = await getBestGames(genres);
    const games = apiResponse.results;
    console.log(games);
    res.render('games/best-games', {games, bigGenres});
    } catch (error) {
        console.log(error);
        next(error)
    }
})

//get user games

router.get("/user-created-games", isLoggedIn, async (req, res, next) => {
    try {
        const userGames = await Game.find({user_created_game: true});
        //sort usergames by likes here!!!!!!!!!!!!!!!!
        /* objs.sort((a,b) => a.last_nom - b.last_nom); */ // b - a for reverse sort
        let sortedUserGames = userGames.sort((a, b) => b.likes.length - a.likes.length)
        console.log(sortedUserGames);
        
        res.render("games/user-games", {sortedUserGames});
    } catch (error) {
        console.log(error);
        next(error)
    }
})

//get free games

router.get("/free-games", isLoggedIn, (req, res, next) => res.render('games/free-games-list'))

router.post("/free-games", async(req, res, next) => {
    const searchTerm = req.body.searchTerm;
    try {
        const allFreeGames = await getFreeGames();
        let gamesArr = [];
        allFreeGames.forEach(game =>{
        
            let gameName = game.title.toLowerCase();
            if(gameName.includes(searchTerm)) gamesArr.push(game);
        })
        console.log(gamesArr)
        res.render('games/free-games-list', {gamesArr})
    } catch (error) {
        console.log(error)
        next(error)
    }
})

//details free game

router.get('/details/free-game/:id', async (req, res, next) =>{
    const gameId = req.params.id;
    try {
        const freeGame = await getFreeGames(gameId);
        console.log(freeGame)
        res.render('games/free-games-details', freeGame)
    } catch (error) {
        console.log(error)
        next(error)
    }
})

module.exports = router;

