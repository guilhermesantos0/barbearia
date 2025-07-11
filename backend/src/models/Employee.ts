import { Document, Schema, model } from 'mongoose';
import { v4 as uuidv4 } from 'uuid';


interface Interval {
    name: string,
    start: string,
    end: string
}

export interface IEmployee extends Document {
    _id: string,
    role: number,
    name: string,
    email: string,
    password: string,
    phone: string,
    cpf: string,
    profilePic: string,
    nextServices: string[],
    lastServices: string[],
    work: {
        days: string[],
        time: {
            start: string,
            end: string,
            intervals: Interval[]
        }
    },
    services: string[],
    createdAt: string | Date,
    editedAt: string | Date
}

const employeeSchema = new Schema<IEmployee>({
    _id: {
        type: String,
        default: () => uuidv4()
    },
    role: {
        type: Number,
        required: true,
        ref: 'Role'
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

const Employee = model<IEmployee>('Employee', employeeSchema);
export default Employee;