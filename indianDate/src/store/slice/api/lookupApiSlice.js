import { apiSlice } from "./apiSlice";

const lookupApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
      getLookupValue: builder.query({
        query: (data) => ({
            url: `lookup/${data}`,
            credentials: 'include'
        })
    })
    })
})

export const { useGetLookupValueQuery } = lookupApiSlice;

export default lookupApiSlice