import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from '../../axios';


export const fetchWork = createAsyncThunk("/work/fetchWork", async (params)=>{
    const {data} = await axios.get("/works");
    return data
});


const initialState = {
    worksData: {
        product: null,
        status: 'loading'
    }
};


const worksSlice = createSlice({
    name:'work',
    initialState,
    reducers:{
        logout: (state) => {
            state.worksData.product = null
        }
    },
    extraReducers: {
        [fetchWork.pending]: (state) => {
            state.worksData.product = null;
            state.worksData.status = "loading";  
        },
        [fetchWork.fulfilled]: (state, action)=>{
            state.worksData.product = action.payload;
            state.worksData.status = "loaded";
        }
    }
});
 

export const worksReducer = worksSlice.reducer;