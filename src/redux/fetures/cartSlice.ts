import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import items from "razorpay/dist/types/items";

export interface CartItem{
    id:string,
    title:string,
    price:number,
    image: string
    quantity: number
}

interface CartState {
  items: CartItem[];
}

const initialState: CartState = {
  items: [],
};

const cartSlice=createSlice({
    name: "cart",
    initialState,
    reducers: {
        addToCart:(state,action:PayloadAction<Omit<CartItem,"quantity">>)=>{
            const existedItem=state.items.find(
                (item)=> item.id === action.payload.id
            )
            if(existedItem){
                existedItem.quantity +=1
            }
            else{
                state.items.push({
                    ...action.payload,
                    quantity: 1
                })
            }
        },
        removeFromCart:(state, action: PayloadAction<string>)=>{
            state.items=state.items.filter((item) =>item.id !== action.payload)
        },
        increaseQuantity: (state, action: PayloadAction<string>) => {
            const item = state.items.find(
                (item) => item.id === action.payload
            );
            if (item) {
                item.quantity += 1;
            }
        }, 
        decreaseQuantity:(state, action: PayloadAction<string>)=>{
            const item=state.items.find(
                (item)=> item.id ===action.payload
            )
            if (item && item.quantity > 1) {
                item.quantity -= 1;
            }
        },
        clearCart:(state)=>{
            state.items=[]
        }
    },

})

export const {
    addToCart,
    removeFromCart,
    increaseQuantity,
    decreaseQuantity,
    clearCart,
    } = 
cartSlice.actions;

export default cartSlice.reducer;