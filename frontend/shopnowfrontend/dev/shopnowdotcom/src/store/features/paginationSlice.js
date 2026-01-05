import { createSlice, current } from "@reduxjs/toolkit";

const initialState = {
    itemsPerPage: 10,
    totalItems: 0,
    currentPage: 1
}
const paginationSlice = createSlice({
    name: "pagination",
    initialState: initialState,
    reducers: {
        setItemsPerPage: (state, action) => {
            state.itemsPerPage = action.payload;
        },
        setTotalItems: (state, action) => {
            state.totalItems = action.payload;
        },
        setCurrentPage: (state, action) => {
            state.currentPage = action.payload;
        }
    }

}
)
export default paginationSlice.reducer;
export const {setCurrentPage,setItemsPerPage,setTotalItems}=paginationSlice.actions;