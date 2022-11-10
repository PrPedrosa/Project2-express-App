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

//get game details or usergame details

router.get("/details/:id", isLoggedIn, async(req, res, next) =>{
    try {
        const gameId = req.params.id;
        const {session} = req
        const currentUserId = req.session.currentUser._id;
        const userToCheck = await User.findById(currentUserId).populate("favoriteGames");
        const userFavorites = userToCheck.favoriteGames;



        //get big api game details
        if(gameId.length < 7){
            const apigame = await getOneGame(gameId);

            let isGameOnFavorites = false

            userFavorites.forEach(game =>{
    
            if(game.apiId == apigame.id){
                
                return isGameOnFavorites = true
            }
            /* else if(userFavorites.indexOf(game) === userFavorites.length -1){
                return isGameOnFavorites = false
            } */
            })

            let pokemonPage;
            
            if (gameId === '23762') {
                 pokemonPage = true;
            } else {
                 pokemonPage = false;
            }
            
        

            res.render("games/game-details", {apigame, isGameOnFavorites, session, pokemonPage});

        
        //get user game details
        } else{
            const userGame = await Game.findById(gameId);

            let userGameOnFavoritesAndCurrentUserNotTheCreator;
            let userGameOnFavoritesAndCurrentUserIsTheCreator;
            let userGameNotOnCurrentUserFavorites;

            //let favGames = [];
            //userFavorites.forEach(game => favGames.push(game));

            console.log(userFavorites.includes(gameId))

            userFavorites.forEach(game =>{
            if(game.title === userGame.title && userToCheck.username === userGame.creator){
                return userGameOnFavoritesAndCurrentUserIsTheCreator = true;

            }else if(game.title === userGame.title && userToCheck.username !== userGame.creator){
                return userGameOnFavoritesAndCurrentUserNotTheCreator = true;
            }
            else if(userFavorites.indexOf(game) === userFavorites.length -1){
                if(userGameOnFavoritesAndCurrentUserIsTheCreator) {
                  return userGameNotOnCurrentUserFavorites = false;
                }
                if(userGameOnFavoritesAndCurrentUserNotTheCreator) {
                  return userGameNotOnCurrentUserFavorites = false;
                }
                
                return userGameNotOnCurrentUserFavorites = true;
            }
        })
        console.log(userGameNotOnCurrentUserFavorites, userGameOnFavoritesAndCurrentUserIsTheCreator, userGameOnFavoritesAndCurrentUserNotTheCreator)
        /* console.log(isUserGameOnFavorites) */
            
            res.render("games/user-game-details", {userGame, userGameOnFavoritesAndCurrentUserNotTheCreator, userGameOnFavoritesAndCurrentUserIsTheCreator, userGameNotOnCurrentUserFavorites, session});
        }


        
    } catch (error) {
       console.log(error); 
    }
    
})

//search games

router.post("/search", async (req, res, next) => {
    const gameName = req.body.game;
    const user = req.session.currentUser;
    const {session} = req
    let isFirstPage = true;
    let isLastPage = false;
    try {
        const apiResponse = await getGames(gameName);
        const games = apiResponse.games.results
        const numOfGames = apiResponse.games.count
        const numOfPages = Math.ceil(numOfGames/9);
        const page = apiResponse.page
   
        res.render("games/game-list", {games, page, gameName, numOfGames, numOfPages, isFirstPage, isLastPage, session});
    } catch (error) {
        console.log(error)
        next(error);
    }
})

//pagination on search games
router.post("/search/:page/:state/:gameName?", async (req, res, next) => {
    const {session} = req
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
        
        res.render("games/game-list", {games, page, gameName, numOfGames, numOfPages, isFirstPage, isLastPage, session});
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
            await User.findByIdAndUpdate(currentUser._id, {$push:{favoriteGames: gameToAdd._id}})
        } else {
            const userCreatedFavoritedGame = await Game.findById(gameId);
            await User.findByIdAndUpdate(currentUser._id, {$push: {favoriteGames: userCreatedFavoritedGame._id}});
            //likes
            if(!(userCreatedFavoritedGame.likes.includes(username))){
    
                await Game.findByIdAndUpdate(gameId, {$push:{likes: username}})
            
            }
        }
        res.redirect(`/details/${gameId}`);
    } catch (error) {
        console.log(error)
        next(error)
    }
    
})

