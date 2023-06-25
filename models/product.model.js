const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate');

const productSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  slug: {
    type: String,
    trim: true,
  },
  desc: {
    type: String,
    required: true,
    trim: true,
  },
  category: {
    type: String,
    required: true,
    trim: true,
  },
  price: {
    type: Number,
    trim: true,
    required: true,
  },
  image: {
    type: String,

  },
  tt: {
    type: Number,
    required: true,
    default: 1,
  },

});

const Product = mongoose.model('Product', productSchema);
// Product.plugin(mongoosePaginate)
module.exports = Product;
