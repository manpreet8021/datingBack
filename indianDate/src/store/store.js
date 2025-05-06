import { configureStore } from "@reduxjs/toolkit";
import { apiSlice } from "./slice/api/apiSlice";
import authSliceReducer from "./slice/authSlice";
import lookUpSliceReducer from "./slice/lookupSlice";
import eventSliceReducer from "./slice/eventSlice";
import matchSliceReducer from "./slice/matchSlice";

export const store = configureStore({
    reducer: {
        [apiSlice.reducerPath]: apiSlice.reducer,
        auth: authSliceReducer,
        lookup: lookUpSliceReducer,
        event: eventSliceReducer,
        match: matchSliceReducer,
    },
    middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(apiSlice.middleware),
    devTools: true
});
