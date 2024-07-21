import "./styles.css"
import { Button, TextField, Select, MenuItem, InputLabel, FormControl } from "@mui/material"
import { useEffect, useState } from "react"
import axios from '../axios';
import SelectChangeEvent from '@mui/material/Select';
import { useLocation } from "react-router-dom";
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { styled } from '@mui/material/styles';
import { useRef } from "react";

 
export function SendWork() {
    const [teachers, setTeachers] = useState([])
    const [tescherOne, setTeacherOne] = useState("");
    const [themeWork, setThemeWork] = useState("");
    const [dataWork, setDataWork] = useState("")
    const location = useLocation();
    const [fileUrl, setFileUrl] = useState("");
    const { idWork, idReview,teacher } = location.state || {};
    const inputFileRef = useRef(null)
    const [isLoading, setIsLoadnig] = useState(false)


    useEffect(()=>{
        axios.get(`/allTeacher`)
        .then((data)=>{
            setTeachers(data.data);
        });
        console.log(idWork)
        if (idWork){
            axios.get(`/works/${idWork}`)
            .then((data)=>{
                setDataWork(data.data.themeWork);
                console.log(data.data.themeWork)
            });
        }
    },[])


    
    const sendWork = (data, themeWork, fileUrl) => {
    const parametry = {
        "themeWork": themeWork,
        "teacher" : data ,
        "file": fileUrl
    }
    axios.post(`/send/work`, parametry)
        .then((data)=>{
    });
    console.log(parametry)
    }

    const updateWork = (file, idWork, idReview) => {
        const parametry = {
            "file": file,
            "idWork": idWork
        }
        axios.patch(`/send/work`, parametry)
            .then((data)=>{
        });
        const par = {
            "idWork": idWork,
            idReview: idReview
        }
        axios.patch(`/reviewsByWork/${idWork}`, par)
            .then((data)=>{
        });
        console.log(parametry)
    }



    const handleChange = (event) => {
        setTeacherOne(event.target.value);
    };


    const onClickRemoveImage = async (event) => {
        setFileUrl("")
    };

    const handleChangeFile = async (event) => {
        try {
          const formData = new FormData()
          formData.append('wordDocument', event.target.files[0])
          const {data} = await axios.post('/upload', formData);
          setFileUrl(data.url)
          console.log(data)
        } catch (error) {
        }
        console.log(event.target.files)
      };
      


      const VisuallyHiddenInput = styled('input')({
        clip: 'rect(0 0 0 0)',
        clipPath: 'inset(50%)',
        height: 1,
        overflow: 'hidden',
        position: 'absolute',
        bottom: 0,
        left: 0,
        whiteSpace: 'nowrap',
        width: 1,
      });

    return (
        <div className="mainBlock">            
            <div className="formSend">
                {!fileUrl ? (
                    <Button
                        onClick={()=>inputFileRef.current.click()}
                        className="buttonDownload"
                        variant="contained"
                        tabIndex={-1}
                        startIcon={<CloudUploadIcon />}
                        >
                        Загрузить файл
                        <VisuallyHiddenInput type="file" />
                    </Button>
                ):(
                    <Button
                        className="buttonDownload"
                        variant="contained"
                        color="inherit"
                        tabIndex={-1}
                        startIcon={<CloudUploadIcon />}
                        >
                        Загрузить файл
                        <VisuallyHiddenInput type="file" />
                    </Button>
                )
                }
                <div onClick={()=>onClickRemoveImage()}>{fileUrl.replace('/uploads/', '')}</div>
                <input ref={inputFileRef} onChange={handleChangeFile} type="file" hidden></input>
                {idWork ? (
                    <TextField label="Введите тему курсовой" value={dataWork} className="form" onChange={(event)=>setThemeWork(event.target.value)}></TextField>
                ):(
                    <TextField label="Введите тему курсовой" className="form" onChange={(event)=>setThemeWork(event.target.value)}></TextField>
                )}
                
                <FormControl className="form">
                    <InputLabel >Выберете преподавателя</InputLabel>
                    <Select className="select"  value={teacher} onChange={handleChange}>
                        {teachers.map((obj)=><MenuItem value={`${obj.surName} ${obj.firstName} ${obj.patronymic}`} >{obj.surName} {obj.firstName} {obj.patronymic}</MenuItem>)}
                    </Select>
                </FormControl>
                {idWork ? (
                    <Button variant="contained" className="buttonDownload" onClick={()=>updateWork(fileUrl, idWork, idReview)}>Изменить</Button>
                ):(
                    <Button variant="contained" className="buttonDownload" onClick={()=>sendWork(tescherOne, themeWork, fileUrl)}>Отправить</Button>
                )}
                
            </div>
        </div>
    )
}