import matchApiSlice from './api/matchApiSlice';

const {createSlice} = require('@reduxjs/toolkit');
const initialState = {

};

const match = createSlice({
  name: 'match',
  initialState,
  extraReducers(builder) {
    
  },
});

export default match.reducer;
