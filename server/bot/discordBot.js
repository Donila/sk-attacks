const Discord = require('discord.js');
const client = new Discord.Client();
const Http = require('http');
const Request = require('request');
const moment = require('moment');
const _ = require('lodash');

export default class DiscordBot {
  static init() {
    const discordToken = process.env.DISCORD_TOKEN;
    const skServerUrl = 'http://sk-attacks.herokuapp.com';

    client.on('ready', (obj) => {
      console.log(`Hello! I am sk-attack-bot. I will help you to coordinate your attacks using ${skServerUrl}`);
    });

    client.on('message', message => {
      const skServerUrl = 'http://sk-attacks.herokuapp.com';
    if(message.content.indexOf('!time') > -1) {
        message.reply(`Synchronizing time: ${moment().utc().format('HH:mm:ss')}`);
    }
    if (message.content === '!attack'.trim()) {
        message.reply(`Provide attack link from ${skServerUrl} with the following syntax: !attack link_to_attack`);
      } else {
        if (message.content.startsWith('!attack')) {
          console.log(message);
          let parsed = message.content.split(' ');
          if (parsed.length == 2) {
            let link = parsed[1];
            message.reply(`Checking your link (${link})...`);
            let parsedLink = link.split('/');
            if (parsedLink.length > 0) {
              let attackId = parsedLink[parsedLink.length - 1];
              let url = `${skServerUrl}/api/attacks/${attackId}`;

              let options = {
                method: 'GET',
                url: url,
                headers: {
                  'content-type': 'application/json'
                }
              };

              Request(options, (err, res, body) => {
                let hhMM = 'HH:mm';
                let hhMMss = 'HH:mm:ss';
                if (!err) {
                  let attack = {};
                  try {
                    attack = JSON.parse(body);
                  } catch (e) {
                    console.error('Error in parsing attack json');
                  }
                  if (attack.village && attack.armies && attack.armies.length) {

                    let attackTime = moment(attack.time).utc();

                    message.reply(`Found attack on: ${attack.village}) with ${attack.armies.length} attacks at ${attackTime.format('HH:mm')} server time (UTC): `);

                    let time = moment().utc();
                    message.reply(`Synchronizing time: ${time.format(hhMMss)}`);

                    let armies = _.reverse(_.sortBy(attack.armies, ['timeToTarget', 'delay']));

                    for (let i = 0; i < armies.length; i++) {
                      let army = armies[i];

                      let whenOnTarget = moment(attack.time).utc().add(army.delay, 'seconds');

                      let whenToGo = moment(attack.time).utc().subtract(army.timeToTarget, 'seconds').add(army.delay, 'seconds');

                      let timeToAttack = moment.duration(whenToGo.diff(moment().utc()));

                      if(timeToAttack.seconds() < 0) {
                        timeToAttack = moment.duration(1, 'days').add(timeToAttack);
                      }

                      setTimeout(function() {
                        message.reply(`${attack.village} - ${army.name} - BE READY IN 5 MINUTES!`);
                      }, timeToAttack.asMilliseconds() - 5000 * 60);

                      setTimeout(function() {
                        message.reply(`${attack.village} - ${army.name} - BE READY IN 1 MINUTE!`);
                      }, timeToAttack.asMilliseconds() - 1000 * 60);

                      setTimeout(function() {
                        message.reply(`${attack.village} - ${army.name} - 5.....`);
                      }, timeToAttack.asMilliseconds() - 1000 * 5);
                      setTimeout(function() {
                        message.reply(`${attack.village} - ${army.name} - 4....`);
                      }, timeToAttack.asMilliseconds() - 1000 * 4);
                      setTimeout(function() {
                        message.reply(`${attack.village} - ${army.name} - 3...`);
                      }, timeToAttack.asMilliseconds() - 1000 * 3);
                      setTimeout(function() {
                        message.reply(`${attack.village} - ${army.name} - 2..`);
                      }, timeToAttack.asMilliseconds() - 1000 * 2);
                      setTimeout(function() {
                        message.reply(`${attack.village} - ${army.name} - 1.`);
                      }, timeToAttack.asMilliseconds() - 1000 * 1);
                      setTimeout(function() {
                        message.reply(`${attack.village} - ${army.name} - GO!`);
                      }, timeToAttack.asMilliseconds());

                      message.reply(`${i+1}) ${army.name} - ${whenToGo.format(hhMMss)} -> ${whenOnTarget.format(hhMMss)}, be ready in ${formatTime(timeToAttack.hours())}h ${formatTime(timeToAttack.minutes())}m ${formatTime(timeToAttack.seconds())}s`);
                    }
                  } else {
                    message.reply(`Attack not found`);
                  }
                } else {
                  message.reply(`Attack not found`);
                }
              });
            } else {
              message.reply(`Sorry it's wrong: (${link})...`);
            }
          } else {
            message.reply('I dont understand you.');
          }
        }
      }

    });

    function formatTime(t) {
        if ((t + '').length < 2) {
            return "0" + t;
        } else {
            return t;
        }
    }

    if (discordToken) {
      client.login(discordToken);
    } else {
      console.error('DISCORD_TOKEN env variable is not defined in system');
    }
  }
}



