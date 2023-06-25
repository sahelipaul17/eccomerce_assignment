const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate');

const cartSchema = new mongoose.Schema({
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

const Cart = mongoose.model('Cart', cartSchema);
module.exports = Cart;
