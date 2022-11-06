const {Schema, model} = require('mongoose')

const gameSchema = new Schema ({
    apiId:String,
    title: String, 
    genre: [Object], 
    platform: String, 
    publisher: String, 
    description: String, 
    game_URL: String, 
    image: String, 
    rating: Number,
    release_date: String, 
    user_created_game: {
        type:Boolean,
        default:false
    }  
}, 
{
    timestamps: true, 
})

const Game = model("Game", gameSchema)
module.exports = Game;