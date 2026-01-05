import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { api } from "../../component/services/api"

export const uploadImages = createAsyncThunk(
    "image/uploadImages",
    async ({productId, files}) => {
        const formData = new FormData()
        if (Array.isArray(files)) {
            files.forEach((file) => {
                formData.append("files", file)
            })}
            else{
                formData.append("files",files)
            }
        
        formData.append("productId", productId)
        const response = await api.post("/images/upload",formData)
        // console.log(response)
        return response.data
        
    }
)

export const updateProductImage=createAsyncThunk(
    "images/updateProductImage",
    async({imageId,file,productId})=>{
        const formData=new FormData()
        formData.append("file",file)
        formData.append("productId",productId)
        const  response=await api.put(`/images/image/${imageId}/update`,formData)
        return response.data
    }
)

export const deleteProductImage=createAsyncThunk(
    "image/deleteProductImage",
    async({imageId})=>{
        const response=await api.delete(`/images/delete/${imageId}`)
        return response.data
    }
)
const initialState = {
    uploadedImages: []
}

const imageSlice = createSlice({
    name: "image",
    initialState: initialState,
    reducers: {},
    extraReducers: (builder)=>{
        builder.addCase(uploadImages.fulfilled,(state,action)=>{
            state.uploadedImages=[...state.uploadedImages,...action.payload.data]
        })
        .addCase(updateProductImage.fulfilled,(state,action)=>{
            state.uploadedImages=[...state.uploadedImages,...action.payload.data]
        })
    }

})
export default imageSlice.reducer
