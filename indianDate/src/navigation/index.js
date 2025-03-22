import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import SplashNavigation from './type/StackNavigation';
import { navigationRef } from './navigationService'
import Splash from '../container/Splash';
import { initialStorageValueGet } from '../utils/AsyncStorage';
import OnBoarding from '../container/OnBoarding';
import AppNavigation from './type/AppNavigation';
import AuthNavigation from './type/AuthNavigation';

export default function AppNavigator({navigation}) {
  const [isLoading, setIsLoading] = useState(true)
  const [showScreen, setShowScreen] = useState('boarding')

  useEffect(() => {
    checkForNavigation()
  }, [])

  const checkForNavigation = async () => {
    try {
      let asyncData = await initialStorageValueGet();
      let { onBoardingValue, acessTokenValue } = asyncData;
      if (!!asyncData) {
        if (!!acessTokenValue) {
          setShowScreen('loggedIn')
        } else if (!!onBoardingValue) {
          setShowScreen('Login')
        }
      }
      setIsLoading(false)
    } catch (e) {
      console.log('error ', e);
    }
  }

  return (
    isLoading ? <Splash /> :
    <NavigationContainer ref={navigationRef}>
      {
        showScreen === "boarding" ? <OnBoarding /> :
        (
          showScreen === "loggedIn" ? <AppNavigation /> : <AuthNavigation />
        )
      }
    </NavigationContainer>
  );
}
