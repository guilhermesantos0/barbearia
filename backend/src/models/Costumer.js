const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');

const costumerSchema = new mongoose.Schema({
    _id: {
        type: mongoose.SchemaTypes.UUID,
        default: () => uuidv4()
    },
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true
    },
    password: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        required: true,
        unique: true
    },
    cpf: {
        type: String,
        unique: true,
        sparse: true
    },
    profilePic: {
        type: String,
        default: ''
    },
    premiumTier: {
        type: Number,
        default: 0
    },
    history: [
        {
            type: mongoose.SchemaTypes.UUID,
            ref: 'Service'
        }
    ]
},
{
    timestamps: true,
    versionKey: false

})

module.exports = mongoose.model('Costumer', costumerSchema);