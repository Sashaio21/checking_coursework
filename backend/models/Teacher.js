import mongoose from "mongoose";

const TeacherSchema = new mongoose.Schema({
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
        required: true,
    },
    passportNumber:{
        type: String,
        unique: true
    },
    theme:{
        type: String,
        unique: true
    },
    passwordHash:{
        type: String,
        required: true,
    }
});

export default mongoose.model('Teacher', TeacherSchema)