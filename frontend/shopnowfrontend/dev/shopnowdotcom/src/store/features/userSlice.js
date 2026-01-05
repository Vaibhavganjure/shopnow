import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { api, privateApi } from "../../component/services/api"
import axios from "axios";

export const getUserByID = createAsyncThunk(
    "user/getUserByID",
    async (userId) => {
        const response = await api.get(`/users/${userId}/get`);
        return response.data;
    }
);

export const getCountryNames = createAsyncThunk(
    "user/getCountryNames",
    async () => {
        const response = await axios.get("https://restcountries.com/v3.1/all?fields=name");
        const countryNames = response.data.map((country) =>({ 
            name:country.name.common,
            code:country.cca2
        }));
        countryNames.sort((a,b)=>a.name.localeCompare(b.name))
        return countryNames;
    }
);

export const registerUser = createAsyncThunk(
    "user/registerUser",
    async ({ user, addresses }) => {
        const payload = {
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            password: user.password,
            addressList: addresses
        }
        const response = await api.post("/users/add", payload);
        return response.data;
    }
);

export const addAddress = createAsyncThunk(
    "user/addAddress",
    async ({ address, userId }) => {
        const response = await privateApi.post(`/address/${userId}/new`,[address]);
        return response.data;
    }
);

export const fetchAddresses = createAsyncThunk(
    "user/fetchAddresses",
    async (userId) => {
        console.log("Fetching addresses for user:", userId);
        const response = await privateApi.get( `/address/${userId}/address`);
        return response.data;
    }
);

export const updateAddress = createAsyncThunk(
    "user/updateAddress",
    async ({ id, address }) => {
        const response = await privateApi.put( `/address/${id}/update`, address );
        return response.data;
    }
);

export const deleteAddress = createAsyncThunk(
    "user/deleteAddress",
    async ({id}) => {
        const response = await privateApi.delete(`/address/${id}/delete`);
        return { id, data: response.data };
    }
);

const initialState = {
    user: null,
    loading: false,
    errorMessage: null,
    
};

const userSlice = createSlice({
    name: "user",
    initialState: initialState,
    reducers: {
        setUser: (state, action) => {
            state.user = action.payload;
            state.loading
            state.error = null;
        },
        setLoading: (state, action) => {
            state.loading = action.payload;
        },
        setError: (state, action) => {
            state.error = action.payload;
            state.loading = false;
        },
        setUserAddresses(state,action){
            state.user.data.addresses=action.payload
        }

    },
    extraReducers: (builder) => {
        builder.addCase(getUserByID.fulfilled, (state, action) => {
            state.user = action.payload;
            state.loading = false;
        }).
            addCase(getUserByID.rejected, (state, action) => {
                state.errorMessage = action.error.message;
                state.loading = false;
            }
            ).addCase(registerUser.fulfilled, (state, action) => {
                state.user = action.payload;
                state.loading = false;
            }).addCase(registerUser.rejected, (state, action) => {
                state.errorMessage = action.error.message;
                state.loading = false;
            }
            );
    },
});



export default userSlice.reducer;
export const { setUser, setLoading, setError,setUserAddresses } = userSlice.actions;