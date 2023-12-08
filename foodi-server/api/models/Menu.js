const mongoose = require('mongoose');
const {Schema} = mongoose;

// create schema object for Menu Items
const menuSchema = new Schema({
    name: {
        type: String,
        trim: true,
        required: true,
        minlength: 3
    },
    recipe: String,
    image: String, 
    category: String,
    price: Number

})

// create model
const Menu = mongoose.model("Menu", menuSchema);
module.exports = Menu;