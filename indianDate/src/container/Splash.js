import { StyleSheet, View} from 'react-native';
import React, {useEffect} from 'react';
import SplashScreen from 'react-native-splash-screen';

// custom import
import {colors, styles} from '../themes';
import FText from '../components/common/FText';
import FSafeAreaView from '../components/common/FSafeAreaView';
import strings from '../i18n/strings';
import {getHeight} from '../common/constants';

export default function Splash({navigation}) {
  useEffect(() => {
    SplashScreen?.hide()
  }, []);

  return (
    <FSafeAreaView style={localStyle.container}>
      {/* <Image source={images.SplashImage} style={localStyle.splashImage} /> */}
      <View style={localStyle.textAndIconContainer}>
        {/* <SplashGroupIcon /> */}
        <FText type={'B40'} color={colors.white} style={localStyle.textStyle}>
          {strings.friendzy}
        </FText>
      </View>
    </FSafeAreaView>
  );
}

const localStyle = StyleSheet.create({
  container: {
    backgroundColor: colors.secondary1,
    ...styles.justifyCenter,
  },
  splashImage: {
    height: getHeight(600),
    width: getHeight(600),
    ...styles.ml50,
    ...styles.center,
    position: 'absolute',
  },
  textAndIconContainer: {
    ...styles.rowCenter,
  },
  textStyle: {
    ...styles.ml10,
  },
});
