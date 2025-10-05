import eventApiSlice from './api/eventApiSlice';

const {createSlice} = require('@reduxjs/toolkit');
const initialState = {
  events: [],
  userEvents: [],
  AddEventLocation: {
    latitude: null,
    longitude: null,
  },
};

const eventSlice = createSlice({
  name: 'event',
  initialState,
  reducers: {
    setEventLocation: (state, action) => {
      state.AddEventLocation = action.payload;
    },
  },
  extraReducers(builder) {
    builder.addMatcher(
      eventApiSlice.endpoints.fetchEvents.matchFulfilled,
      (state, {payload}) => {
        state.events = [...state.events, ...payload.events];
      },
    ),
      builder.addMatcher(
        eventApiSlice.endpoints.addEvent.matchFulfilled,
        (state, {payload}) => {
          state.userEvents = [...state.userEvents, payload[0]];
        },
      );
    builder.addMatcher(
      eventApiSlice.endpoints.updateEvent.matchFulfilled,
      (state, {payload}) => {
        state.userEvents = state.userEvents.map(event => 
          event.id === payload[0].id ? payload[0] : event
        );
      },
    ),
      builder.addMatcher(
        eventApiSlice.endpoints.fetchLoggedInUserEvent.matchFulfilled,
        (state, {payload}) => {
          state.userEvents = payload;
        },
      );
  },
});

export const {setEventLocation} = eventSlice.actions;
export default eventSlice.reducer;
