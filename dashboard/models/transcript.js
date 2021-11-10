const mongoose = require('mongoose');
const trans = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    guildID: String,
    channelID: String,
    messages: Array,
    members: Array,
    gnMessage: String,
    last: String,
    statu: String,
    clsmsg: String,
    t: String,
    tp: String,
    claimed:String,
    Reactions:String
    
});
module.exports = mongoose.model('Trans', trans, 'transcript');