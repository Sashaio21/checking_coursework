import logo from './logo.svg';
import { Box, Button } from '@mui/material';
import './App.css';
import { Header } from './components/Header';
import { Auth } from './pages/Auth';
import { Routes, Route} from 'react-router-dom';
import { StudentPanel } from './pages/StudentPanel';
import { TeacherPanel } from './pages/TeacherPanel';
import { SendWork } from './pages/SendWork';
import { Review } from './pages/Review';
import { StoryReview } from './pages/StoryReview';
import { SendReview } from './pages/SendReview';
import { useDispatch } from 'react-redux';
import { fetchUserMe } from './redux/slices/auth';
import { useEffect } from 'react';
// сюда все страницы

function App() {
  const userDispatch = useDispatch();
  useEffect(()=>{
    userDispatch(fetchUserMe());
  },[])

  return (
    <div className="App">
      <Header></Header>
      <Routes>
        <Route path='/' element={<Auth/>}/>
        <Route path='/student' element={<StudentPanel/>}/>
        <Route path='/teacher' element={<TeacherPanel/>}/>
        <Route path='/send' element={<SendWork/>}/>
        <Route path='/review/:idWork' element={<Review/>}/>
        <Route path="/story/:idWork" element={<StoryReview/>}/>
        <Route path="/sendreview/:idStudent" element={<SendReview/>}/>
      </Routes>
    </div>
  );
}

export default App;