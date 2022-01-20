require("dotenv").config();

const { Client, WebhookClient} = require('discord.js');
const Discord = require('discord.js');

const client = new Client({
  partials: ['MESSAGE', 'REACTION']
});

const webhookClient = new WebhookClient(
  process.env.WEBHOOK_ID,
  process.env.WEBHOOK_TOKEN,
);

const PREFIX = ".";

client.on('ready', () => {
  console.log(`${client.user.tag} has logged in.`);
});

client.on('message', async (message) => {
  if (message.author.bot) return;
  if (message.content.startsWith(PREFIX)) {
    const [CMD_NAME, ...args] = message.content
      .trim()
      .substring(PREFIX.length)
      .split(/ +/g);


    if (CMD_NAME === 'ping') {
      message.reply(`Pong ` + args);
    }
    if (CMD_NAME === 'emote') {
      message.reply("\:kongstrong:");
    }
    
    if (CMD_NAME === 'soiree') {
      const hasRole = message.member.roles.cache.filter(role => role.id === process.env.BO_ID 
        || role.ID === process.env.MOITIE_BO_ID 
        || role.ID === process.env.JOKER_BO_ID
        || role.ID === process.env.SMURF_BO_ID
        || role.ID === process.env.BOOMER_BO_ID)

      if(hasRole == null){
        message.reply("Tu ne possèdes pas les rôles nécessaire pour effectuer cette commande")
        return;
      } 

      const channel = client.channels.cache.find(channel => channel.id === message.channel.id)
      const channelWebHook = client.channels.cache.find(channel => channel.id === process.env.WEBHOOK_CHANNEL_ID)
      

      try {
        let [date, heure, lieu] = args;
        
        console.log("Date: " + date);
        console.log("Heure: " + heure);
        console.log("Lieu: " + lieu)


        if (date === null || heure === null || lieu === null) {
          console.log("Un champ est null")
          return message.reply("Mauvais format : .soiree <date> <heure> <lieu>");
        }
        const linkBO = 'https://cdn.discordapp.com/attachments/681533018351075491/783974280273985557/avatars-000307014030-id36vv-t500x500.jpg'
        const MessageEmbed = new Discord.MessageEmbed()
        .setColor('#6b00b3')
	      .setTitle("Une sortie s'organise :                                                                     \u200B")
        .addFields(
          { name: '\u200B', value: '\u200B'},
          { name: date, value: '\u200B', inline: true }, { name: heure, value: '\u200B', inline: true }, { name: lieu, value: '\u200B', inline: true},
        )
        .setFooter(message.author.tag, message.author.avatarURL());
        //.setFooter('Sortie',linkBO);
      
        //webhookClient.send('<@&'+process.env.BO_ID+'>' + ' <@&'+process.env.MOITIE_BO_ID+'>' + ' <@&'+process.env.JOKER_BO_ID+'>')
        webhookClient.send(MessageEmbed)
          .then((message) => {
            channelWebHook.messages.fetch().then((messages) => {
              const webHookMsgReact = messages.find(msg => msg.ID === message.ID)
              webHookMsgReact.react("✅");
              webHookMsgReact.react("❔");
              webHookMsgReact.react("❌");
              webHookMsgReact.react('<a:kongstrong:933816635809210368>');
            })
          })


      if (message.channel.id !== process.env.WEBHOOK_CHANNEL_ID) {

        channel.send("Annonce est dans le salon: #" + channelWebHook.name)
      }
      } catch (error) {
        console.log("Erreur send:\n" + error)
        return message.reply("Mauvais format .soiree <date> <heure> <lieu>");
      }

    }
  }
});

client.login(process.env.BOT_TOKEN);