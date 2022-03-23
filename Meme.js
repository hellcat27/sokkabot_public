const Discord = require('discord.js');
const randompuppy = require("random-puppy");

function getMeme(message){
        const subreddits = ["meme", "lotrmemes", "me_irl", "dankchristianmemes"];
        getImage(subreddits, message);
}


function getDog(message){
    const subreddits = ['dogpictures', 'samoyeds', 'DOG'];
    getImage(subreddits, message);
}

async function getImage(subreddits, message){
    try{
        const random = subreddits[Math.floor(Math.random() * subreddits.length)];
        const image = await randompuppy(random);
        const imageUrl = image.toString();
        console.log(typeof(image));
        const embed = new Discord.MessageEmbed()
        .setColor(16776960)
        .setImage(image)
        .setURL(`https://reddit.com/r/${random}`)
        .addField(`From r/${random}` + ' ' + imageUrl);
        message.channel.send(embed);
    } catch(err){
        console.log(err);
        return message.channel.send(err);
    }
}
module.exports = { getMeme, getDog }