// Dependencies
const Discord = require('discord.js'); 
const fs = require('fs');
const config = require('./config.json');
const CatLoggr = require('cat-loggr');
const express = require('express')
const app = express();
const port = 3000

app.get('/', (req, res) => res.send('Bot Ready to go\nByParaformaldead#0404'))

app.listen(port, () =>
console.log(`Your app is listening a http://localhost:${port}`)
);
// Functions
const client = new Discord.Client();
const log = new CatLoggr();


client.commands = new Discord.Collection();


if (config.debug === true) client.on('debug', stream => log.debug(stream)); 
client.on('warn', message => log.warn(message));
client.on('error', error => log.error(error));


const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js')); 
for (const file of commandFiles) {
	const command = require(`./commands/${file}`); 
    log.init(`Loaded command ${file.split('.')[0] === command.name ? file.split('.')[0] : `${file.split('.')[0]} as ${command.name}`}`); 
	client.commands.set(command.name, command); 
};


client.login(process.env.token);

client.once('ready', () => {
	log.info(`logged in as ${client.user.tag}`); 
    client.user.setActivity(`${config.prefix}help │ Infinity Gen`, { type: "PLAYING" }); 
   
});


client.on('message', (message) => {
	if (!message.content.startsWith(config.prefix)) return; 
	if (message.author.bot) return; 
    
	const args = message.content.slice(config.prefix.length).trim().split(/ +/);
	const command = args.shift().toLowerCase();

   
	if (config.command.notfound_message === true && !client.commands.has(command)) {
        return message.channel.send(
            new Discord.MessageEmbed()
            .setColor(config.color.red)
            .setTitle('Command does not exist')
            .setDescription(` I cannot find the \`${command}\` command!`)
            .setFooter('By Paraformaldead#0404')
            .setTimestamp()
        );
    };

    
	try {
		client.commands.get(command).execute(message, args); 
	} catch (error) {
		log.error(error); 
        
		if (config.command.error_message === true) {
            message.channel.send(
                new Discord.MessageEmbed()
                .setColor(config.color.red)
                .setTitle('Error')
                .setDescription(`Error occurred while executing the \`${command}\` command!`)
                .addField('Error', `\`\`\`js\n${error}\n\`\`\``)
                .setFooter('By Paraformaldead#0404')
                .setTimestamp()
            );
        };
	};
});
