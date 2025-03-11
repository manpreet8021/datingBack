import lookupApiSlice from './api/lookupApiSlice';

const {createSlice} = require('@reduxjs/toolkit');
const initialState = {
  lookup: {},
};

const lookup = createSlice({
  name: 'lookup',
  initialState,
  extraReducers(builder) {
    builder.addMatcher(
      lookupApiSlice.endpoints.getLookupValue.matchFulfilled,
      (state, {payload}) => {
        console.log(payload)
        state.lookup = {...state.lookup, ...payload};
      },
    );
  },
});

export default lookup.reducer;
