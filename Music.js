const ytdl = require("ytdl-core");
const ytSearch = require("yt-search");

async function play(message, queue, masterQueue){
    //console.log("play");
    const args = message.content.split(" ");
    const searchString = args.slice(1).join(" ");
    //console.log(searchString);

    const voiceChannel = message.member.voice.channel;
    if(!voiceChannel){
        return message.channel.send("You need to be in a voice channel to play music!");
    }
    const permissions = voiceChannel.permissionsFor(message.client.user);
    if (!permissions.has("CONNECT") || !permissions.has("SPEAK")) {
        return message.channel.send(
        "I need the permissions to join and speak in your voice channel!"
        );
    }
    const searchSong = await ytSearch(searchString);
    if(!searchSong.videos){
        return message.channel.send("No results.");
    }
    //const songInfo = await ytdl.getInfo(args[1]);
    const topResult = searchSong.videos[0];
    //console.log(topResult);

    const song = {
          title: topResult.title,
          url: topResult.url,
          author: topResult.author.name
     };
    //console.log(searchString);
    //console.log(song);

    if(!queue){
        const queueConstruct = {
            textChannel: message.channel,
            voiceChannel: voiceChannel,
            connection: null,
            songs: [],
            volume: 5,
            playing: true
        };        
    
        masterQueue.set(message.guild.id, queueConstruct);
        queueConstruct.songs.push(song);

        try {
           var connection = await voiceChannel.join();
           queueConstruct.connection = connection;
           playNext(message.guild, queueConstruct.songs[0], masterQueue);
        }
        catch(err){
            console.log(err);
            masterQueue.delete(message.guild.id);
            return message.channel.send(err);
        }
    } else {
        queue.songs.push(song);
        return message.channel.send(`${song.title} has been added to the queue!`);
    }
}

function playNext(guild, song, masterQueue){
    const queue = masterQueue.get(guild.id);
    //console.log(queue);
    if(!song){
        queue.voiceChannel.leave();
        masterQueue.delete(guild.id);
        return;
    }

    const dispatcher = queue.connection
    .play(ytdl(song.url))
    .on("finish", () => {
        queue.songs.shift();
        playNext(guild, queue.songs[0], masterQueue);
    })
    .on("error", error => console.error(error));
    dispatcher.setVolumeLogarithmic(queue.volume / 5);
    queue.textChannel.send(`Now playing: ${song.title}`);
}

function skip(message, queue){
    //console.log("skip");
    if(!message.member.voice.channel){
        return message.channel.send("You have to be in a voice channel to use this function!");
    }
    if(!queue){
        return message.channel.send("The music queue is empty!");
    }
    queue.connection.dispatcher.end();
}

function stop(message, queue){
    //console.log("stop");
    if(!message.member.voice.channel){
        return message.channel.send("You have to be in a voice channel to use this function!");
    }
    if(!queue){
        return message.channel.send("The music queue is empty!");
    }

    queue.songs = [];
    queue.connection.dispatcher.end();
}

function queue(message, queue){
    //console.log("queue");
    if(!queue){
        return message.channel.send("The music queue is empty!");
    }
    //console.log(queue.songs);
    //console.log(typeof(queue.songs));
    let queueMessage = 'Now playing: ';
    let n = 0;
    for(var key in queue.songs){
        //console.log(queue.songs[key].title);
        queueMessage = queueMessage.concat(queue.songs[key].title + "\n");
        n++;
    }
    queueMessage = queueMessage.concat(`There are ${n} songs in the queue.`);
    return message.channel.send(queueMessage);
}

function pause(message, queue){
    //console.log("pause");
    if(!message.member.voice.channel){
        return message.channel.send("You have to be in a voice channel to use this function!");
    }
    if(!queue){
        return message.channel.send("The music queue is empty!");
    }
    if(!queue.connection.dispatcher.paused){
        queue.connection.dispatcher.pause();
        return message.channel.send("Music paused.");
    }
}

function resume(message, queue){
    //console.log("resume");
    if(!message.member.voice.channel){
        return message.channel.send("You have to be in a voice channel to use this function!");
    }
    if(!queue){
        return message.channel.send("The music queue is empty!");
    }
    if(queue.connection.dispatcher.paused){
        queue.connection.dispatcher.resume();
        queue.connection.dispatcher.pause();
        queue.connection.dispatcher.resume();
        return message.channel.send("Music resumed.");
    }
}

module.exports = { play, skip, stop, queue, pause, resume };