import "./styles.css"
import React from "react"
import { Button, Paper } from "@mui/material"
import SimpleMDE from "react-simplemde-editor"
import SimpleMdeReact from "react-simplemde-editor"
import axios from '../axios';
import { useState, useEffect } from "react"
import { useParams } from "react-router-dom"
export function SendReview() {

    const [review, setReview] = useState("");
    const params = useParams();
    const sendReview = (textReview) => {
        const paramerti = {
            "textReview":textReview
        }
        console.log("dscscdsdapapappapapap",params)
        axios.post(`/send/review/${params.idStudent}`, paramerti)
        .then((data)=>{
            console.log("fffffff",data)
        });
        console.log("Отправить")
    }

    
    return (
        <div className="mainBlock">            
            <div className="review">
                <Paper>
                    <div className="buttonDown">
                    <div class="textarea-container">
                        <textarea id="beautifulTextarea" placeholder="Введите ваш текст" onChange={(event)=>setReview(event.target.value)}></textarea>
                    </div>
                        {/* <SimpleMDE  className="editor" options={options}/> */}
                        <Button variant="contained" onClick={()=>sendReview(review)}>Отправить рецензию</Button>
                    </div>
                </Paper>
            </div>
        </div>
    )
}