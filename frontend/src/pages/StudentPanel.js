import "./styles.css"
import axios from '../axios';
import { Button } from "@mui/material"
import { Link } from "react-router-dom"
import { useState, useEffect } from "react"
import moment from "moment";

export function StudentPanel() {

    const [listReview, setListReview] = useState([])
    const [themeWork, setThemeWork] = useState("")
    const [created, setCreated]= useState("")

    const getOneWork = (idWork) => {
        // console.log(idWork.work)
        axios.get(`/works/${idWork.work}`)
        .then((data)=>{
            console.log(data.data.themeWork)
            setThemeWork(data.data.themeWork)
            setCreated(data.data.createdAt)
        });
        console.log("dssdff",)
        return themeWork
    }

    useEffect(()=>{
        axios.get(`/reviews`)
        .then((data)=>{
            setListReview(data.data);
        });
        console.log("vvvvvvvvvvv", listReview)
    },[])

    const ggg=(tt) => {
        console.log(tt)
        axios.post(`/reviewsByWork/${tt.work}`, {idReview: tt._id})
        .then((data)=>{
            console.log(data.data[0].file)
            return data.data[0].file
        });
    }

    const donwLoadDocument = (objectt) =>{
        axios.post(`/reviewsByWork/${objectt.work}`, {idReview: objectt._id})
        .then((data)=>{
            console.log(data.data[0].file)
            const nameDocument = data.data[0].file
            const nameFile = nameDocument 
            axios({
                url: `http://localhost:4444/download/${nameFile}`,
                method: 'GET',
                responseType: 'blob', // Важно для получения файла в виде Blob
            })
            .then(response => {
                const url = window.URL.createObjectURL(new Blob([response.data]));
                const link = document.createElement('a');
                link.href = url;
                link.setAttribute('download', nameFile); // Укажите имя файла
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
            })
            .catch(error => console.error('Error downloading file:', error));
        });
    }


    return (
        <div className="mainBlock">            
            <Link className="buttonSend" to={"/send"}>
                <Button variant="contained">Отправить курсовую</Button>
            </Link>
            
            <div className="listApplications">
                {listReview.map((obj)=>
                <div className="application" style={{color:"#828282"}}>
                <Link to={`/review/${obj._id}`} >
                {obj.statusСhecks!="Не просмотрено" ? (
                        <div className="dataApplication" style={{color:"#828282"}}>
                        <div className="themaСoursework">{getOneWork(obj)}</div>
                        <div className="teacher">{obj.teacher.surName} {obj.teacher.firstName} {obj.teacher.patronymic}</div>
                        <div className="status">{obj.statusСhecks}</div>
                    </div>
                    ):(
                        <div className="dataApplication">
                    <div className="themaСoursework">{getOneWork(obj)}</div>
                    <div className="teacher">{obj.teacher.surName} {obj.teacher.firstName} {obj.teacher.patronymic}</div>
                    <div className="status">{obj.statusСhecks}</div>
                </div>
                    )}
                
                </Link>
                <div>
                    <div className="status">{moment(obj.createdAt).format('D MMMM YYYY, H:mm')}</div>
                    <div className="button"><Button variant="contained" onClick={()=>donwLoadDocument(obj)}>Скачать отчёт</Button></div>
                </div>
            </div>
                )
                }
            </div>
        </div>
    )
}