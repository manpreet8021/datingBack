import { apiSlice } from "./apiSlice";

const userApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        sendOtp: builder.mutation({
            query: (data) => ({
                url: 'auth/sendOtp',
                method: 'POST',
                body: data,
                credentials: 'include'
            })
        }),
        validateOtp: builder.mutation({
            query: (data) => ({
                url: 'auth/validateOtp',
                method: 'POST',
                body: data,
                credentials: 'include'
            })
        }),
        updateUserDetail: builder.mutation({
            query: (data) => ({
                url: 'auth/',
                method: 'PUT',
                body: data,
                credentials: 'include'
            }),
        }),
        googleLogin: builder.mutation({
            query: (data) => ({
                url: 'auth/googleLogin',
                method: 'POST',
                body: data,
                credentials: 'include'
            }),
        }),
        logout: builder.mutation({
            query: () => ({
                url: 'auth/logout',
                method: 'POST',
                credentials: 'include'
            })
        })
    })
})

export const { useSendOtpMutation, useValidateOtpMutation, useUpdateUserDetailMutation, useGoogleLoginMutation, useLogoutMutation } = userApiSlice;

export default userApiSlice