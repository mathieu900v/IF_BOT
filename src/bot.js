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
      .split(/\s+/);
    if (CMD_NAME === 'qui_vient') {
      const channel = client.channels.cache.find(channel => channel.id === message.channel.id)
      const channelWebHook = client.channels.cache.find(channel => channel.id === process.env.WEBHOOK_CHANNEL_ID)

      if (message.channel.id !== process.env.WEBHOOK_CHANNEL_ID) {

        channel.send("Annonce est dans le salon: #" + channelWebHook.name)
      }
      try {
        const date = args.join(" ").split('date: ')[1].split('heure: ')[0];
        const heure = args.join(" ").split('heure: ')[1].split('lieu: ')[0];
        const lieu = args.join(" ").split('lieu: ')[1];
        
        console.log("Date: " + date);
        console.log("Heure: " + heure);
        console.log("Lieu: " + lieu)


        if (date === null || heure === null || lieu === null) {
          console.log("Un champs est null")
          return message.reply("Mauvais format .qui_vient date: <date> heure: <heure> lieu: <lieu>");
        }
        const linkBO = 'https://cdn.discordapp.com/attachments/681533018351075491/783974280273985557/avatars-000307014030-id36vv-t500x500.jpg'
        const MessageEmbed = new Discord.MessageEmbed()
        .setColor('#0099ff')
	      .setTitle('Bon qui vient !')
        .setAuthor(message.author.tag, linkBO)
        .addFields(
          { name: '\u200B', value: '\u200B' },
          { name: 'Date', value: date, inline: true },
		      { name: 'Heure', value: heure, inline: true },
          { name: 'Lieu', value: lieu},
          { name: '\u200B', value: '\u200B' },
        )
        .setThumbnail(linkBO)
        .setFooter('Prochaine sortie',linkBO);
      

        webhookClient.send(MessageEmbed)
          .then((message) => {
            channelWebHook.messages.fetch().then((messages) => {
              const webHookMsgReact = messages.find(msg => msg.ID === message.ID)
              webHookMsgReact.react("✅");
              webHookMsgReact.react("❔");
              webHookMsgReact.react("❌");
            })
          })
      } catch (error) {
        console.log("Erreur send:\n" + error)
        return message.reply("Mauvais format .qui_vient date: <date> heure: <heure> lieu: <lieu>");
      }







    }
  }
});




client.login(process.env.BOT_TOKEN);