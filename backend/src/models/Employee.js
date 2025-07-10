const mongoose = require('mongoose');
const { v4: uuidv4 } = requir('uuid');

const employeeSchema = new mongoose.Schema({
    _id: {
        type: mongoose.SchemaTypes.UUID,
        default: () => uuidv4()
    },
    role: {
        type: Number,
        required: true,
        ref: 'Roles'
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
    nextServices: [
        {
            type: String,
            ref: 'ScheduledService'
        }
    ],
    lastServices: [
        {
            type: String,
            ref: 'ScheduledService'
        }
    ],
    work: {
        days: [
            {
                type: String
            }
        ],
        time: {
            start: String,
            end: String,
            intervals: [
                {
                    name: String,
                    start: String,
                    end: String
                }
            ]
        },
        services: [
            {
                type: String,
                ref: 'Service'
            }
        ]
    }
},
{
    timestamps: true,
    versionKey: false

})

module.exports = mongoose.model('Employee', employeeSchema);