import { Document, Schema, model } from 'mongoose';
import { getNextSequence } from '../middlewares/getNextSequence';

export interface IRole extends Document {
    _id: number;
    name: string;
    permissions: string[];
}

const roleSchema = new Schema<IRole>({
    _id: { 
        type: Number, 
        unique: true 
    },
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

roleSchema.pre<IRole>('save', async function (next){
    if (!this.isNew || this._id) return next();


    const nextId = await getNextSequence('role');
    this.id = nextId;
    next();
})

const Role = model<IRole>('Role', roleSchema)
export default Role;