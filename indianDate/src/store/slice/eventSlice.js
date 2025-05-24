import eventApiSlice from './api/eventApiSlice';

const { createSlice } = require('@reduxjs/toolkit');
const initialState = {
  events: [],
  userEvents: [],
  AddEventLocation: {
    latitude: null,
    longitude: null
  }
};

const eventSlice = createSlice({
  name: 'event',
  initialState,
  reducers: {
    setEventLocation: (state, action) => {
      state.AddEventLocation = action.payload
    }
  },
  extraReducers(builder) {
    builder.addMatcher(
      eventApiSlice.endpoints.fetchEvents.matchFulfilled,
      (state, { payload }) => {
        if(payload.userEvents) {
          state.userEvents = [...state.events, ...payload.events];
        } else {
          state.events = [...state.events, ...payload.events];
        }
      }
    )
  }
});

export const { setEventLocation } = eventSlice.actions;
export default eventSlice.reducer;