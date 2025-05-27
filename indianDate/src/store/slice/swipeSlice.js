import swipeApiSlice from './api/swipeApiSlice';

const {createSlice} = require('@reduxjs/toolkit');
const initialState = {
  users: []
};

const swipe = createSlice({
  name: 'swipe',
  initialState,
  extraReducers(builder) {
    builder.addMatcher(
      swipeApiSlice.endpoints.getUserForSwipe.matchFulfilled,
      (state, {payload}) => {
        state.users = {...state.users, ...payload};
      },
    );
  },
});

export default swipe.reducer;
