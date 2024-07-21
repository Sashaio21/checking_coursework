import "./styles.css"
import { Link } from "react-router-dom"
import { Button } from "@mui/material"
import { useEffect, useState } from "react";
import axios from '../axios';
import { fetchWork } from "../redux/slices/works";
import { useDispatch } from "react-redux";
import moment from "moment";
import { useNavigate } from "react-router-dom";


export function TeacherPanel() {
    const navigate = useNavigate()
    const [items, setData] = useState([]);
    const worksDis = useDispatch()
    const [review, setReview] = useState("")
    const [surName, setSurName] = useState("")
    const [firstName, setFirstName] = useState("")
    const [patronymic, setPatronymic] = useState("")


    const getWroks = async ()=>{
        const dataWork = await worksDis(fetchWork());
        const index = 0;
        try {
            setData(dataWork.payload)
            setSurName(dataWork.payload[0].student.surName)
            setFirstName(dataWork.payload[0].student.firstName)
            setPatronymic(dataWork.payload[0].student.patronymic)   
        } catch (error) {
            
        }   
    }
    useEffect(()=>{
        getWroks();
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
            <div className="listApplications">
                {items.map((obj)=>
                <div className="application">
                <Link to={`/story/${obj._id}`} >
                {obj.statusСhecks!="Не просмотрено" ? (
                        <div className="dataApplication" style={{color: "#828282"}}>
                            <div className="themaСoursework">{obj.themeWork}</div>
                            <div className="teacher">{obj.student.surName} {obj.student.firstName} {obj.student.patronymic}</div>
                            <div className="status">{obj.statusСhecks}</div>
                        </div>
                    ):(
                        <div className="dataApplication">
                            <div className="themaСoursework">{obj.themeWork}</div>
                            <div className="teacher">{obj.student.surName} {obj.student.firstName} {obj.student.patronymic}</div>
                            <div className="status">{obj.statusСhecks}</div>
                        </div>
                    )}
                </Link>
                <div>
                    <div >{moment(obj.updatedAt).format('D MMMM YYYY, H:mm')}</div>
                    <div  className="button" style={{marginBottom: "10px"}}><Button onClick={()=>donwLoadDocument(obj)} variant="contained">Скачать отчёт</Button></div>
                    {obj.statusСhecks!="Не просмотрено" ? (
                        <Link  className="button"><Button variant="contained" color="inherit">Написать рецензию</Button></Link>
                    ):(
                        <Link to={`/sendreview/${obj._id}`}  className="button"><Button variant="contained">Написать рецензию</Button></Link>
                    )}
                </div>
            </div>
                )
                }
            </div>
        </div>
    )
}








// return (
//     <div className="mainBlock">
//         <div className="listApplications">
//             {items.map((obj)=>
//             <div className="application">
//             <Link to={`/story/${obj._id}`} >
//             {items ? (
//                 <div className="dataApplication">
//                     <div className="themaСoursework">{obj.themeWork}</div>
//                     <div className="teacher">{surName} {firstName} {patronymic}</div>
//                     <div className="status">{obj.statusСhecks}</div>
//                 </div>
//             ):(
//                 <div className="dataApplication">
//                     <div className="themaСoursework">{obj.themeWork}</div>
//                     <div className="teacher">{items.student.surName.surName} {items.student.surName.firstName} {items.student.surName.patronymic}</div>
//                     <div className="status">{obj.statusСhecks}</div>
//                 </div>
//             )}
//             </Link>
//             <div>
//                 <div >{moment(obj.updatedAt).format('D MMMM YYYY, H:mm')}</div>
//                 <div  className="button" style={{marginBottom: "10px"}}><Button variant="contained">Скачать отчёт</Button></div>
//                 <Link to={`/sendreview/${obj._id}`}  className="button"><Button variant="contained">Написать рецензию</Button></Link>
//             </div>
//         </div>
//             )
//             }
//         </div>
//     </div>
// )