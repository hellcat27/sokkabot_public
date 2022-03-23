const Discord = require('discord.js');
const client = new Discord.Client();
const Chat = require ('./Chat');
const moment = require ('moment');
// const Vote = require ('./Vote');

client.once('ready', () => {
	console.log('Ready!');
});

const timeStarted = moment();
//const musicQueue = new Map();
const chat = new Chat(timeStarted, client);

client.on('message', message => {
    if(!message.author.bot && message.channel.type !== 'dm' && !message.content.startsWith('!')) {
        console.log(message.author.username);
    }
    if(!message.content.startsWith('!') || message.author.bot) {
        return; 
    }
    chat.response(message);
});

client.login(process.env.DISCORDKEY);