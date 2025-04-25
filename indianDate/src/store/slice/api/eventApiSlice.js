import { apiSlice } from "./apiSlice";

const eventApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getEvents: builder.query({
            query: (data) => ({
                url: 'event/',
                credentials: 'include'
            })
        }),
        addEvent: builder.mutation({
            query: (data) => ({
                url: 'event/',
                method: 'POST',
                body: data,
                credentials: 'include'
            })
        }),
        updateEvent: builder.mutation({
            query: (data) => ({
                url: 'auth/',
                method: 'PUT',
                body: data,
                credentials: 'include'
            }),
        }),
    })
})

export const { useGetEventsQuery, useAddEventMutation, useUpdateEventMutation } = eventApiSlice;

export default eventApiSlice