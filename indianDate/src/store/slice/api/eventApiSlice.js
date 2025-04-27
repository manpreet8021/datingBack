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
                url: 'event/',
                method: 'PUT',
                body: data,
                credentials: 'include'
            }),
        }),
        fetchEvents: builder.mutation({
            query: (data) => ({
                url: `event/?latitude=${data.latitude}&longitude=${data.longitude}&getUserEvent=${data.getUserEvent}`,
                method: 'GET',
            })
        })
    })
})

export const { useGetEventsQuery, useAddEventMutation, useUpdateEventMutation, useFetchEventsMutation } = eventApiSlice;

export default eventApiSlice