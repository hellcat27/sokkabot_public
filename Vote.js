// const moment = require('moment');
const Discord = require('discord.js');

class Vote {
    constructor(message) {
        this.results = [];
        this.lookupTable = [
            ':one:',
            ':two:',
            ':three:',
            ':four:',
            ':five:',
            ':six:',
            ':seven:',
            ':eight:',
            ':nine:',
            ':ten:',
        ];
        this.message = message;
        this.response = new Discord.Message(message.client, message.data, message.channel);
        this.voteHandler();
    }

    voteHandler() {
        this.results = this.message.content.split(' ');
        if(this.results.length > 11) {
            this.message.channel.send('Too many voting options.');
            return;  
        }
        this.response.message = '';
        for(let i = 1; i < this.results.length; i++) {
            this.response.message += (this.lookupTable[i - 1] + ' - ' + this.results[i] + '\n');
        }
        this.message.channel.send(this.response.message);
    }
}

module.exports = Vote;