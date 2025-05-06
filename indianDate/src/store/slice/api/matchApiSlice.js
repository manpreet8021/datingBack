import { apiSlice } from "./apiSlice";

const matchApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
      setEventMatch: builder.mutation({
        query: (data) => ({
            url: `match/`,
            method: 'POST',
            body: data,
            credentials: 'include'
        })
    })
    })
})

export const { useSetEventMatchMutation } = matchApiSlice;

export default matchApiSlice