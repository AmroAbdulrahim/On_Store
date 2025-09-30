const mongoose = require("mongoose")
const Schema = mongoose.Schema

const articleSchema = new Schema({
    image: String,
    name: String,
    detalls: String,
    section: String,
    pric: Number
})

const usersSchema = new Schema({
    username: String,
    email: String,
    phoneNumber: Number,
    address: String,
    password: String
})

const orderSchema = new mongoose.Schema({
    user: {
        username: String,
        email: String,
        phoneNumber: Number,
        address: String,
    },
    items: [
        {
            image: String,
            name: String,
            counter: Number,
            pric: Number
        }
    ],
    date: String,
});

const Order = mongoose.model("Order", orderSchema);
const Mydata = mongoose.model("Mydata",articleSchema)
const Users = mongoose.model("users",usersSchema)


module.exports = {
    Users,
    Mydata,
    Order
}
