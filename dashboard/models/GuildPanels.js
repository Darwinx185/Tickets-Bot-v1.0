const mongoose = require('mongoose');
const pa = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    guildID: String,
    Panels: Array
});
module.exports = mongoose.model('Paa', pa, 'GuildPanels');