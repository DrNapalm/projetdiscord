const Discord = require('discord.js');
const fs = require ('fs');
const warns = JSON.parse(fs.readFileSync('./warns.json'));
const client = new Discord.Client();





let prefix = ":"
let liste = "Je connais : Merci, Dab, Cancer, Bouh, Credoz, Colin, ChrisRoumi, Boulhal, Adrien et Oualid."





client.on('ready', function () {
  console.log("Je suis connecté !");
});

client.login("NTg1ODA1NzQ3NDY4NjMyMDg0.XQAJVA.a-B8xyI_kQGZB1G_634Ue8Vm3HM");

//arrivé personne
client.on('guildMemberAdd', function (member) {
  let embed = new Discord.RichEmbed()
      .setDescription(':tada: ** ' + member.user.username + '** a rejoint ' + member.guild.name + ' :tada:')
      .setFooter('Nous sommes désormais ' + member.guild.memberCount)
  member.guild.channels.get('372046276050812942').send(embed)
})

//depart personne
client.on('guildMemberRemove', function (member) {
  let embed = new Discord.RichEmbed()
      .setDescription(':tada: ** ' + member.user.username + '** a quitté ' + member.guild.name + ' :tada:')
      .setFooter('Nous sommes désormais ' + member.guild.memberCount)
  member.guild.channels.get('372046276050812942').send(embed)
})

//clear
client.on('message', function (message) {
  if (!message.guild) return
  let args = message.content.trim().split(/ +/g);

  if (args[0].toLowerCase() === prefix + "clear") {
      if (!message.member.hasPermission('MANAGE_MESSAGES')) return message.channel.send("Vous n'avez pas la permission d'utiliser cette commande");
      let count = args[1];
      if (!count) return message.channel.send("Veuillez indiquer un nombre de messages à supprimer");
      if (isNaN(count)) return message.channel.send("Veuillez indiquer un nombre valide");
      if (count < 1 || count > 100) return message.channel.send("Veuillez indiquer un nombre entre 1 et 100");
      message.channel.bulkDelete(parseInt(count) + 1);
      message.channel.sendMessage("Voilà chef j'ai supprimé " + count + " messages.:thumbsup:");

  }

  //mute
  if (args[0].toLowerCase() === prefix + "mute") {
      if (!message.member.hasPermission('MANAGE_MESSAGES')) return message.channel.send("Vous n'avez pas la permission d'utiliser cette commande");
      let member = message.mentions.members.first();
      if (!member) return message.channel.send("Membre introuvable");
      if (member.highestRole.calculatedPosition >= message.member.highestRole.calculatedPosition && message.author.id !== message.guild.ownerID) return message.channel.send("Vous ne pouvez pas mute ce membre");
      if (member.highestRole.calculatedPosition >= message.guild.me.highestRole.calculatedPosition || member.id === message.guild.ownerID) return message.channel.send("Je ne peux pas mute ce membre");
      let muterole = message.guild.roles.find(role => role.name === 'Muted');
      if (muterole) {
          member.addRole(muterole);
          message.channel.send(member + ' a été mute :white_check_mark:');
      }
      else {
          message.guild.createRole({name: 'Muted', permissions: 0}).then(function (role) {
              message.guild.channels.filter(channel => channel.type === 'text').forEach(function (channel) {
                  channel.overwritePermissions(role, {
                      SEND_MESSAGES: false
                  });
              });
              member.addRole(role);
              message.channel.send(member + ' a été mute :white_check_mark:');
          });
      }
  }

})
client.on("message", function (message) {
  if (!message.guild) return
  let args = message.content.trim().split(/ +/g);

  //warn
  if (args[0].toLowerCase() === prefix + "warn") {
      if (!message.member.hasPermission('MANAGE_MESSAGES')) return message.channel.send("Vous n'avez pas la permission d'utiliser cette commande.");
      let member = message.mentions.members.first();
      if (!member) return message.channel.send("Veuillez mentionner un membre.");
      if (member.highestRole.calculatedPosition >= message.member.highestRole.calculatedPosition && message.author.id !== message.guild.ownerID) return message.channel.send("Vous ne pouvez pas warn ce membre.");
      let reason = args.slice(2).join(' ');
      if (!reason) return message.channel.send("Veuillez indiquer une raison.");
      if (!warns[member.id]) {
          warns[member.id] = []
      }
      warns[member.id].unshift({
          reason: reason,
          date: Date.now(),
          mod: message.author.id
      })
      fs.writeFileSync('./warns.json', JSON.stringify(warns))
      message.channel.send(member + " a été warn pour " + reason + " :white_check_mark:")
  }

  //infraction
  if (args[0].toLowerCase() === prefix + "infractions") {
      if (!message.member.hasPermission('MANAGE_MESSAGES')) return message.channel.send("Vous n'avez pas la permission d'utiliser cette commande")
      let member = message.mentions.members.first()
      if (!member) return message.channel.send("Veuillez mentionner un membre")
      let embed = new Discord.RichEmbed()
          .setAuthor(member.user.username, member.user.displayAvatarURL)
          .addField('10 derniers warns', ((warns[member.id] && warns[member.id].length) ? warns[member.id].slice(0, 10).map(e => e.reason) : "Ce membre n'a aucun warns"))
          .setTimestamp()
      message.channel.send(embed)
  }
})
client.on("message", function (message) {
  if (!message.guild) return
  let args = message.content.trim().split(/ +/g);

  //unmute
  if (args[0].toLowerCase() === prefix + "unmute") {
      if(!message.member.hasPermission('MANAGE_MESSAGES')) return message.channel.send("Vous n'avez pas la permission d'utiliser cette commande.");
      let member = message.mentions.members.first();
      if(!member) return message.channel.send("Membre introuvable");
      if(member.highestRole.calculatedPosition >= message.member.highestRole.calculatedPosition && message.author.id !== message.guild.ownerID) return message.channel.send("Vous ne pouvez pas unmute ce membre.");
      if(member.highestRole.calculatedPosition >= message.guild.me.highestRole.calculatedPosition || member.id === message.guild.ownerID) return message.channel.send("Je ne pas unmute ce membre.");
      let muterole = message.guild.roles.find(role => role.name === 'Muted');
      if(muterole && member.roles.has(muterole.id)) member.removeRole(muterole);
      message.channel.send(member + ' a été unmute :white_check_mark:');
  }

  //unwarn
  if (args[0].toLowerCase() === prefix + "unwarn") {
      let member = message.mentions.members.first();
      if(!message.member.hasPermission('MANAGE_MESSAGES')) return message.channel.send("Vous n'avez pas la permission d'utiliser cette commande.");
      if(!member) return message.channel.send("Membre introuvable");
      if(member.highestRole.calculatedPosition >= message.member.highestRole.calculatedPosition && message.author.id !== message.guild.ownerID) return message.channel.send("Vous ne pouvez pas unwarn ce membre.");
      if(member.highestRole.calculatedPosition >= message.guild.me.highestRole.calculatedPosition || member.id === message.guild.ownerID) return message.channel.send("Je ne pas unwarn ce membre.");
      if(!warns[member.id] || !warns[member.id].length) return message.channel.send("Ce membre n'a actuellement aucun warns.");
      warns[member.id].shift();
      fs.writeFileSync('./warns.json', JSON.stringify(warns));
      message.channel.send("Le dernier warn de " + member + " a été retiré :white_check_mark:");
  }
})

