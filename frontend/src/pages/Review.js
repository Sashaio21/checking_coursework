import "./styles.css"
import { Button, Paper, Link } from "@mui/material"
import SimpleMDE from "react-simplemde-editor"
import SimpleMdeReact from "react-simplemde-editor"
import { useState, useEffect } from "react"
import axios from '../axios';
import { Navigate, useParams } from "react-router-dom"
import { useNavigate } from "react-router-dom"

export function Review() {
    const navigate = useNavigate();
    const params = useParams();
    const [review, setReview] = useState("")
    const [surName, setSurName] = useState("")
    const [firstName, setFirstName] = useState("")
    const [patronymic, setPatronymic] = useState("")
    const [idWork, setIdWork] = useState("")
    const [idReview, setidReview] = useState("")


    useEffect(()=>{
        axios.get(`/review/${params.idWork}`)
        .then((data)=>{
            console.log("hui",data.data[0]._id)
            setidReview(data.data[0]._id);
            setReview(data.data[0].textReview);
            setSurName(data.data[0].teacher.surName)
            setFirstName(data.data[0].teacher.firstName)
            setPatronymic(data.data[0].teacher.patronymic)
            setIdWork(data.data[0].work)
        });
    },[])


    

    return (
        <div className="mainBlock">            
            <div className="review">
                <Paper>
                    <h1>Рецензия</h1>
                    <div className="title">Тема курсовой</div>
                    <div className="title">{surName} {firstName} {patronymic}</div>
                    <div className="reviewText">
                        {review}
                    </div>

                </Paper>
            </div>
            <Link >
                <Button variant="contained" onClick={() => navigate("/send", { state: { idWork: idWork, idReview:idReview,teacher: `${surName} ${firstName} ${patronymic}`} })}>Отправить новый вариант</Button>
            </Link>
        </div>
    )
}