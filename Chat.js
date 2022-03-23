const jokes = require('./jokes.json');
const eightBall = require('./8ball.json');
const Gif = require('./Gif');
const Vote = require('./Vote');
const Weather = require('./Weather');
const Music = require('./Music');
const Meme = require('./Meme');

class Chat {
    constructor(timeStarted, client) {
        this.activeVote = false;
        this.timeStarted = timeStarted;
        this.client = client;
        this.queue = new Map();
    }

    response(message) {
        switch(message.content.split(' ')[0].toLowerCase()) {
            case '!gif':
                this.Gif = new Gif(message);
                break;
            case '!commands':
            case '!help':
                    message.channel.send('!meme - Get a random meme!\n!doge - Get a random dog picture!\n!gif [search query] - Search for gifs\n!weather [city or zipcode] - Get weather for location\n!ping - Test connection\n!joke - Tell me a joke\n!8ball [query] - Get your (scientific) fortune here\n!avatarmovie - The Dai Li are on their way...\n!vote [option1] [option2] [...] - Setup a vote here, max of 10 options\n!uptime - How long I\'ve been running since the last restart.\n\n*** Music commands! *** NEW NEW NEW GET YER FRESH TUNES HERE!\n!play [search query] - Play or queue up a song.\n!stop - Stop the music.\n!pause - Pause the music.\n!resume - Resume the music.\n!queue - View the songs in the queue.');
                    break;
            case '!ping':
                message.channel.send('Pong.');
                break;
            case '!joke': {
                this.sayJoke(message);
                break;
            }
            case '!8ball': {
                if(message.content.split(' ').length > 1) {
                    this.sayEightBallPhrase(message);
                }
                else {
                    message.channel.send('I need more information to form a conclusion.');
                }
                break;
            }
            case '!avatarmovie': {
                message.channel.send('There is no Avatar movie in Ba Sing Se.');
                setTimeout(() => message.channel.send('Here we are safe. Here we are free.'), 1500);
                break;
            }
            case '!vote': {
                if(!this.activeVote) {
                    const vote = new Vote(message);
                }
                break;
            }
            case '!uptime':
                {
                    const days = Math.floor(this.client.uptime / 86400000);
                    const hours = Math.floor(this.client.uptime / 3600000) % 24;
                    const minutes = Math.floor(this.client.uptime / 60000) % 60;
                    const seconds = Math.floor(this.client.uptime / 1000) % 60;
                    message.channel.send(`I have been running for ${days} days, ${hours} hours, ${minutes} minutes, and ${seconds} seconds since: ` + this.timeStarted.format('dddd, MMMM Do YYYY, h:mm:ss a.'));
                    break;
                }
            case '!weather':
                {
                    if(message.content.split(' ').length > 1) {
                        const weather = new Weather(message);
                    }
                    else {
                        message.channel.send('I need a city name!');
                    }
                    break;
                }
            case '!play':
                {
                    //console.log(typeof(musicQueue));
                    const serverQueue = this.queue.get(message.guild.id);
                    Music.play(message, serverQueue, this.queue);
                    break;
                }
            case '!stop':
                {
                    const serverQueue = this.queue.get(message.guild.id);
                    Music.stop(message, serverQueue, this.queue);
                    break;
                }
            case '!skip':
                {
                    const serverQueue = this.queue.get(message.guild.id)
                    Music.skip(message, serverQueue, this.queue);
                    break;
                }
            case '!queue':
                {
                    const serverQueue = this.queue.get(message.guild.id)
                    Music.queue(message, serverQueue, this.queue);
                    break;
                }
            case '!resume':
                {
                    const serverQueue = this.queue.get(message.guild.id)
                    Music.resume(message, serverQueue, this.queue);
                    break;
                }
            case '!pause':
                {
                    const serverQueue = this.queue.get(message.guild.id)
                    Music.pause(message, serverQueue, this.queue);
                    break;
                }
            case '!meme':
                {
                    Meme.getMeme(message);
                    break;
                }
            case '!doge':
                {
                    Meme.getDog(message);
                    break;
                }
            default:
                message.channel.send('I don\'t understand that command. Type \'!help\' or \'!commands\' for help.');
                break;
        }
    }

    sayJoke(message) {
        const jokearray = Object.values(jokes);
        const ran_key = Math.floor(Math.random() * jokearray.length);
        message.channel.send(jokearray[ran_key]);
    }

    sayEightBallPhrase(message) {
        const eightBallArray = Object.values(eightBall);
        const ran_key = Math.floor(Math.random() * eightBallArray.length);
        message.channel.send(eightBallArray[ran_key]);
    }


}

module.exports = Chat;

// message.channel.send(Object.values(jokes)
