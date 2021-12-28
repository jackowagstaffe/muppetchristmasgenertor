import dotenv from 'dotenv'
import express from 'express'
import fetch from 'node-fetch'

dotenv.config()

const app = express()
const port = process.env.PORT || 3000

const tmdbUrl = 'https://api.themoviedb.org/3/'
const tmdbKey = process.env.TMDB_KEY

let latestMovieId = null

const getLatestMovieId = fetch(`${tmdbUrl}movie/latest?api_key=${tmdbKey}`)
    .then(response => response.json())
    .then(data => {
        return data.id
    })

const getRandomMovieId = (latestMovieId) => {
        return Math.floor(Math.random() * latestMovieId) + 1
    }

latestMovieId = await getLatestMovieId

// Get a random move from the tmdb api
// Title can be accessed at .title
const getRandomMovie = (latestMovieId) => fetch(`${tmdbUrl}movie/${getRandomMovieId(latestMovieId)}?api_key=${tmdbKey}`)
    .then(response => response.json())

const getTitleFromData = (data) => {
    let title = data.title
        
    if (title.startsWith('The ')) {
        title = title.substr(4)
    }

    return `The Muppet Christmas ${title}`
}

const generateMovie = (latestMovieId, res, attempts) => {
    getRandomMovie(latestMovieId)
    .then(data => {
        if (data.success === false) {
            console.log(`${attempts + 1} attempts`)
            generateMovie(latestMovieId, res, attempts + 1)
        } else {
            res.send(getTitleFromData(data))
        }
    })
}


app.get('/', (req, res) => {
    generateMovie(latestMovieId, res, 1)
}) 

app.listen(port, () => {
  console.log(`App listening at http://localhost:${port}`)
})