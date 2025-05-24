import { apiSlice } from "./apiSlice";

const eventApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getEventById: builder.query({
            query: (data) => ({
                url: `event/${data.eventId}`,
                method: 'GET',
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
        fetchEvents: builder.query({
            query: (data) => ({
                url: `event/?latitude=${data.latitude}&longitude=${data.longitude}&getUserEvent=${data.getUserEvent}`,
                method: 'GET',
            })
        })
    })
})

export const { useGetEventByIdQuery, useAddEventMutation, useUpdateEventMutation, useFetchEventsQuery } = eventApiSlice;

export default eventApiSlice