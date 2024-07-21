import { configureStore } from "@reduxjs/toolkit";
import { userReducer } from "./slices/auth";
import { worksReducer } from "./slices/works";

const store = configureStore({
    reducer: {
        auth: userReducer,
        work: worksReducer
    }
});


export default store;


