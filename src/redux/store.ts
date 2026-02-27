import {configureStore} from "@reduxjs/toolkit"
import productReducer from "./fetures/productSlice"
import authReducer from "./fetures/authSlice"

export const store=configureStore({
    reducer:{
        product:productReducer,
        auth:authReducer
    }
})

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;