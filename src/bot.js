require("dotenv").config();

const { Client, WebhookClient } = require('discord.js');

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
      if (args.length !== 3)
        return message.reply("J'ai besoin d'une date, d'une heure, et d'un lieu");
    
        if (message.channel.id !== process.env.WEBHOOK_CHANNEL_ID)
        {
            const channel = client.channels.cache.find(channel => channel.id === message.channel.id)
            const channelWebHook = client.channels.cache.find(channel => channel.id === process.env.WEBHOOK_CHANNEL_ID)

            channel.send("Annonce est dans le salon: #" + channelWebHook.name)
        }
        const WebHookmessage = webhookClient.send("Qui est disponible le:\n " + args[0] + ":" + args[1] + "\nLocalisation: " + args[2])
        .then((message) => {
            message.react("✅");
            message.react("❔");
            message.react("❌");
        
        })
        //WebHookmessage.react("✅");
        //WebHookmessage.react("❔");
        //WebHookmessage.react("❌");
        
        
        
    
    }
  }
});




client.login(process.env.BOT_TOKEN);