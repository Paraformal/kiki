// Dependencies
const { MessageEmbed, Message } = require('discord.js');
const fs = require('fs');
const config = require('../config.json');
const CatLoggr = require('cat-loggr');

// Functions
const log = new CatLoggr();
const generated = new Set();

module.exports = {
	name: 'gen', 
	description: 'Generate an account.', 
    /**
     * Command exetute
     * @param {Message} message The message sent by user
     * @param {Array[]} args Arguments splitted by spaces after the command name
     */
	execute(message, args) {
        
        try {
            message.client.channels.cache.get(config.genChannel).id; 
        } catch (error) {
            if (error) log.error(error); 
            
            if (config.command.error_message === true) {
                return message.channel.send(
                    new MessageEmbed()
                    .setColor(config.color.red)
                    .setTitle('Error occured!')
                    .setDescription('Not a valid gen channel specified!')
                    .setFooter('By Paraformaldead#0404')
                    .setTimestamp()
                );
            } else return;
        };

        
        if (message.channel.id === config.genChannel) {
           
            if (generated.has(message.author.id)) {
                return message.channel.send(
                    new MessageEmbed()
                    .setColor(config.color.red)
                    .setTitle('Cooldown!')
                    .setDescription('Please wait **2m** before executing that command again!')
                    .setFooter('By Paraformaldead#0404')
                    .setTimestamp()
                );
            } else {
                
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

                
                fs.readFile(filePath, function (error, data) {
                    
                    if (!error) {
                        data = data.toString(); 
                        const position = data.toString().indexOf('\n'); 
                        const firstLine = data.split('\n')[0]; 

                        // If the service file is empty
                        if (position === -1) {
                            return message.channel.send(
                                new MessageEmbed()
                                .setColor(config.color.red)
                                .setTitle('Generator error!')
                                .setDescription(` \`${args[0]}\` service not found`)
                                .setFooter('By Paraformaldead#0404')
                                .setTimestamp()
                            );
                        };

                        // Send messages to the user
                        message.author.send(
                            new MessageEmbed()
                            .setColor(config.color.green)
                            .setTitle('Generated account')
                            .addField('Service', `\`\`\`${args[0][0].toUpperCase()}${args[0].slice(1).toLowerCase()}\`\`\``, true)
                            .addField('Account', `\`\`\`${firstLine}\`\`\``, true)
                            .setTimestamp()
                        )

                        // Send message to the channel if the user recieved the message
                        if (position !== -1) {
                            data = data.substr(position + 1); // Remove the gernerated account line
                            
                            // Write changes
                            fs.writeFile(filePath, data, function (error) {
                                message.channel.send(
                                    new MessageEmbed()
                                    .setColor(config.color.green)
                                    .setTitle('Account generated seccessfully!')
                                    .setDescription(`Check your private ${message.author}! *If you do not recieved the message, please unlock your private!*`)
                                    .setFooter('By Paraformaldead#0404')
                                    .setTimestamp()
                                );

                                generated.add(message.author.id); // Add user to the cooldown set

                                // Set cooldown time
                                setTimeout(() => {
                                    generated.delete(message.author.id); // Remove the user from the cooldown set after expire
                                }, config.genCooldown);

                                if (error) return log.error(error); // If an error occured, log to console
                            });
                        } else {
                            // If the service is empty
                            return message.channel.send(
                                new MessageEmbed()
                                .setColor(config.color.red)
                                .setTitle('Generator error!')
                                .setDescription(`The \`${args[0]}\` service is empty!`)
                                .setFooter('By Paraformaldead#0404')
                                .setTimestamp()
                            );
                        };
                    } else {
                        // If the service does not exists
                        return message.channel.send(
                            new MessageEmbed()
                            .setColor(config.color.red)
                            .setTitle('Generator error!')
                            .setDescription(`Service \`${args[0]}\` does not exist!`)
                            .setFooter('By Paraformaldead#0404')
                            .setTimestamp()
                        );
                    };
                });
            };
        } else {
            // If the command executed in another channel
            message.channel.send(
                new MessageEmbed()
                .setColor(config.color.red)
                .setTitle('Wrong command usage!')
                .setDescription(`You cannot use the \`gen\` command in this channel! Try it in <#${config.genChannel}>!`)
                .setFooter('By Paraformaldead#0404')
                .setTimestamp()
            );
        };
	}
};
