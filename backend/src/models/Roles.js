const mongoose = require('mongoose');
const Counter = require('./Counter');

const roleSchema = new mongoose.Schema({
    _id: Number,
    name: {
        type: String,
        required: true,
        unique: true
    },
    permissions: {
        type: [String],
        default: []
    }
},
{
    timestamps: true
});

roleSchema.pre('save', async function (next){
    if (this.isNew) {
        const counter = await Counter.findByIdAndUpdate(
            'Role',
            { $inc: { req: 1 }},
            { new: true, upsert: true }
        );
        this._id = counter.req;
    }
    next();
})

module.exports = mongoose.model('Role', roleSchema)