client.on('message', message =>{
  if(message.content === prefix + "bouh"){
    message.channel.sendMessage(":scream: J'ai peur :scream:");
   
  }
})
client.on('message', message =>{
  if(message.content === prefix + "Bouh"){
    message.channel.sendMessage(":scream: J'ai peur :scream:");
   
  }
})
client.on('message', message =>{
  if(message.content === prefix + "Merci"){
    message.channel.sendMessage('De rien sale merde.');
    console.log('De rien');
  }
})
client.on('message', message =>{
  if(message.content === prefix + "merci"){
    message.channel.sendMessage('De rien sale merde.');
    console.log('De rien');
  }
})
client.on('message', message =>{
  if(message.content === prefix + "Oualid"){
    message.channel.sendMessage('Répète ça et je te ban pour harcelement verbale !');
    console.log('Répond a Oualid');
  }
})
client.on('message', message =>{
  if(message.content === prefix + "sale Cancer"){
    message.channel.sendMessage("C'est toi le cancer du cul. :middle_finger: ");
    console.log('Répond a Cancer');
  }
})
client.on('message', message =>{
  if(message.content === prefix + "sale cancer"){
    message.channel.sendMessage("C'est toi le cancer du cul. :middle_finger: ");
  }
})
client.on('message', message =>{
  if(message.content === prefix + "Credoz"){
    message.channel.sendMessage("C'est le plus beau et le plus fort de tous les êtres humains !! :heart:");
  }
})
client.on('message', message =>{
  if(message.content === prefix + "credoz"){
    message.channel.sendMessage("On met une majuscule aux noms propres !:triumph: ");
  }
})
client.on('message', message =>{
  if(message.content === prefix + "colin"){
    message.channel.sendMessage("我是鱼的儿子");
  }
})
client.on('message', message =>{
  if(message.content === prefix + "Colin"){
    message.channel.sendMessage("我是鱼的儿子");
  }
})
client.on('message', message =>{
  if(message.content === prefix + "dab"){
    message.reply('Tu dab :stuck_out_tongue_closed_eyes:.');
  }
})
client.on('message', message =>{
  if(message.content === prefix + "Cancer"){
    message.channel.sendMessage("C'est toi le cancer du cul. :middle_finger: ");
    console.log('Répond a Cancer');
  }
})
client.on('message', message =>{
  if(message.content === prefix + "cancer"){
    message.channel.sendMessage("C'est toi le cancer du cul. :middle_finger: ");
    console.log('Répond a Cancer');
  }
})
client.on('message', message =>{
  if(message.content === prefix + "Dab"){
    message.reply('Tu dab :stuck_out_tongue_closed_eyes:.');
  }
})
client.on('message', message =>{
  if(message.content === prefix + "DAB"){
    message.reply('Tu dab :stuck_out_tongue_closed_eyes:.');
  }
})
client.on('message', message =>{
  if(message.content === prefix + "oualid"){
    message.channel.sendMessage('Répète ça et je te ban pour harcelement verbale !');
    console.log('Répond a Oualid');
  }
})
client.on('message', message =>{
  if(message.content === prefix + "liste"){
    message.channel.sendMessage(liste);
    message.channel.sendMessage("Mais j'en apprend tous les jours grâce à mon maître, le ministre du parti Nazi.");
  }
})
client.on('message', message =>{
  if(message.content === prefix + "Liste"){
    message.channel.sendMessage(liste);
    message.channel.sendMessage("Mais j'en apprend tous les jours grâce à mon maître, le ministre du parti Nazi.");
  }
})
client.on('message', message =>{
  if(message.content === prefix + "ChrisRoumi"){
    message.channel.sendMessage(':money_mouth: :money_with_wings: :moneybag: :moneybag: :moneybag: :money_with_wings: :money_mouth:');
  }
})
client.on('message', message =>{
  if(message.content === prefix + "chrisroumi"){
    message.channel.sendMessage(':money_mouth: :money_with_wings: :moneybag: :moneybag: :moneybag: :money_with_wings: :money_mouth:');
  }
})
client.on('message', message =>{
  if(message.content === prefix + "Chrisroumi"){
    message.channel.sendMessage(':money_mouth: :money_with_wings: :moneybag: :moneybag: :moneybag: :money_with_wings: :money_mouth:');
  }
})
client.on('message', message =>{
  if(message.content === prefix + "Boulhal"){
    message.channel.sendMessage('أنا إرهابي مؤكد');
  }
})
client.on('message', message =>{
  if(message.content === prefix + "boulhal"){
    message.channel.sendMessage('أنا إرهابي مؤكد');
  }
})
client.on('message', message =>{
  if(message.content === prefix + "bouhlal"){
    message.channel.sendMessage('أنا إرهابي مؤكد');
  }
})
client.on('message', message =>{
  if(message.content === prefix + "adrien"){
    message.channel.sendMessage("C'est un gentil Africain qui dit qu'il y a des arabes en éthiopie, mais entre nous, tout le monde s'en bat les couilles.");
  }
})
client.on('message', message =>{
  if(message.content === prefix + "Adrien"){
    message.channel.sendMessage("C'est un gentil Africain qui dit qu'il y a des arabes en éthiopie, mais entre nous, tout le monde s'en bat les couilles.");
  }
})
client.on('message', message =>{
  if(message.content === prefix + "Arnaud"){
    message.channel.sendMessage("C'est un Ethiopien Blanc, qui va vivre au milieu des noirs.");
  }
})
client.on('message', message =>{
  if(message.content === prefix + "arnaud"){
    message.channel.sendMessage("C'est un Ethiopien Blanc, qui va vivre au milieu des noirs.");
  }
})
client.on('message', message => {
  if(message.content === prefix + "help"){
    message.channel.sendMessage("*** Salut, si tu t'ennuies fais : __ §liste __ pour découvrir ce que je faire. ***")
    message.channel.sendMessage("*** Pour ajouter des choses a dire contact Joseph Goebbels. ***")
  }
});
