import mongoose from "mongoose";

const ReviewSchema = new mongoose.Schema({
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
    work:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Work",
        required: true,
    },
    statusСhecks:{
        type: String,
        required: true,
        default: "Не просмотрено"
    },
    textReview: {
        type: String,
        required: true,
    },
    file: String
},
{
    timestamps: true
});

export default mongoose.model('Review', ReviewSchema)