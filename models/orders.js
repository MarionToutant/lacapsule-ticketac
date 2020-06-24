const mongoose = require('mongoose');

var orderSchema = mongoose.Schema({
    journey: { type: mongoose.Schema.Types.ObjectId, ref: 'journeys' },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'users' },
    confirmed: Boolean,
});
  
var orderModel = mongoose.model('orders', orderSchema);

module.exports = orderModel;