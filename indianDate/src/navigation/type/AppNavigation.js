import React from 'react';
import {StackNav} from '../navigationKey';
import {StackRoute} from '../navigationRoute';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

const Stack = createNativeStackNavigator();
export default function AppNavigation() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
      initialRouteName={StackNav.Splash}>
      <Stack.Screen name={StackNav.Splash} component={StackRoute.Splash} />
      <Stack.Screen
        name={StackNav.OnBoarding}
        component={StackRoute.OnBoarding}
      />
      <Stack.Screen
        name={StackNav.TabNavigation}
        component={StackRoute.TabNavigation}
      />
      <Stack.Screen
        name={StackNav.DiscoverByInterest}
        component={StackRoute.DiscoverByInterest}
      />
      <Stack.Screen name={StackNav.Chat} component={StackRoute.Chat} />
      <Stack.Screen name={StackNav.Profile} component={StackRoute.Profile} />
      <Stack.Screen
        name={StackNav.ChooseLanguage}
        component={StackRoute.ChooseLanguage}
      />
      <Stack.Screen name={StackNav.Setting} component={StackRoute.Setting} />
      <Stack.Screen
        name={StackNav.EditProfile}
        component={StackRoute.EditProfile}
      />
      <Stack.Screen
        name={StackNav.MatchesUserDetails}
        component={StackRoute.MatchesUserDetails}
      />
      <Stack.Screen
        name={StackNav.MatchDatingScreen}
        component={StackRoute.MatchDatingScreen}
      />
      <Stack.Screen
        name={StackNav.StoryView}
        component={StackRoute.StoryView}
      />
    </Stack.Navigator>
  );
}
