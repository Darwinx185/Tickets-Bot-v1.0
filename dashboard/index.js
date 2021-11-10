const express = require("express");
const url = require("url");
const path = require("path");
const Discord = require("discord.js");
const ejs = require("ejs");
const passort = require("passport");
const bodyParser = require("body-parser");
const Strategy = require("passport-discord").Strategy;
const Settings = require("./settings.json");
const passport = require("passport");
const moment = require("moment");

const mong = require("./untiles/mongoose.js"); mong.init();
const mongoose = require('mongoose');
const Guildsettings = require('./models/guild.js');
const PanelUsers = require('./models/PanelUsers.js');
const GuildPanels = require('./models/GuildPanels.js');
const { config } = require("process");
const { lutimesSync } = require("fs");

let selectedColor = "#e0409c"

module.exports = client => {
    //WEBSITE CONFIG BACKEND
    const app = express();
    const session = require("express-session");
    const MemoryStore = require("memorystore")(session);


    //Initalize the Discord Login
    passport.serializeUser((user, done) => done(null, user))
    passport.deserializeUser((obj, done) => done(null, obj))
    passport.use(new Strategy({
        clientID: Settings.config.clientID,
        clientSecret: process.env.secret || Settings.config.secret,
        callbackURL: Settings.config.callback,
        scope: ["identify", "guilds"]
    },
        (accessToken, refreshToken, profile, done) => {
            process.nextTick(() => done(null, profile))
        }
    ))

    app.use(session({
        store: new MemoryStore({ checkPeriod: 86400000 }),
        secret: `#@%#&^$^$%@$^$&%#$%@#$%$^%&$%^#$%@#$%#E%#%@$FEErfgr3g#%GT%536c53cc6%5%tv%4y4hrgrggrgrgf4n`,
        resave: false,
        saveUninitialized: false
    }))

    // MIDDLEWARES 
    app.use(passport.initialize());
    app.use(passport.session());

    app.set("view engine", "ejs");
    app.set("views", path.join(__dirname, "./views"));


    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({
        extended: true
    }));
    app.use(express.json());
    app.use(express.urlencoded({
        extended: true
    }));
    //Loading css files
    app.use(express.static(path.join(__dirname, "./public")));

    const checkAuth = (req, res, next) => {
        if (req.isAuthenticated()) return next();
        req.session.backURL = req.url;
        res.redirect("/login");
    }
    app.get("/login", (req, res, next) => {
        if (req.session.backURL) {
            req.session.backURL = req.session.backURL
        } else if (req.headers.referer) {
            const parsed = url.parse(req.headers.referer);
            if (parsed.hostname == app.locals.domain) {
                req.session.backURL = parsed.path
            }
        } else {
            req.session.backURL = "/"
        }
        next();
    }, passport.authenticate("discord", { prompt: "none" })
    );

    app.get("/callback", passport.authenticate("discord", { failureRedirect: "/" }), async (req, res) => {
        res.redirect("/")
    });
    app.get("/logout", function (req, res) {
        req.session.destroy(() => {
            req.logout();
            res.redirect("/");
        })
    })

    app.get("/", (req, res) => {
        if (req.user) {
            PanelUsers.findOne({
                userID: req.user.id
            }, async (err, U) => {
                if (err) console.error(err);
                if (!U) {
                    const newUser = new PanelUsers({
                        _id: mongoose.Types.ObjectId(),
                        userID: req.user.id,
                        lang: "en",
                        mode: "dark"
                    });
                    await newUser.save();
                    console.log(`${req.user.username} Saved`)
                    return res.redirect("/")
                }
                await console.log(U)
                res.render("index", {
                    config: { av: Settings.bot.avatar, name: Settings.bot.name, lang: "ar", mode: "dark" },
                    req: req,
                    member: { id: req.user.id, user: { username: req.user.username, avatar: req.user.avatar } },
                    user: req.isAuthenticated() ? req.user : null,
                    bot: client,
                    Permissions: Discord.Permissions,
                    botconfig: Settings.website,
                    domain: Settings.domain,
                    callback: Settings.config.callback,
                })
            })
        } else {
            res.render("index2", {
                config: { av: Settings.bot.avatar, name: Settings.bot.name, lang: "ar", mode: "dark" },
                req: req,
                user: req.isAuthenticated() ? req.user : null,
                bot: client,
                Permissions: Discord.Permissions,
                botconfig: Settings.website,
                domain: Settings.domain,
                callback: Settings.config.callback,
            })

        }
    });


    app.get("/dashboard", (req, res) => {
        if (!req.isAuthenticated() || !req.user)
            return res.render("dashboard2", {
                config: { av: Settings.bot.avatar, name: Settings.bot.name, lang: "ar", mode: "dark" },

                req: req,
                user: req.isAuthenticated() ? req.user : null,
                bot: client,
                Permissions: Discord.Permissions,
                botconfig: Settings.website,
                callback: Settings.config.callback,
            });
        if (!req.user.guilds) return;
        res.render("dashboard", {
            config: { av: Settings.bot.avatar, name: Settings.bot.name, lang: "ar", mode: "dark" },

            member: { user: { id: req.user.id, avatar: req.user.avatar, username: req.user.username }, id: req.user.id },
            req: req,
            user: req.isAuthenticated() ? req.user : null,
            bot: client,
            Permissions: Discord.Permissions,
            botconfig: Settings.website,
            callback: Settings.config.callback,
        })
    })
    app.get("/dashboard/:guildID/setup", checkAuth, async (req, res) => {
        Settings
        const guild = client.guilds.cache.get(req.params.guildID)
        if (!guild) return res.render(`ReqSetup`, {
            config: { av: Settings.bot.avatar, name: Settings.bot.name, lang: "ar", mode: "dark" },

            info: { colorG: selectedColor, colorS: "#fff", colorH: "#fff" },
            member: { user: { id: req.user.id, avatar: req.user.avatar, username: req.user.username }, id: req.user.id },
            link: `https://discordapp.com/oauth2/authorize?client_id=${client.user.id}&scope=bot%20applications.commands&guild_id=${req.params.guildID}&response_type=code&redirect_uri=${Settings.config.callback}`
            , user: req.isAuthenticated() ? req.user : null,
            domain: Settings.website.domain,
            Permissions: Discord.Permissions,
            botconfig: Settings.website,
            bot: client,
            callback: Settings.config.callback,
        })
        let member = guild.members.cache.get(req.user.id);
        if (!member) {
            try {
                member = await guild.members.fetch(req.user.id);
            } catch {

            }
        }
        if (!member)
            return res.redirect("/")
        if (!member.permissions.has(Discord.Permissions.FLAGS.MANAGE_GUILD))
            return res.redirect("/");
        Guildsettings.findOne({
            guildID: guild.id
        }, async (err, GG) => {
            if (err) console.error(err);
            let colorG = "#fff"; let colorS = selectedColor; let colorH = "#fff";
            let Role = guild.roles.cache.find(r => r.id == GG.suprole);
            if (!Role) Role = { name: "Please Select Role" }
            let catt = guild.channels.cache.find(r => r.id == GG.category);
            if (!catt) catt = { name: "Please Select Category" };
            let loG = guild.channels.cache.find(r => r.id == GG.log);
            if (!loG) loG = { name: "Please Select Channel" };
            let Trans = guild.channels.cache.find(r => r.id == GG.transcript);
            if (!Trans) Trans = { name: "Please Select Channel" };

            if (GG.auto) {
                if (GG.auto == "3") { Auto1 = "Off"; Auto2 = "After Closing The Ticket"; Auto3 = "While Deleting The Ticket" };
                if (GG.auto == "1") { Auto1 = "After Closing"; Auto2 = "While Deleting The Ticket"; Auto3 = "Off" };
                if (GG.auto == "2") { Auto1 = "While Deleting"; Auto2 = "After Closing The Ticket"; Auto3 = "Off" };

            } else { Auto1 = "Off"; Auto2 = "After Closing The Ticket"; Auto3 = "While Deleting The Ticket" }

            if (GG.prv == "3") { prv1 = "Off"; prv2 = "Just Notice The Member"; prv3 = "Send Transcript" };
            if (GG.prv == "2") { prv1 = "Transcript"; prv2 = "Just Notice The Member"; prv3 = "Off" };
            if (GG.prv == "1") { prv1 = "Notice The Member"; prv2 = "Send Transcript"; prv3 = "Off" };

            if (GG.claim) {
                if (GG.claim == "3") {
                    claim1 = "Off"; claim2 = "Disable SEND_MESSAGES"; claim3 = "Disable VIEW_CHANNEL";
                }
                if (GG.claim == "2") {
                    claim1 = "Disable SEND_MESSAGES"; claim2 = "Disable VIEW_CHANNEL"; claim3 = "Off";
                }
                if (GG.claim == "3") {
                    claim1 = "Disable VIEW_CHANNEL"; claim2 = "Disable SEND_MESSAGES"; claim3 = "Off";
                }

            } else {
                claim1 = "Off"; claim2 = "Disable SEND_MESSAGES"; claim3 = "Disable VIEW_CHANNEL";
            }

            res.render("setup", {
                config: { av: Settings.bot.avatar, name: Settings.bot.name, lang: "ar", mode: "dark" },

                info: {
                    colorG: colorG, colorS: colorS, colorH: colorH,
                    Rname: Role.name, Cname: catt.name, Lname: loG.name, Tname: Trans.name,
                    Auto1: Auto1, Auto2: Auto2, Auto3: Auto3,
                    prv1: prv1, prv2: prv2, prv3: prv3,
                    claim1: claim1, claim2: claim2, claim3: claim3

                },
                member: member,
                data: GG,
                req: req,
                user: req.isAuthenticated() ? req.user : null,
                guild: guild,
                bot: client,
                domain: Settings.website.domain,
                Permissions: Discord.Permissions,
                botconfig: Settings.website,
                callback: Settings.config.callback,
            })


        })
    });
    app.get("/dashboard/:guildID/history", checkAuth, async (req, res) => {
        Settings
        const guild = client.guilds.cache.get(req.params.guildID)
        if (!guild)
            return res.render(`ReqSetup`, {
                config: { av: Settings.bot.avatar, name: Settings.bot.name, lang: "ar", mode: "dark" },

                info: { colorG: selectedColor, colorS: "#fff", colorH: "#fff" },
                member: { user: { id: req.user.id, avatar: req.user.avatar, username: req.user.username }, id: req.user.id },
                link: `https://discordapp.com/oauth2/authorize?client_id=${client.user.id}&scope=bot%20applications.commands&guild_id=${req.params.guildID}&response_type=code&redirect_uri=${Settings.config.callback}`
                , user: req.isAuthenticated() ? req.user : null,
                domain: Settings.website.domain,
                Permissions: Discord.Permissions,
                botconfig: Settings.website,
                bot: client,
                callback: Settings.config.callback,
            })
        let member = guild.members.cache.get(req.user.id);
        if (!member) {
            try {
                member = await guild.members.fetch(req.user.id);
            } catch {

            }
        }
        if (!member)
            return res.redirect("/")
        if (!member.permissions.has(Discord.Permissions.FLAGS.MANAGE_GUILD))
            return res.redirect("/");
        Guildsettings.findOne({
            guildID: guild.id
        }, async (err, GG) => {
            if (err) console.error(err);
            let list = [].sort()
            if (GG) {
                if (GG.tickets) {
                    let Z = false;
                    await GG.tickets.sort((a, b) => {
                        if (a.date > b.date) return 1;
                        if (a.date < b.date) return -1;
                        // return 0;
                    }).forEach(async Tick => {
                        let N = "undefined :("; let A = "https://cdn.discordapp.com/embed/avatars/4.png";
                        // console.log(Tick.member)
                        let M = await guild.members.fetch(Tick.member).catch(err => null);
                        if (M) {
                            console.log(M.user.username)
                            N = `${M.user.username}#${M.user.discriminator}`;
                            if (M.user.avatar !== null) A = `https://cdn.discordapp.com/avatars/${M.user.id}/${M.user.avatar}.png`;
                            list.push({ N: N, A: A, url: Tick.url, date: moment(Tick.date).format('l h:mm:ss a') });
                        }
                    })
                    setTimeout(() => {
                        res.render(`history`, {
                            config: { av: Settings.bot.avatar, name: Settings.bot.name, lang: "ar", mode: "dark" },

                            info: { colorG: "#fff", colorS: "#fff", colorH: selectedColor },
                            list: list,
                            member: member,
                            req: req,
                            user: req.isAuthenticated() ? req.user : null,
                            guild: guild,
                            bot: client,
                            domain: Settings.website.domain,
                            Permissions: Discord.Permissions,
                            botconfig: Settings.website,
                            callback: Settings.config.callback,

                        })
                    }, 1000);
                }
            }

        });
    });

    app.get("/dashboard/:guildID", checkAuth, async (req, res) => {
        Settings
        const guild = client.guilds.cache.get(req.params.guildID)
        if (!guild)
            return res.render(`ReqSetup`, {
                config: { av: Settings.bot.avatar, name: Settings.bot.name, lang: "ar", mode: "dark" },

                info: { colorG: selectedColor, colorS: "#fff", colorH: "#fff" },
                member: { user: { id: req.user.id, avatar: req.user.avatar, username: req.user.username }, id: req.user.id },
                link: `https://discordapp.com/oauth2/authorize?client_id=${client.user.id}&scope=bot%20applications.commands&guild_id=${req.params.guildID}&response_type=code&redirect_uri=${Settings.config.callback}`
                , user: req.isAuthenticated() ? req.user : null,
                domain: Settings.website.domain,
                Permissions: Discord.Permissions,
                botconfig: Settings.website,
                bot: client,
                callback: Settings.config.callback,
            })

        let member = guild.members.cache.get(req.user.id);
        if (!member) {
            try {
                member = await guild.members.fetch(req.user.id);
            } catch {

            }
        }
        if (!member)
            return res.redirect("/")
        if (!member.permissions.has(Discord.Permissions.FLAGS.MANAGE_GUILD))
            return res.redirect("/");
        Guildsettings.findOne({
            guildID: guild.id
        }, async (err, GG) => {
            if (err) console.error(err);
            let colorG = selectedColor; let colorS = "#fff"; let colorH = "#fff"
            let lang1; let lang2;
            if (GG.lang == "ar") { lang1 = "Arabic"; lang2 = "English"; }
            if (GG.lang == "en") { lang1 = "English"; lang2 = "Arabic"; }

            res.render("settings", {
                config: { av: Settings.bot.avatar, name: Settings.bot.name, lang: "ar", mode: "dark" },

                info: {
                    colorG: colorG, colorS: colorS, colorH: colorH,
                    lang1: lang1, lang2: lang2
                },
                member: member,
                data: GG,
                req: req,
                user: req.isAuthenticated() ? req.user : null,
                guild: guild,
                bot: client,
                domain: Settings.website.domain,
                Permissions: Discord.Permissions,
                botconfig: Settings.website,
                callback: Settings.config.callback,
            })
        });
    })

    app.post("/dashboard/:guildID", checkAuth, async (req, res) => {
        const guild = client.guilds.cache.get(req.params.guildID)
        if (!guild)
            return res.redirect("/")
        let member = guild.members.cache.get(req.user.id);
        if (!member) {
            try {
                member = await guild.members.fetch(req.user.id);
            } catch {

            }
        }
        if (!member)
            return res.redirect("/")
        if (!member.permissions.has(Discord.Permissions.FLAGS.MANAGE_GUILD))
            return res.redirect("/");

        let lang1; let lang2;
        if (req.body.lang == "Arabic") { lang1 = "Arabic"; lang2 = "English"; req.body.lang = "ar"; }
        if (req.body.lang == "English") { lang1 = "English"; lang2 = "Arabic"; req.body.lang = "en"; }

        Guildsettings.findOne({
            guildID: guild.id
        }, async (err, settings) => {
            if (!settings) return; if (req.body.prefix) {
                settings.updateOne({ prefix: req.body.prefix }).then(result => { });
            }
            if (settings.lang !== req.body.lang) settings.updateOne({ lang: req.body.lang }).then(result => { });

            let colorG = selectedColor; let colorS = "#fff"; let colorH = "#fff"

            res.render("settings", {
                info: { colorG: colorG, colorS: colorS, colorH: colorH, lang1: lang1, lang2: lang2 },
                member: member,
                data: req.body,
                req: req,
                user: req.isAuthenticated() ? req.user : null,
                guild: guild,
                bot: client,
                domain: Settings.website.domain,

                Permissions: Discord.Permissions,
                botconfig: Settings.website,
                callback: Settings.config.callback,
            });

        });
    })

    app.post("/dashboard/:guildID/:option", checkAuth, async (req, res) => {
        const guild = client.guilds.cache.get(req.params.guildID)
        if (!guild)
            return res.redirect("/")
        let member = guild.members.cache.get(req.user.id);
        if (!member) {
            try {
                member = await guild.members.fetch(req.user.id);
            } catch {

            }
        }
        if (!member)
            return res.redirect("/")
        if (!member.permissions.has(Discord.Permissions.FLAGS.MANAGE_GUILD))
            return res.redirect("/");

        if (!["tickets", "setup"].includes(req.params.option)) return console.log("error " + req.body.option);
        Guildsettings.findOne({
            guildID: guild.id
        }, async (err, settings) => {
            if (!settings) return;
            let colorG = "#fff"; let colorS = "#fff"; let colorH = "#fff";
            if (req.params.option == "setup") { colorS = selectedColor; }
            if (req.params.option == "history") { colorH = selectedColor }
            if (!req.body.prefix) req.body.prefix = settings.prefix
            if (req.params.option == "setup") {
                if (req.body.prv == "Off") {
                    settings.updateOne({ prv: 3 }).then(result => { });
                    prv1 = "Off"; prv2 = "Just Notice The Member"; prv3 = "Send Transcript"
                }
                if (req.body.prv == "Just Notice The Member") {
                    settings.updateOne({ prv: 1 }).then(result => { });
                    prv1 = "Notice The Member"; prv2 = "Send Transcript"; prv3 = "Off"
                }
                if (req.body.prv == "Send Transcript") {
                    settings.updateOne({ prv: 2 }).then(result => { });
                    prv1 = "Transcript"; prv2 = "Just Notice The Member"; prv3 = "Off";
                } if (req.body.Claim == "Off") {
                    settings.updateOne({ claim: 3 }).then(result => { });
                    claim1 = "Off"; claim2 = "Disable SEND_MESSAGES"; claim3 = "Disable VIEW_CHANNEL";
                }
                if (req.body.Claim == "Disable SEND_MESSAGES") {
                    settings.updateOne({ claim: 2 }).then(result => { });
                    claim1 = "Disable SEND_MESSAGES"; claim2 = "Disable VIEW_CHANNEL"; claim3 = "Off";
                }
                if (req.body.Claim == "Disable VIEW_CHANNEL") {
                    settings.updateOne({ claim: 1 }).then(result => { });
                    claim1 = "Disable VIEW_CHANNEL"; claim2 = "Disable SEND_MESSAGES"; claim3 = "Off";
                }

                if (req.body.auto == "Off") {
                    settings.updateOne({ auto: 3 }).then(result => { });
                    Auto1 = "Off"; Auto2 = "After Closing The Ticket"; Auto3 = "While Deleting The Ticket"
                }
                if (req.body.auto == "After Closing The Ticket") {
                    settings.updateOne({ auto: 1 }).then(result => { });
                    Auto1 = "After Closing"; Auto2 = "While Deleting The Ticket"; Auto3 = "Off"
                }
                if (req.body.auto == "While Deleting The Ticket") {
                    settings.updateOne({ auto: 2 }).then(result => { });
                    Auto1 = "While Deleting"; Auto2 = "After Closing The Ticket"; Auto3 = "Off"
                }
                let Rname; let Rcolor;
                if (req.body.prefix) {
                    settings.updateOne({ prefix: req.body.prefix }).then(result => { });
                }

                let Role = guild.roles.cache.find(r => r.id == req.body.role);
                if (!req.body.role) req.body.role = settings.role
                if (Role) {
                    Rname = Role.name;
                    settings.updateOne({ suprole: req.body.role }).then(result => { });
                } else {
                    let RR = guild.roles.cache.find(r => r.id == settings.suprole);
                    if (RR) { Rname = RR.name } else { Rname = "Please Select Role"; }

                }
                let Cname; let Lname; let Tname;
                let catt = guild.channels.cache.find(r => r.id == req.body.cat);
                if (catt) {
                    Cname = catt.name;
                    settings.updateOne({ category: req.body.cat }).then(result => { });
                } else {
                    let RR = guild.channels.cache.find(r => r.id == settings.category);
                    if (RR) { Cname = RR.name } else { Cname = "Please Select Category"; }

                }
                let logg = guild.channels.cache.find(r => r.id == req.body.log);
                if (logg) {
                    Lname = logg.name;
                    settings.updateOne({ log: req.body.log }).then(result => { });
                } else {
                    let RR = guild.channels.cache.find(r => r.id == settings.log);
                    if (RR) { Lname = RR.name } else { Lname = "Please Select Channel"; }

                }
                let TRans = guild.channels.cache.find(r => r.id == req.body.transcript);
                if (TRans) {
                    Tname = TRans.name;
                    settings.updateOne({ transcript: req.body.transcript }).then(result => { });
                } else {
                    let RR = guild.channels.cache.find(r => r.id == settings.transcript);
                    if (RR) { Tname = RR.name } else { Tname = "Please Select Channel"; }

                }
                res.render(req.params.option, {
                    info: {
                        colorG: colorG, colorS: colorS, colorH: colorH,
                        Rname: Rname, Cname: Cname, Lname: Lname, Tname: Tname,
                        Auto1: Auto1, Auto2: Auto2, Auto3: Auto3,
                        prv1: prv1, prv2: prv2, prv3: prv3,
                        claim1: claim1, claim2: claim2, claim3: claim3


                    },
                    member: member,
                    data: req.body,
                    req: req,
                    user: req.isAuthenticated() ? req.user : null,
                    guild: guild,
                    bot: client,
                    domain: Settings.website.domain,

                    Permissions: Discord.Permissions,
                    botconfig: Settings.website,
                    callback: Settings.config.callback,
                });
            }



        });
    })

    const http = require("http").createServer(app);
    http.listen(Settings.config.port, () => {
        console.log(`Website is online on the Port: ${Settings.config.port}, ${Settings.website.domain}`);
    });

}