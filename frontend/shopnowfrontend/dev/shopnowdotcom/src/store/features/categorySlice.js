import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { api } from "../../component/services/api"

export const getAllCategories = createAsyncThunk(
    "category/getAllCategories",
    async () => {
        const response = await api.get("/categories/all");
        // console.log(response.data.data)
        return response.data.data;
    }
)

const initialState = {
    categories: [],
    errorMessage: null,
    isloading: false
}
const categorySlice = createSlice(
    {
        name: "category",
        initialState: initialState,
        reducers: {
            addCategory: (state, action) => {
                state.categories.push({
                    // id: Date.now(),         // temporary id for UI
                    name: action.payload    // new category name
                })
            }
        },
        extraReducers: (builder) => {
            builder.addCase(getAllCategories.fulfilled, (state, action) => {
                state.categories = action.payload;
                state.errorMessage = null;
            })
                .addCase(getAllCategories.rejected, (state, action) => {
                    state.errorMessage = action.error.message;


                })

        }

    }
)
export default categorySlice.reducer;
export const { addCategory } = categorySlice.actions