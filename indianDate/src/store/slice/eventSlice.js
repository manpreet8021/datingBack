import eventApiSlice from './api/eventApiSlice';

const { createSlice } = require('@reduxjs/toolkit');
const initialState = {
  events: [],
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
        state.events = [...state.events, ...payload];
      }
    )
  }
});

export const { setEventLocation } = eventSlice.actions;
export default eventSlice.reducer;