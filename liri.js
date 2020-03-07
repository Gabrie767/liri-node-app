const dotenv = require("dotenv").config();
var Spotify = require("node-spotify-api")
const keys = require("./keys.js");
const axios = require("axios");
const inquirer = require("inquirer");
const fs = require("fs");
const moment = require("moment")

var spotify = new Spotify(keys.spotify)


let actionable = function (command, secondCom) {

    switch (command) {
        case ("concert-this"):
            concertThis(secondCom);
            break;
        case "spotify-this-song":
            spotifyThis(secondCom);
            break;
        case "movie-this":
            movieThis(secondCom);
            break;
        case "do-what-it-says":
            doWhat();
            break;
        default: console.log("Try Again")
            break;
    };
}


function spotifyThis(song) {
    spotify.search({ type: "track", query: song, limit: 1 }, function (err, data) {
        if (!err) {
            for (let i = 0; i < data.tracks.items.length; i++) {
                let songData = data.tracks.items[i];

                //artist
                console.log("Artist: " + songData.artists[0].name);

                //console log song name
                console.log("Song: " + songData.name);

                //console log preview link
                console.log("Preview: " + songData.preview_url);

                //console log album name
                console.log("Album: " + songData.album.name);
            }
        } else {
            console.log("err");
        }
    });
}

function movieThis(secondCom) {
    let queryUrl = "http://www.omdbapi.com/?t=" + secondCom + "&y=&plot=short&apikey=" + keys.omdb.id;
    axios.get(queryUrl).then(
        function (response) {
            console.log("Title: " + response.data.Title);
            console.log("Release Year: " + response.data.Year);
            console.log("IMdB Rating: " + response.data.imdbRating);
            console.log("Country: " + response.data.Country);
            console.log("Language: " + response.data.Language);
            console.log("Plot: " + response.data.Plot);
            console.log("Actors: " + response.data.Actors);
            console.log("Rotten Tomatoes Rating: " + response.data.Ratings[1].Value);
            console.log("Rotten Tomatoes URL: " + response.data.tomatoURL);
        })
        .catch(function (err) {
            if (err.response) {
                console.log("---------------Data---------------");
                console.log(err.response.data);
                console.log("---------------Status---------------");
                console.log(err.response.status);
                console.log("---------------Status---------------");
                console.log(err.response.headers);
            } else if (err.request) {
                console.log(err.request);
            } else {
                console.log("err", err.message);
            }
            console.log(err.config);
        });

}

function concertThis(artist) {
    let queryUrl = "https://rest.bandsintown.com/artists/" + artist + "/events?app_id=key.bandsInTown.id";
    axios.get(queryUrl).then(function (response) {

        
        let concerts = response.data;

        
        for (let i = 0; i < concerts.length; i++) {
          
            console.log("Venue: " + concerts[i].venue.name);
            console.log("City: " + concerts[i].venue.city);
            console.log("Event Date: " + moment(concerts[i].datetime).format("MM/DD/YYYY"));

        }

    })
        .catch((error) => {
            if (error) {
                console.log(error)
            }
        })
}

function doWhat() {
    fs.readFile('random.txt', "utf8", function (error, data) {
        let randomTxt = data.split(',');
        actionable(randomTxt[0], randomTxt[1]);
    })
};

actionable(process.argv[2], process.argv[3]);