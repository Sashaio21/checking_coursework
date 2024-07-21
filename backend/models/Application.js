import mongoose from "mongoose";

const ApplicationSchema = new mongoose.Schema({
    student: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Student',
        required: true,
    },
    teacher: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Teacher',
        required: true,
    },  
    themeWork:{
        type: String,
        required: true
    },
    statusСhecks:{
        type: String,
        required: true,
        default: "Не просмотрено"
    },
    file: String
},
{
    timestamps: true
});

export default mongoose.model('Application', ApplicationSchema)