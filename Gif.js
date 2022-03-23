const Discord = require('discord.js');
const giphyKey = process.env.GIPHYKEY;
const giphy = require('giphy-api')(giphyKey);
const axios = require('axios');

class Gif {
    constructor(message) {
        this.message = message;
        this.searchQuery = '';
        this.gifHandler(message);
    }

    gifHandler(message) {
        this.results = this.message.content.split(' ');
        for(let i = 1; i < this.results.length; i++) {
            this.searchQuery += (this.results[i]) + '+';
        }
        this.randomNum = Math.floor(Math.random() * 40);
        this.searchString = 'https://api.giphy.com/v1/gifs/search?api_key=' + giphyKey + '&q=' + this.searchQuery + '&limit=1&offset=' + this.randomNum + '&rating=pg&lang=en';
        // console.log(this.searchQuery);
        // console.log(this.randomNum);
        // console.log(this.searchString);
        
        // Search endpoint with options
        axios.get('https://api.giphy.com/v1/gifs/search?api_key=' + giphyKey + '&q=' + this.searchQuery + '&limit=1&offset=' + this.randomNum + '&rating=pg&lang=en')
            .then(response => {
                this.returnData = response.data.data;
                // console.log(this.returnData[0].url);
                message.channel.send(this.returnData[0].url);
            })
            .catch(error => {
                console.log(error);
            });        
    }
}

module.exports = Gif;