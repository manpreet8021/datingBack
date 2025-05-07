import React from 'react';
import { AuthNav } from '../navigationKey';
import { AuthRoute } from '../navigationRoute';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

const Stack = createNativeStackNavigator();

export default function AuthNavigation() {
  return (
    <Stack.Navigator
      screenOptions={{ headerShown: false }}
      initialRouteName={AuthNav.LogIn}>
      <Stack.Screen name={AuthNav.LogIn} component={AuthRoute.LogIn} />
      <Stack.Screen
        name={AuthNav.AccountName}
        component={AuthRoute.AccountName}
      />
      <Stack.Screen
        name={AuthNav.EnterBirthDate}
        component={AuthRoute.EnterBirthDate}
      />
      <Stack.Screen
        name={AuthNav.SelectGender}
        component={AuthRoute.SelectGender}
      />
      <Stack.Screen
        name={AuthNav.LookingFor}
        component={AuthRoute.LookingFor}
      />
      <Stack.Screen
        name={AuthNav.SelectInterest}
        component={AuthRoute.SelectInterest}
      />
      <Stack.Screen
        name={AuthNav.UploadPhoto}
        component={AuthRoute.UploadPhoto}
      />
      <Stack.Screen
        name={AuthNav.VerifyLoginOtp}
        component={AuthRoute.VerifyLoginOtp}
      />
    </Stack.Navigator>
  );
}
