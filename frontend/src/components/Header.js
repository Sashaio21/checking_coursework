import './Header.css'
import { Button } from '@mui/material';
import { useSelector } from 'react-redux';
import { selectAuth } from '../redux/slices/auth';
import { useEffect } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';


export const Header = () => {
   const navigate = useNavigate()
   const auth = useSelector(selectAuth)
   console.log("header",auth) 
   const exitAuth = async () => {
      if (window.confirm("Вы хотите выйти?")) {
         window.localStorage.removeItem('token');
         // navigate("/", {state: {exit: true}})
      }
   }

   

   return (
     <div>
         <div className="header">
            {!auth ? (
               <div className='userUI'>
               <Button className='buttonExit' variant="contained" >
                  Войти
               </Button>
               </div>
            ):(
               <div className='userUI'>
               <div className='NameUser'>
                  {auth.surName} {auth.firstName} {auth.patronymic}
               </div>
               <Button className='buttonExit' variant="contained" onClick={()=>exitAuth()}>
                  Выйти
               </Button>
               </div>
            )}
         </div>
     </div>
    );
  };
  