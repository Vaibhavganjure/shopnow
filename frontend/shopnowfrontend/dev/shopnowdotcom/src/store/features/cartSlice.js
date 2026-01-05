import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { api ,privateApi} from "../../component/services/api"


export const addToCart = createAsyncThunk(
    "cart/addToCart",
    async ({ productId, quantity }) => {
        const formData = new FormData();
        formData.append("productId", productId);
        formData.append("quantity", quantity);

        const response = await privateApi.post("/cartItems/item/add", formData);
        // console.log("slice",response.data)
        return response.data

    }
);


export const getUserCart = createAsyncThunk(
    "cart/getUserCart",
    async (userId) => {
        const response = await privateApi.get(`/carts/user/${userId}/cart`)
        //    console.log("slice cart", response.data)
        return response.data
    }
)
export const updateQuantity = createAsyncThunk(
    "cart/updateQuantity",
    async ({ cartId, itemId, newQuantity }) => {
        await privateApi.put(`/cartItems/cart/${cartId}/item/${itemId}/update?quantity=${newQuantity}`)
        return { itemId, newQuantity }
    }
)

export const removeItemFromCart = createAsyncThunk(
    "cart/removeItemFromCart",
    async ({ cartId, itemId }) => {
        await privateApi.delete(`/cartItems/cart/${cartId}/item/${itemId}/remove`)
        return { itemId, message: "Item Removed Successfully!" }
    }
)

const initialState = {
    items: [],
    errorMessage: null,
    successMessage: null,
    totalAmount: 0,
    cartId: null,
    isLoading: true
}

const cartSlice = createSlice({
    name: "cart",
    initialState: initialState,
    reducers: {
        clearCartMessages(state) {
            state.successMessage = null;
            state.errorMessage = null;
        },
        clearCart: (state) => {
            state.items = []
            state.totalAmount = 0
        }

    },
    extraReducers: (builder) => {
        builder.addCase(addToCart.fulfilled, (state, action) => {
            state.successMessage = action.payload.message
            state.items.push(action.payload.data)
        })
            .addCase(addToCart.rejected, (state, action) => {
                state.errorMessage = action.error.message
            })
            .addCase(getUserCart.fulfilled, (state, action) => {
                state.items = action.payload.data.items
                state.cartId = action.payload.data.id
                state.totalAmount = action.payload.data.totalAmount
                state.errorMessage = null
                state.isLoading = false
            })
            .addCase(getUserCart.rejected, (state, action) => {
                state.errorMessage = action.error.message
            })
            .addCase(updateQuantity.fulfilled, (state, action) => {

                const { itemId, newQuantity } = action.payload
                const item = state.items.find((item) => item.productId === itemId)
                if (item) {
                    item.quantity = newQuantity
                    item.totalPrice = item.productPrice * newQuantity
                }
                state.totalAmount = state
                    .items.reduce(
                        (total, item) => total + item.totalPrice, 0
                    )

            })
            .addCase(removeItemFromCart.fulfilled, (state, action) => {
                const { itemId, message } = action.payload
                state.items = state.items.filter((item) => item.productId !== itemId)
                state.totalAmount = state.items.reduce((total, item) => total + item.totalPrice, 0)
                state.successMessage = message
            })
    }
})
export const { clearCartMessages, clearCart } = cartSlice.actions
export default cartSlice.reducer