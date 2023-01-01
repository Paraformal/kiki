// Dependencies
const { MessageEmbed, Message } = require('discord.js');
const fs = require('fs');
const config = require('../config.json');
const CatLoggr = require('cat-loggr');

// Functions
const log = new CatLoggr();

module.exports = {
	name: 'create', 
	description: 'Create a new service.', 

    /**
     * Command exetute
     * @param {Message} message The message sent by user
     * @param {Array[]} args Arguments splitted by spaces after the command name
     */
	execute(message, args) {
        // Parameters
        const service = args[0];

        
        if (!service) {
            return message.channel.send(
                new MessageEmbed()
                .setColor(config.color.red)
                .setTitle('Missing parameters!')
                .setDescription('You need to give a service name!')
                .setFooter('By Paraformaldead#0404')
                .setTimestamp()
            );
        };

        
        const filePath = `${__dirname}/../stock/${args[0]}.txt`;

        
        fs.writeFile(filePath, '', function (error) {
            if (error) return log.error(error); 

            message.channel.send(
                new MessageEmbed()
                .setColor(config.color.green)
                .setTitle('Service created!')
                .setDescription(`New ${args[0]} service created!`)
                .setFooter('By Paraformaldead#0404')
                .setTimestamp()
            );
        });
    }
};
