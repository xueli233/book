const mongoose = require('mongoose');
const Schema = mongoose.Schema;

module.exports = mongoose.model('Book', new Schema({
  id: Number,
  fmImg: String,
  data:{
    title: Array,
    content: Array,
  },
}));