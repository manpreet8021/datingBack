import {View} from 'react-native';
import React from 'react';
import AppNavigator from './navigation';
import {styles} from './themes';
import { Provider } from "react-redux";
import { store } from "./store/store";
import firebaseApp from './utils/FirebaseIntialize';

const App = () => {
  return (
    <View style={styles.flex}>
      <Provider store={store}>
        <AppNavigator />
      </Provider>
    </View>
  );
};

export default App;
