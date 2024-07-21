import "./styles.css"
import { Button, Paper } from "@mui/material"
import axios from '../axios';
import { useState } from "react";
import { useEffect } from "react";
import { useParams } from "react-router-dom";
import moment from "moment";


export function StoryReview({}) {
    const params = useParams();
    const [items, setData] = useState([]);
    const [dataWork, setDataWork] = useState([]);
    useEffect(()=>{
        axios.get(`/reviews/${params.idWork}`)
        .then((data)=>{
            setData(data.data);
        });

        axios.get(`/works/${params.idWork}`)
        .then((data)=>{
            console.log("fsdfdsfd",data)
            setDataWork(data.data);
        });
    },[])


    const donwLoadDocument = (nameDocument) =>{
        console.log(nameDocument.file)
        const nameFile = nameDocument.file
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
    }


    return (
        <div className="mainBlock">            
            <div className="review">
                <Paper>
                    <h1>Рецензии</h1>
                    <div className="title">{dataWork.themeWork}</div>
                    <div className="title">Студент</div>
                    {items.map((obj)=>
                        <div style={{marginTop: "20px"}}>
                            <div style={{display: "flex", justifyContent: "space-between"}}> 
                                <div className="title">{ moment(obj.createdAt).format('D MMMM YYYY, H:mm')}</div>
                                <div  className="button" onClick={()=>donwLoadDocument(obj)} style={{marginBottom: "10px"}}><Button  variant="contained">Скачать отчёт</Button></div>
                            </div>
                            <div className="reviewText">
                                {obj.textReview}    
                            </div>
                        </div>
                    )
                    }
                    <div className="buttonDown">
                    </div>
                </Paper>
            </div>
        </div>
    )
}