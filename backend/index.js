import express from 'express'
import mongoose from 'mongoose';
import StudentModel from './models/Student.js';
import TeacherModel from './models/Teacher.js';
import ReviewModel from './models/Review.js';
import ApplicationModel from './models/Application.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import checkAutharization from './utilites/checkAutharization.js';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import cors from 'cors';
import fs from 'fs';



const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
// Создание папки uploads, если она не существует
const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir);
}

const app = express()

app.use(express.json());
app.use(express.json({ limit: '50mb', type: 'application/json' }));
app.use(express.urlencoded({ limit: '50mb', extended: true, parameterLimit: 50000 }));

app.options('*', cors());

const storage = multer.diskStorage({
    destination: (_,__, cb)=>{
        cb(null, 'uploads');
    },
    filename: (req, file, cb) => {
        cb(null, Buffer.from(file.originalname, 'latin1').toString('utf8')); // Обработка имен файлов
    },
}
);


const upload = multer({storage});






app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*'); 
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next();
  });

  
mongoose.connect('mongodb+srv://usersdata:0hZzN9CAxapArcxI@cluster0.skrlm7h.mongodb.net/examination?retryWrites=true&w=majority&appName=Cluster0')
        .then(()=>console.log("DB ok"))
        .catch((err)=>console.log("DB error", err));



app.use('/upload', express.static('uploads'))


app.post('/upload', upload.single('wordDocument'), (req, res)=>{
    console.log(req.file.originalname)
    try {
        const name = Buffer.from(req.file.originalname, 'latin1').toString('utf8')
        res.json({
            url: `/uploads/${name}`,
        });   
    } catch (error) {
        console.log(error) 
    }
    
});
        



app.get('/',(req, res)=>{
res.json({
    success: "success",
})
});


//регистрация студента
app.post('/auth/register', async (req, res)=>{
    const password = req.body.password;
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);
    const doc = new StudentModel({
        surName: req.body.surName ,
        firstName: req.body.firstName ,
        patronymic: req.body.patronymic ,
        numberKurs: req.body.numberKurs ,
        numberGroup: req.body.numberGroup ,
        passportNumber: req.body.passportNumber ,
        passwordHash: passwordHash ,
    });
    const buyer = await doc.save();
    return res.json({buyer});
});


//регистрация преподавателя
app.post('/auth/registerteacher', async (req, res)=>{
    const password = req.body.password;
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);
    const doc = new TeacherModel({
        surName: req.body.surName ,
        firstName: req.body.firstName ,
        patronymic: req.body.patronymic ,
        theme: req.body.theme ,
        passportNumber: req.body.passportNumber ,
        passwordHash: passwordHash ,
    });
    const buyer = await doc.save();
    return res.json({buyer});
});


//авторизация
app.post('/auth/login', async (req, res)=>{
    try {
        const student = await StudentModel.findOne(
            {
                passportNumber: req.body.passportNumber
            }
        )
        if(!student) {
            const teacher = await TeacherModel.findOne(
                {
                    passportNumber: req.body.passportNumber
                }
            )
            const isValuePass = await bcrypt.compare(req.body.password, teacher._doc.passwordHash); //возвращает true or false
            if (!isValuePass) {
                return res.status(404).json({
                    message: "Неверный логин или пароль",
                });
            }
            const token = jwt.sign({
                _id:teacher._id,
            }, 'secret123', {expiresIn: '30d'});
            return res.json({
                ...teacher._doc,
                token,
                "typeUser": "teacher"
            })
            }
        console.log(req)
        const isValuePass = await bcrypt.compare(req.body.password, student._doc.passwordHash); //возвращает true or false
        if (!isValuePass) {
            return res.status(404).json({
                message: "Неверный логин или пароль",
            });
        }
        const token = jwt.sign({
            _id:student._id,
        }, 'secret123', {expiresIn: '30d'});
        return res.json({
            ...student._doc,
            token,
            "typeUser": "student"
        })
    } catch (error) {
        console.log(error)
        return res.json({"ошибка": error});
    }
})



app.get('/auth/me', checkAutharization, async(req, res)=>{
    try {
        const student = await StudentModel.findById(req.userId);
        if (!student) {
            const teacher = await TeacherModel.findById(req.userId);
            if (!teacher) {
                return res.status(404).json({
                    message: "Такого пользователя нет",
                });
            }
            return res.json({
                ...teacher._doc,
                "typeUser": "teacher"
        })
        }
        if (!student) {
            return res.status(404).json({
                message: "Такого пользователя нет",
            });
        }
        console.log(student)
        return res.json({
            ...student._doc,
            "typeUser": "student"
    })
    } catch (error) {   
        console.log("nen;sdvmkdsv",error)
        return res.json({"ошибка": error});
    }
})

// fs.mkdirSync("uploads");
// // Маршрут для скачивания файла
app.get('/download/:filename', (req, res) => {
    const filename = req.params.filename;
    const filePath = path.join(__dirname , 'uploads', filename);
    console.log(req)
    // Проверяем, существует ли файл
    if (fs.existsSync(filePath)) {
        console.log("воот")
        res.download(filePath, filename, (err) => {
            console.log("дыа")
            if (err) {
                console.error('File download error:', err);
                res.status(500).send('Error downloading file');
            }
        });
    } else {
        res.status(404).send('File not found');
    }
});
 
