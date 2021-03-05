const Discord = require('discord.js'),
	DisTube = require('distube'),
	client = new Discord.Client(),
	config = {
		prefix: "!",
		
	};
const distube = new DisTube(client, { searchSongs: false, emitNewSongOnly: true });

const filters = ["3d","bassboost","echo","karaoke","nightcore","vaporwave", "flanger"];

client.on('ready', () => {
	console.log(`Logged in as ${client.user.tag}`);
});

client.on("message", async (message) => {
	if (message.author.bot) return;
	if(!message.guild) return;
	if (!message.content.startsWith(config.prefix)) return;
	const args = message.content.slice(config.prefix.length).trim().split(/ +/g);
	const command = args.shift();

	if (command == "play" || command == "p"){
		message.channel.send("🔎**Searching**🎶")
		message.channel.send(`🎶**Now Playing!**🎶`)		   		

		return distube.play(message, args.join(" "));
	}

	if (["repeat", 'loop'].includes(command))
		distube.setRepeatMode(message, parseInt(args[0]));

	if (command == "stop") {
		distube.stop(message);
		message.channel.send("❌  ***Stopped***  ❌");
	}

	if(message.content == "?filter") {
		let filter = distube.setFilter(message, command);
		return message.channel.send("Adding filter!")
	}
    
	if (command === "queue" || command === "qu") {
		let queue = distube.getQueue(message)
		let curqueue = queue.songs.map((song, id) =>
		`**${id + 1}**. ${song.name} - \`${song.formattedDuration}\``
		).join("\n");
		
		return message.channel.send("**Current Queue!**\n " + curqueue)
	}

	if (message.member.permissions.has("ADMINISTRATOR" && command === 'skip')) {
		
			embedbuilder(client, message, "YELLOW", "SKIPPED!", `Skipped the song`)
			return distube.skip(message);
		
	}

	if (message.author.has.permissions("ADMINISTRATOR")){
		if (command === "skip") {
			embedbuilder(client, message, "YELLOW", "SKIPPED!", `Skipped the song`)
			return distube.skip(message);
		}
	}

	if (command === "help" || command === "h") {
		embedbuilder(client, message, "BLUE", "Help Menu!", '`!play`  - `Plays a song`\n`!stop` - `Stopps a song`\n`!queue` - `Shows the current queue`\n`!skip` - `Skips the next song in the current queue`\n\nDeveloped by DanteAndHubble');
	}



    const status = (queue) => `Volume: \`${queue.volume}\` | Filter: \`${queue.filter || "OFF"}\` | Loop: \`${queue.repeatMode ? queue.repeatMode === 2 ? "All Queue" : "This Song" : "Off"}\` | Autoplay: \`${queue.autoplay ? "On" : "Off"}\``
	
    
    	


    function embedbuilder(client, message, color, title, description){
    	let embed = new Discord.MessageEmbed()
    	.setColor(color)
    	.setFooter(client.user.username, client.user.displayAvatarURL());
    	if(title) embed.setTitle(title);
    	if(description) embed.setDescription(description);
    	return message.channel.send(embed);
    }
});

client.login(process.env.token);
