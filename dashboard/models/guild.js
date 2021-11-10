const mongoose = require('mongoose');

const guildSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    guildID: Object,
    prefix: String,
    category: String,
    suprole: String,
    log: String,
    transcript: String,
    count: String,
    TW: String,
    prv: String,
    disable: String,
    limit: String,
    auto: String,
    close: String,
    rename: String,
    lang: String,
    ReactionMessage:String,
    ReactionEmoji:String,
    ReactionCannel: String,
    tickets: Array,
    claim : String,
    premium: String,
    emClose: String,
    emClaim: String,
    emReopen: String,
    emDelete: String,
    emSave: String,
    emSaveP: String,
    history: String,
    log: String,
    temp: Object,
    SugStatu:Object,
    SugChannel:Object,
    SugCount:Object,
    SugTime:Object,
    ReactionMessages: Array

    
});
module.exports = mongoose.model('Guild', guildSchema, 'guilds');