//add free games to favorites

router.post("/addFreeGame/:id", isLoggedIn, async (req, res, next) =>{
    const freeGameId = req.params.id;
    const currentUser = req.session.currentUser;
    const currentUserId = currentUser._id

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
        await User.findByIdAndUpdate(currentUserId, {$push:{favoriteGames:gameToAdd._id}})

        res.redirect(`/details/free-game/${gameToAdd.apiId}`);


        //not getting duplicate free games on user profile

        /* const userToCheck = await User.findById(currentUserId).populate("favoriteGames");
        const userFavorites = userToCheck.favoriteGames;
        userFavorites.forEach(async game =>{
            if(game.apiId == gameToAdd.apiId){
                res.redirect(`/details/free-game/${gameToAdd.apiId}`);
                return;
            }
            else if(userFavorites.indexOf(game) === userFavorites.length-1){

                await User.findByIdAndUpdate(currentUser._id, {$push:{favoriteGames:gameToAdd._id}})
                res.redirect(`/details/free-game/${gameToAdd.apiId}`);
            }
        }) */
    } catch (error) {
        console.log(error)
        next(error)
    }
})

//get best games

router.get("/best-games", isLoggedIn, async (req, res, next) => {
    const {session} = req
    try {
        const apiResponse = await getBestGames();
        const games = apiResponse.results;
        console.log(games);
        res.render("games/best-games", {games, session});
    } catch (error) {
        console.log(error);
        next(error);
    }
})

router.post('/bestGames/:genres', async (req, res, next) => {
    const {session} = req
    let genres = req.params.genres;
    let bigGenres = capitalize(genres)
    //do good rpg genre

    try {
    const apiResponse = await getBestGames(genres);
    const games = apiResponse.results;
    console.log(games);
    res.render('games/best-games', {games, bigGenres, session});
    } catch (error) {
        console.log(error);
        next(error)
    }
})

//get user games

router.get("/user-created-games", isLoggedIn, async (req, res, next) => {
    const {session} = req
    try {
        const userGames = await Game.find({user_created_game: true});
        //sort usergames by likes here!!!!!!!!!!!!!!!!
        /* objs.sort((a,b) => a.last_nom - b.last_nom); */ // b - a for reverse sort
        let sortedUserGames = userGames.sort((a, b) => b.likes.length - a.likes.length)
        console.log(sortedUserGames);
        
        res.render("games/user-games", {sortedUserGames, session});
    } catch (error) {
        console.log(error);
        next(error)
    }
})

//get free games

router.get("/free-games", isLoggedIn, (req, res, next) => {
    const {session} = req
    res.render('games/free-games-list', {session})
})

//here, when no results, show message saying no results
router.post("/free-games", async(req, res, next) => {
    const {session} = req
    const searchTerm = req.body.searchTerm;
    try {
        const allFreeGames = await getFreeGames();
        let gamesArr = [];
        allFreeGames.forEach(game =>{
        
            let gameName = game.title.toLowerCase();
            if(gameName.includes(searchTerm)) gamesArr.push(game);
        })
        console.log(gamesArr)
        res.render('games/free-games-list', {gamesArr, session})
    } catch (error) {
        console.log(error)
        next(error)
    }
})

//details free game

router.get('/details/free-game/:id', async (req, res, next) =>{
    const {session} = req
    const gameId = req.params.id;
    const currentUserId = req.session.currentUser._id;
    try {
        const userToCheck = await User.findById(currentUserId).populate("favoriteGames");
        const userFavorites = userToCheck.favoriteGames;
        const freeGame = await getFreeGames(gameId);

        let isGameOnFavorites = false

        userFavorites.forEach(game =>{
            if(game.apiId == freeGame.id){
                return isGameOnFavorites = true
            }
           /*  else if(userFavorites.indexOf(game) == userFavorites.length -1){
                return isGameOnFavorites = false
            } */
        })

        console.log(isGameOnFavorites)

        console.log(freeGame)


        res.render('games/free-games-details', {freeGame, isGameOnFavorites, session})
    } catch (error) {
        console.log(error)
        next(error)
    }
})

router.get('/pokemon', (req, res, next) => res.render('games/pokemon'));

module.exports = router;

