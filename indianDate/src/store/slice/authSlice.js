import authApiSlice from "./api/authApiSlice";

const { createSlice } = require("@reduxjs/toolkit")

const initialState = {
    userInfo: null
}

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        logout: (state, action) => {
            state.userInfo = null
        },
        setToken: (state, action) => {
            state.userInfo = action.payload
        }
    },
    extraReducers(builder) {
        builder.addMatcher(
            authApiSlice.endpoints.sendOtp.matchFulfilled,
            (state, { payload }) => {
                state.userInfo = payload
            }
        ),
        builder.addMatcher(
            authApiSlice.endpoints.googleLogin.matchFulfilled,
            (state, { payload }) => {
                state.userInfo = payload
            }
        ),
        builder.addMatcher(
            authApiSlice.endpoints.validateOtp.matchFulfilled,
            (state, {payload}) => {
                state.userInfo = payload
            }
        )
    }
})

export const { logout, setToken } = authSlice.actions

export default authSlice.reducer