const {createSlice} = require('@reduxjs/toolkit');
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
    
  },
});

export const { setEventLocation } = eventSlice.actions;
export default eventSlice.reducer;