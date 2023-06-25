const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate');

const categorySchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  slug: {
    type: String,
    trim: true,
  },

});

const Category = mongoose.model('Category', categorySchema);
module.exports = Category;
