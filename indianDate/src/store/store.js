import { configureStore } from "@reduxjs/toolkit";
import { apiSlice } from "./slice/api/apiSlice";
import authSliceReducer from "./slice/authSlice";
import lookUpSliceReducer from "./slice/lookupSlice";

export const store = configureStore({
    reducer: {
        [apiSlice.reducerPath]: apiSlice.reducer,
        auth: authSliceReducer,
        lookup: lookUpSliceReducer,
    },
    middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(apiSlice.middleware),
    devTools: true
});
