const {Schema, model} = require('mongoose')

const gameSchema = new Schema ({
    apiId:String,
    title: {
        type: String,
        required: true,
    }, 
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
    },
    free_game: {
        type:Boolean,
        default:false
    },
    regular_game: {
        type:Boolean,
        default:true
    },
    creator: String,
    likes: [String],
},
{
    timestamps: true, 
})

const Game = model("Game", gameSchema)
module.exports = Game;