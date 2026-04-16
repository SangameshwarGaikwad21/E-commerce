import {configureStore} from "@reduxjs/toolkit"
import productReducer from "./fetures/productSlice"
import authReducer from "./fetures/authSlice"
import cartReducer from "./fetures/cartSlice"
import addAddress  from "./fetures/addresSlice"
import  OrderItem  from "./fetures/orderSlice"

export const store=configureStore({
    reducer:{
        product:productReducer,
        auth:authReducer,
        cart:cartReducer,
        address:addAddress,
        order:OrderItem
    }
})

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;