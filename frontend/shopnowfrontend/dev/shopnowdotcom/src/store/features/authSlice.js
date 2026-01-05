import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { api,privateApi } from "../../component/services/api"
import {jwtDecode} from 'jwt-decode';

export const login = createAsyncThunk("auth/login",
    async ({ email, password }) => {
        const response = await privateApi.post("/auth/login", { email, password });
        console.log(response)
        return response.data;
    }
);

const initialState = {
    isAuthenticated: !!localStorage.getItem("authToken"),
    token: localStorage.getItem("authToken") || null,
    roles: JSON.parse(localStorage.getItem("userRoles")) || [],
    errorMessage: null,
};
const authSlice = createSlice({
    name: "auth",
    initialState: initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(login.fulfilled, (state, action) => {
            state.isAuthenticated = true;
            state.token = action.payload.accessToken;
            const decodedToken = jwtDecode(action.payload.accessToken);
            state.roles = decodedToken.roles || [];

            // ✅ EXISTING CODE
            localStorage.setItem("authToken", action.payload.accessToken);

            // 🟢 ADD THIS NEW LINE HERE
            localStorage.setItem("refreshToken", action.payload.refreshToken); 

            // ✅ EXISTING CODE
            localStorage.setItem("userRoles", JSON.stringify(decodedToken.roles));
            localStorage.setItem("userId", decodedToken.id);
        })
        .addCase(login.rejected, (state, action) => {
            state.errorMessage = action.error.message;
        });
    },
});
export default authSlice.reducer;
