import "./styles.css"
import { Button } from "@mui/material"
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchUser } from "../redux/slices/auth";
import { selectAuth } from "../redux/slices/auth";
import { Navigate } from "react-router-dom";

export function Auth() {
    const [passportNumber, setPassportNumber] = useState("");
    const [password, setPassword] = useState("");
    const userDispath = useDispatch()
    const auth = useSelector(selectAuth)
    // const location = useLocation();
    // const { exit } = location.state || {};




    const GetUser = async (passportNumber, password) => {
        const dataAuth = {
            "passportNumber": passportNumber,
            "password": password
        }
        const dataUser = await userDispath(fetchUser(dataAuth))

        if ('token' in dataUser.payload) {
            window.localStorage.setItem('token', dataUser.payload.token)
        }       
    }



    if (auth) {
        return <Navigate  to={`/${auth.typeUser}`}/>
    }

    return (
        <div className="pageAuth">
            <div className="formAuth">
            Авторизация
            <input placeholder="Номер паспорта" className="compAuth" onChange={(event)=>setPassportNumber(event.target.value)}></input>
            <input placeholder="Пароль" className="compAuth" onChange={(event)=>setPassword(event.target.value)}></input>
            <Button onClick={()=>GetUser(passportNumber, password)} className="compAuth" variant="contained" >Войти</Button>
            </div>
        </div>
    )
}