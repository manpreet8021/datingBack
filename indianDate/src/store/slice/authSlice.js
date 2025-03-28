import authApiSlice from './api/authApiSlice';

const {createSlice} = require('@reduxjs/toolkit');
const initialState = {
  userInfo: {
    name: '',
    dob: '',
    gender: '',
    interest: []
  },
  showScreen: null
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.userInfo = {...state.userInfo, ...action.payload}
    },
    setShowScreen: (state, action) => {
      state.showScreen = action.payload
    }
  },
  extraReducers(builder) {
    builder.addMatcher(
      authApiSlice.endpoints.googleLogin.matchFulfilled,
      (state, {payload}) => {
        state.userInfo = {...state.userInfo, ...payload};
      },
    ),
    builder.addMatcher(
      authApiSlice.endpoints.validateOtp.matchFulfilled,
      (state, {payload}) => {
        state.userInfo = {...state.userInfo, ...payload};
      }
    )
  },
});

export const { setUser, setShowScreen } = authSlice.actions;
export default authSlice.reducer;
