import mongoose from "mongoose";

const StudentSchema = new mongoose.Schema({
    surName: {                //фамилия
        type: String,
        required:true,
    },
    firstName: {                 //Имя
        type: String,
        required: true,
    },
    patronymic:{       //отчество
        type: String,
        required: true
    },
    numberKurs:{
        type: Number
    },
    numberGroup: {
        type: Number
    },
    passportNumber:{
        type: String,
        unique: true
    },
    passwordHash:{
        type: String,
        required: true,
    }
});

export default mongoose.model('Student', StudentSchema)