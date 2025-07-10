const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');

const scheduledServiceSchema = new mongoose.Schema({
    _id: {
        type: mongoose.SchemaTypes.UUID,
        default: () => uuidv4()
    },
    costumer: {
        type: mongoose.SchemaTypes.UUID,
        ref: 'Costumer',
        required: true
    },
    barber: {
        type: mongoose.SchemaTypes.UUID,
        ref: 'Employee',
        required: true
    },
    date: {
        type: Date,
        required: true
    },
    complete: {
        type: Boolean,
        default: false
    },
    completedAt: Date,
    rated: {
        type: Boolean,
        deafult: false
    },
    rate: {
        stars: Number,
        comment: String,
        ratedAt: Date
    }
},
{
    timestamps: true,
    versionKey: false

})

module.exports = mongoose.model('ScheduledService', scheduledServiceSchema);