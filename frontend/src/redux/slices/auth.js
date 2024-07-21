import { createSlice } from "@reduxjs/toolkit";
import {createAsyncThunk} from "@reduxjs/toolkit"
import axios from '../../axios';


export const fetchUser = createAsyncThunk("/user/fetchUser", async(params)=>{
    const {data} = await axios.post("/auth/login", params);
    console.log(params)
    return data;
})


export const fetchUserMe = createAsyncThunk("/user/fetchUserMe", async ()=>{
    const {data} = await axios.get("/auth/me");
    return data;
})


const initialState = {
    userData: {
        user: null,
        status: 'loading'
    }
}

const userSlice = createSlice({
    name:"user",
    initialState,
    redusers: {
        logout: (state)=>{
            state.userData.user = null
        }
    },
    extraReducers: {
        [fetchUser.pending]: (state) => {
            state.userData.user = null;
            state.userData.status = "loading";  
        },
        [fetchUser.fulfilled]: (state, action)=>{
            console.log(action)
            state.userData.user = action.payload;
            state.userData.status = "loaded";
        },
        [fetchUserMe.pending]: (state) => {
            state.userData.user = null;
            state.userData.status = "loading";  
        },
        [fetchUserMe.fulfilled]: (state, action)=>{
            state.userData.user = action.payload;
            console.log(action)
            state.userData.status = "loaded";
        },
    }
})

export const selectAuth = (state) => (state.auth.userData.user)
export const userReducer = userSlice.reducer;