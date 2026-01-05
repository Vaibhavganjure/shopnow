import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { api,privateApi } from "../../component/services/api"

export const placeOrder = createAsyncThunk(
    "order/placeOrder",
    async ({userId}) => {
        const response = await privateApi.post(`/orders/user/${userId}/place-order`)
        //    console.log("orders1 ",response.data)
        //    console.log("orders2 ",response.data.data)
        return response.data
    }
)

export const getUserOrders = createAsyncThunk(
    "order/getUserOrders",
    async (userId) => {
        const response = await privateApi.get(`orders/user/${userId}/all`)
        return response.data.data
    }
)

export const createPaymentIntent = createAsyncThunk(
    "payments/createPaymentIntent",
    async ({ amount, currency }) => {
        console.log("create payment intent slice",{amount,currency})
        const response = await privateApi.post("/orders/create-payment-intent", {
            amount,
            currency,
        });
        return response.data;
    }
);


const initialState = {
    orders: [],
    errorMessage: null,
    isLoading: true,
    successMessage: null,
   
}

const orderSlice = createSlice({
    name: "order",
    initialState: initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(placeOrder.fulfilled, (state, action) => {
            // state.orders = action.payload
            state.isLoading = false
            state.successMessage = action.payload.message
        })
            .addCase(getUserOrders.fulfilled, (state, action) => {
                state.orders = Array.isArray(action.payload) ? action.payload : [];

                state.successMessage = action.payload.message
            })
    }
}
)
export default orderSlice.reducer;