const mongoose = require('mongoose');

const guildSchema = mongoose.Schema({
    _id: 0,
    userID: Object,
    lang: Object,
    mode: Object


    
});
module.exports = mongoose.model('PanelUsers', guildSchema, 'PanelUsers');
