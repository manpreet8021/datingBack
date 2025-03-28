import AsyncStorage from '@react-native-async-storage/async-storage';
import {ACCESS_TOKEN, ACCOUNT_CREATED, ACCOUNT_PARTIAL_CREATED, ON_BOARDING, THEME} from '../common/constants';

//get Value
const initialValueGet = async () => {
  let asyncData = await AsyncStorage.multiGet([ON_BOARDING, ACCESS_TOKEN]);

  const onBoardingValue = !!asyncData[0][1]
    ? JSON.parse(asyncData[0][1])
    : false;
  const acessTokenValue = !!asyncData[1][1]
    ? JSON.parse(asyncData[1][1])
    : false;
  return {onBoardingValue, acessTokenValue};
};

//SetOnBoarding
const setOnBoarding = async value => {
  const stringifyData = JSON.stringify(value);
  await AsyncStorage.setItem(ON_BOARDING, stringifyData);
  return;
};
// Set Async Storage Data
const setAsyncStorageData = async (key, value) => {
  const stringData = JSON.stringify(value);
  await AsyncStorage.setItem(key, stringData);
};

// Get Async Storage Data
const getAsyncStorageData = async key => {
  if (!key) {
    console.warn('Key is null or undefined');
    return null;
  }
  const data = await AsyncStorage.getItem(key);
  return JSON.parse(data);
};
//SetAccessToken
const setAuthToken = async value => {
  const stringifyData = JSON.stringify(value);
  await AsyncStorage.setItem(ACCESS_TOKEN, stringifyData);
  return;
};

// Remove Async Storage Data
const removeAsyncStorageData = async key => {
  await AsyncStorage.removeItem(key);
};

const initialStorageValueGet = async () => {
  let asyncData = await AsyncStorage.multiGet([
    THEME,
    ON_BOARDING,
    ACCOUNT_CREATED,
    ACCOUNT_PARTIAL_CREATED
  ]);
  const themeColor = JSON.parse(asyncData[0][1]);
  const onBoardingValue = JSON.parse(asyncData[1][1]);
  const accountCreated = JSON.parse(asyncData[2][1])
  const accountPartialCreated = JSON.parse(asyncData[3][1])
  return {themeColor, onBoardingValue, accountCreated, accountPartialCreated};
};
export {
  initialValueGet,
  setAuthToken,
  setOnBoarding,
  initialStorageValueGet,
  setAsyncStorageData,
  getAsyncStorageData,
  removeAsyncStorageData,
};
