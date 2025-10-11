import authApiSlice from './api/authApiSlice';

const {createSlice} = require('@reduxjs/toolkit');
const initialState = {
  userInfo: {
    name: '',
    dob: '',
    gender: '',
    interest: [],
    lookingFor: []
  },
  showScreen: null,
  location: {
    latitude: null,
    longitude: null
  }
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.userInfo = {...state.userInfo, ...action.payload}
    },
    setShowScreen: (state, action) => {
      if(action.payload === "loggedIn") {
        state.userInfo = {
          name: '',
          dob: '',
          gender: '',
          lookingFor: [],
          interest: []
        }
      }
      state.showScreen = action.payload
    },
    setLocation: (state, action) => {
      state.location = action.payload
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

export const { setUser, setShowScreen, setLocation } = authSlice.actions;
export default authSlice.reducer;
