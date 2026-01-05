import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { api, privateApi } from "../../component/services/api"

export const searchByImage = createAsyncThunk(
    "search/searchByImage",
    async (imageFile) => {
        const formData = new FormData()
        formData.append("image", imageFile)
        const response = await api.post("/products/search-by-image", formData)
        return response.data
    }
)


const initialState = {
    searchQuery: "",
    selectedCategory: "all",
    imageSearch: null,
    imageSearchResults: []

}

const searchSlice = createSlice({
    name: "search",
    initialState,
    reducers: {
        setSearchQuery: (state, action) => {
            state.searchQuery = action.payload;
        },
        setSelectedCategory: (state, action) => {
            state.selectedCategory = action.payload;
        },
        clearFilters: (state) => {
            state.selectedCategory = "all"
            state.searchQuery = ""
            state.imageSearch=null
            state.imageSearchResults=[]
        },
        setInitialSearchQuery: (state, action) => {
            state.searchQuery = action.payload
        },
        setImageSearch: (state, action) => {
            state.imageSearch = action.payload
        }
    },
    extraReducers: (builder) => {
        builder.addCase(searchByImage.fulfilled, (state,action) => {
            state.imageSearchResults = action.payload
        })
    }
})

export const { setSearchQuery, setSelectedCategory, setImageSearch,clearFilters, setInitialSearchQuery } = searchSlice.actions;
export default searchSlice.reducer;