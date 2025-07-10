const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');

const serviceSchema = new mongoose.Schema({
    _id: {
        type: mongoose.SchemaTypes.UUID,
        default: () => uuidv4()
    },
    name: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    description: {
        type: String,
        required: true,
        trim: true
    },
    price: {
        type: Number,
        required: true
    },
    duration: {
        type: Number,
        required: true
    }
},
{
    timestamps: true,
    versionKey: false

});

module.exports = mongoose.model('Service', serviceSchema);