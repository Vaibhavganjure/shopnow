import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { api,privateApi } from "../../component/services/api"

export const getAllProducts = createAsyncThunk(
    "products/getAllProducts",
    async () => {
        const response = await api.get("/products/all");
        return response.data.data;
    }
)

export const addNewProduct = createAsyncThunk(
    "products/addNewProduct",
    async (product) => {
        const response = await privateApi.post("/products/add",product);
        // console.log("add product response from slice 1",response.data)
        // console.log("add product response from slice 2" ,response.data.data)
        return response.data.data;
    }
)

export const getAllBrands = createAsyncThunk(
    "brands/getAllBrands",
    async () => {
        const response = await api.get("products/distinct/brands");
        // console.log(response.data.data)
        return response.data.data;
    }
)

export const getdistinctProducts = createAsyncThunk(
    "distinctProducts/getdistinctProducts",
    async () => {
        const response = await api.get("products/distinct/products");
        return response.data.data;
    }
)

export const updateProduct = createAsyncThunk(
    "Products/updateProduct",
    async ({ productId, updatedProduct }) => {
        // console.log("the update info :",updateProduct)
        // console.log("the update id : ",productId)
        const response =await privateApi.put(`/products/update/${productId}`, updatedProduct)
        return response.data.data; 
    }
);


export const getProductByID = createAsyncThunk(
    "product/getProductByID",
    async (productId) => {
        const response = await api.get(`/products/product/${productId}`);
        return response.data.data;
    }
)
export const deleteProductById = createAsyncThunk(
    "product/deleteProductById",
    async (productId) => {
        const response = await privateApi.delete(`/products/${productId}/delete`);
 
       console.log("delete 2: ",response.data)
      
        return response.data;
    }
)

export const getProductsByCategory = createAsyncThunk(
    "product/getProductsByCategory",
    async (categoryId) => {
        const response = await api.get(`/products/category/${categoryId}/products/`);
        return response.data.data;
    }
)
const initialState = {
    products: [],
    product: null,
    brands: [],
    selectedBrands: [],
    errorMessage: null,
    isLoading: true,
    distinctProducts: [],
    quantity: 1
}
const productSlice = createSlice(
    {
        name: "product",
        initialState: initialState,
        reducers: {
            filterByBrands: (state, action) => {

                const { brand, isChecked } = action.payload;
                if (isChecked) {
                    state.selectedBrands.push(brand);
                } else {
                    state.selectedBrands = state.selectedBrands.filter((b) => b !== brand);
                }
            }
            ,
            setQuantity: (state, action) => {
                state.quantity = action.payload
            },
            addBrand: (state, action) => {
                state.brands.push(action.payload)
            }
        }
        ,
        extraReducers: (builder) => {
            builder.addCase(getAllProducts.fulfilled, (state, action) => {
                state.products = action.payload;
                state.errorMessage = null;
                state.isLoading = false
            })
                .addCase(getAllProducts.rejected, (state, action) => {
                    state.errorMessage = action.error.message;

                })
                
                .addCase(getAllBrands.fulfilled, (state, action) => {
                    state.brands = action.payload;
                    state.isLoading = false

                })
                .addCase(getdistinctProducts.fulfilled, (state, action) => {
                    state.distinctProducts = action.payload
                    state.isLoading = false
                })
                .addCase(getProductByID.fulfilled, (state, action) => {
                    state.product = action.payload
                    state.isLoading = false
                })
                .addCase(getProductsByCategory.fulfilled, (state, action) => {
                    state.products = action.payload
                    state.isLoading = false
                    state.errorMessage = null
                })
                .addCase(addNewProduct.fulfilled,(state,action)=>{
                    state.products.push(action.payload)
                    state.errorMessage=null
                    state.isLoading=false
                })
                .addCase(updateProduct.fulfilled,(state,action)=>{
                    state.product=action.payload
                })
                .addCase(deleteProductById.fulfilled,(state,action)=>{
                    state.products=state.products.filter((product)=>product.id !== action.payload.data)
                })
        }

    }
)
export const { filterByBrands, setQuantity ,addBrand} = productSlice.actions
export default productSlice.reducer;