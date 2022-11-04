# IronGaming

<br>



## Description


Website that search for all types of free video-games(PC, Xbox, Playstation, Mobile, etc) using RAWG API.
Adding games to a favorite list on the user's profile.
Updating the list/ removing games from the list.
Making another search just for best games of 2022 based on Metacritics.
Another search for either a random gamne/ best games ranked by user's likes (STILL NOT DECIDED YET)




<br>

## User Stories

- **404** - As a user I want to see a nice 404 page when I go to a page that doesn’t exist so that I know it was my fault
- **500** - As a user I want to see a nice error page when the super team screws it up so that I know that is not my fault
- **homepage** - As a user I want to be able to search for a game and filter the game on the search bar(shooter, strategy etc). Visualize the results.
- **sign up** - As a user I want to sign up on the web page so that I can create a list of favorite games, adding games and remove them.
- **login** - As a user I want to be able to log in on the web page so that I can get back to my account
- **logout** - As a user I want to be able to log out from the web page so that I can make sure no one will access my account
- **favorite list** - As a user I want to see the list of my favorite and delete them.
- **edit user** - As a user I want to be able to edit my profile.
- **result** - As a user I want to see the list of games filtered by my preferences.
- **games listing** - As a user I want to see more details of the games, be able to visit their website and save it as favorites.



<br>



## Server Routes (Back-end):



| **Method** | **Route**                          | **Description**                                              | Request  - Body                                          |
| ---------- | ---------------------------------- | ------------------------------------------------------------ | -------------------------------------------------------- |
| `GET`      | `/`                                | Main page route.  Renders home `index` view.                 |                                                          |
| `GET`      | `/login`                           | Renders `login` form view.                                   |                                                          |
| `POST`     | `/login`                           | Sends Login form data to the server.                         | { email, password }                                      |
| `GET`      | `/signup`                          | Renders `signup` form view.                                  |                                                          |
| `POST`     | `/signup`                          | Sends Sign Up info to the server and creates user in the DB. | { username, email, password  }                                    |
| `GET`      | `/private/edit-profile`            | Private route. Renders `edit-profile` form view.             |                                                          |
| `PUT`      | `/private/edit-profile`            | Private route. Sends edit-profile info to server and updates user in DB. | { email, password, username, [imageUrl] } |
| `GET`      | `/private/favorites`               | Private route. Render the `favorites` view.                  |                                                          |
| `POST`     | `/private/favorites/`              | Private route. Adds a new favorite for the current user.     | { name, imageURL, genre, description, websiteURL, }                                 |
| `DELETE`   | `/private/favorites/:gameId` | Private route. Deletes the existing game from the current user. |                                                          |
| `GET`      | `/video-games`                     | Renders `game-list` view.                              |                                                          |
| `GET`      | `/games/details/:id`         | Renders `games-details` view for the particular restaurant. |                                                          |







## Models

User model

```javascript
{
  username: String,
  email: String,
  password: String,
  games: [GamesId],
  profilePic: Schema.Types.ObjectId
}

```



Games model

```javascript
{
  title: String,
  genre: String,
  platform: String,
  publisher: String,
  description: String, 
  game_URL: String, 
  image: String,
  rating: Number,
  release_date: String 
  user_created_game: {
    type: boolean, 
    default: false
  }

}

```



<br>

## API's

RAWG-Api 
<br>
FreeToGame-Api

<br>


## Packages

Axios


<br>



## Backlog

[See the Trello board.](https://trello.com/b/Ni3giVKf/ironhackproject)



<br>



## Links



### Git

The url to your repository and to your deployed project

[https://github.com/PrPedrosa/Project2-express-App/tree/dev]()

[https://project2videogames.herokuapp.com/]()



<br>



### Slides

The url to your presentation slides

[Slides Link](https://docs.google.com/presentation/d/1P5FIi0vHZBUcgUtmt1M4_lLCO5dwdJ4UOgtJa4ehGfk/edit?usp=sharing)

### Contributors
Diana Pirlici - [`github`](https://github.com/DianaMariaa98) - [`linkedin`](https://www.linkedin.com/in/diana-pirlici/)

Pedro Pedrosa - [`github`](https://github.com/PrPedrosa) - [`linkedin`](https://www.linkedin.com/in/prpedrosa/)