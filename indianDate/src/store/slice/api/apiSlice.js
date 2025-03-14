import {createApi, fetchBaseQuery} from '@reduxjs/toolkit/query/react';
import {BASE_URL} from '@env';
import EncryptedStorage from 'react-native-encrypted-storage';
import { navigate } from '../../../navigation/navigationService';

const baseQuery = fetchBaseQuery({
  baseUrl: BASE_URL,
  prepareHeaders: async (headers, {getState}) => {
    const token = await EncryptedStorage.getItem('token');

    if (token) {
      headers.set('Authorization', `Bearer ${token}`);
    }

    return headers;
  },
});

const baseQueryWith401Handler = async (args, api, extraOptions) => {
  const result = await baseQuery(args, api, extraOptions);

  if (result?.error?.status === 401) {
    // api.dispatch(logout());
    navigate('LogIn'); // Reset nav to Login screen
  }

  return result;
};

export const apiSlice = createApi({
  baseQuery: baseQueryWith401Handler,
  endpoints: builder => ({}),
});
