import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import SplashNavigation from './type/StackNavigation';
import { navigationRef } from './navigationService'
import Splash from '../container/Splash';
import { initialStorageValueGet } from '../utils/AsyncStorage';
import OnBoarding from '../container/OnBoarding';
import AppNavigation from './type/AppNavigation';
import AuthNavigation from './type/AuthNavigation';
import { setShowScreen } from '../store/slice/authSlice';
import { useDispatch, useSelector } from 'react-redux';

export default function AppNavigator({navigation}) {
  const [isLoading, setIsLoading] = useState(true)
  const auth = useSelector(state => state.auth)
  const dispatch = useDispatch()

  useEffect(() => {
    checkForNavigation()
  }, [])

  const checkForNavigation = async () => {
    try {
      let asyncData = await initialStorageValueGet();
      if (!asyncData) {
        dispatch(setShowScreen('onBoarding'))
      } else {
        const { onBoardingValue, accountPartialCreated, accountCreated } = asyncData;
        if (accountCreated) {
          dispatch(setShowScreen('AppScreen'));
        } else if (accountPartialCreated || onBoardingValue) {
          dispatch(setShowScreen('loggedIn'))
        } else {
          dispatch(setShowScreen('onBoarding'))
        }
      }
    } catch (e) {
      dispatch(setShowScreen('onBoarding'))
    } finally {
      setIsLoading(false);
    }
  };

  return (
    isLoading ? <Splash /> :
    <NavigationContainer ref={navigationRef}>
      {
        auth.showScreen === "onBoarding" ? <OnBoarding /> :
        (
          auth.showScreen === "AppScreen" ? <AppNavigation /> : <AuthNavigation />
        )
      }
    </NavigationContainer>
  );
}