//----------------------------------------------------------------------
//Отправить курсовую
app.post('/send/work', checkAutharization, async(req, res)=>{
    try {
        const idTeacher = await TeacherModel.find({
            surName :req.body.teacher.split(" ")[0]
        })
        const doc = new ApplicationModel({
            student: req.userId,
            teacher: idTeacher[0]._id,
            themeWork: req.body.themeWork,
            statusСhecks: "Не просмотрено",
            file: req.body.file.replace('/uploads/', '')//Buffer.from(req.body.file , 'latin1').toString('utf8').replace('/uploads/', '')
        })
        const work = await doc.save();
        return res.status(200).json(work);
    } catch (error) {
        console.log(error)
        return res.json({"ошибка": error});
    }
})


//Отправить курсовую
app.patch('/send/work', checkAutharization, async(req, res)=>{
    try {
        // const idTeacher = await TeacherModel.find({
        //     surName :req.body.teacher.split(" ")[0]
        // })33
        console.log(req.body.file)
        const doc = await ApplicationModel.findByIdAndUpdate(
            {
                _id:req.body.idWork
            },
            {
                file: req.body.file.replace('/uploads/', ''),
                statusСhecks: "Не просмотрено"
            }
        )
        const work = await doc.save();
        return res.status(200).json(work);
    } catch (error) {
        console.log(error)
        return res.json({"ошибка": error});
    }
})



// //Получить одну курсовую работу
app.get('/works/:idWork', checkAutharization, async(req, res)=>{
    try {
        console.log(req.params.idWork)
        const doc = await ApplicationModel.findById(
            req.params.idWork
        ).populate("student")
        return res.status(200).json(doc);
    } catch (error) {
        console.log(error)
        return res.json({"ошибка": error});
    }
})



//Получить список курсовых на проверку
app.get('/works', checkAutharization, async(req, res)=>{
    try {
        const doc = await ApplicationModel.find({
            teacher: req.userId
        }).populate("student").sort({ statusСhecks: 1,updatedAt: -1 })

        return res.status(200).json(doc);
    } catch (error) {
        console.log(error)
        return res.json({"ошибка": error});
    }
})

//Получить список рецензий
app.get('/reviews/:idWork', checkAutharization, async(req, res)=>{
    try {
        const doc = await ReviewModel.find({
            work: req.params.idWork
        }).populate("teacher").populate("student").sort({updatedAt: -1}).sort({statusСhecks: 1})

        return res.status(200).json(doc);
    } catch (error) {
        console.log(error)
        return res.json({"ошибка": error});
    }
})


//Получить список для студента
app.get('/reviews', checkAutharization, async(req, res)=>{
    try {
        const doc = await ReviewModel.find({
            student: req.userId
        }).populate("teacher").sort({ statusСhecks: -1,updatedAt: -1 })

        return res.status(200).json(doc);
    } catch (error) {
        console.log(error)
        return res.json({"ошибка": error});
    }
})


//Получить список для студента
app.get('/review/:idReview', checkAutharization, async(req, res)=>{
    try {
        const doc = await ReviewModel.find({
            _id: req.params.idReview
        }).populate("teacher")
        return res.status(200).json(doc);
    } catch (error) {
        console.log(error)
        return res.json({"ошибка": error});
    }
})


//Получить одну рецензию
app.patch('/reviewsByWork/:idWork', checkAutharization, async(req, res)=>{
    try {
        const doc = await ReviewModel.findOneAndUpdate({
            work: req.params.idWork,
            _id: req.body.idReview
        },{
            statusСhecks: "Исправлено"
        })
        console.log(doc)
        return res.status(200).json(doc);
    } catch (error) {
        console.log(error)
        return res.json({"ошибка": error});
    }
})


//список всех преподователей
app.get('/allTeacher', checkAutharization, async(req, res)=>{
    try {
        const doc = await TeacherModel.find()
        return res.status(200).json(doc);
    } catch (error) {
        console.log(error)
        return res.json({"ошибка": error});
    }
})


//Отправить рецензию
app.post('/send/review/:idWork', checkAutharization, async(req, res)=>{
    try {
        console.log(req.params.idWork);
        const idStudent = await ApplicationModel.findOne({_id: req.params.idWork})

        console.log("fdsfsdffsdf",idStudent.file);
        const doc = new ReviewModel({
            student: idStudent.student,
            teacher: req.userId,
            work: req.params.idWork,
            statusСhecks: "Не просмотрено",
            textReview: req.body.textReview,
            file: idStudent.file 
        })

        const Work = await ApplicationModel.findByIdAndUpdate({_id: req.params.idWork}, {statusСhecks: "Проверено"})
        await Work.save()
        const Review = await doc.save();
        return res.status(200).json(Review);
    } catch (error) {
        console.log(error)
        return res.json({"ошибка": error});
    }
})



app.listen(4444, (err)=>{
    if(err){
        return console.log("Сервер не запустился");
    }
    console.log("Сервер запустился");
})