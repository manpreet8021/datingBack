import { apiSlice } from "./apiSlice";

const swipeApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
      getUserForSwipe: builder.query({
        query: () => ({
            url: `swipe/`,
            method: 'GET'
        })
    })
    })
})

export const { useGetUserForSwipeQuery } = swipeApiSlice;

export default swipeApiSlice