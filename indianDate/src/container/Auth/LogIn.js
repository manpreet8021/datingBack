import {StyleSheet, TouchableOpacity, View} from 'react-native';
import React, {useEffect, useState} from 'react';
import {CountryPicker} from "react-native-country-codes-picker";
import Ionicon from 'react-native-vector-icons/Ionicons';

import {
  statusCodes,
  isErrorWithCode,
  isSuccessResponse,
  isNoSavedCredentialFoundResponse,
  GoogleSignin
} from '@react-native-google-signin/google-signin';

// custom import
import FSafeAreaView from '../../components/common/FSafeAreaView';
import FHeader from '../../components/common/FHeader';
import KeyBoardAvoidWrapper from '../../components/common/KeyBoardAvoidWrapper';
import {colors, styles} from '../../themes';
import FText from '../../components/common/FText';
import FInput from '../../components/common/FInput';
import FButton from '../../components/common/FButton';
import {USER_DATA, getHeight, moderateScale} from '../../common/constants';
import {AppleIcon, GoogleIcon} from '../../assets/svg';
import strings from '../../i18n/strings';
import {AuthNav} from '../../navigation/navigationKey';
import {getAsyncStorageData} from '../../utils/AsyncStorage';
import libPhoneNumber from 'google-libphonenumber'


GoogleSignin.configure({
  webClientId: '876614577382-n30pfiha3ksk18sc89g5spac1dh8p8m5.apps.googleusercontent.com',
});

export default function LogIn({navigation}) {
  const [number, setNumber] = useState('');
  const [numberInputStyle, setNumberInputStyle] = useState(BlurredStyle);
  const [callingCodeLib, setCallingCodeLib] = useState('+91');
  const [visiblePiker, setVisiblePiker] = useState(false);
  const [countryCodeLib, setCountryCodeLib] = useState('IN');
  const [countryFlag, setCountryFlag] = useState(null)
  const [data, setData] = useState('');

  const openCountryPicker = () => setVisiblePiker(true);
  const closeCountryPicker = () => setVisiblePiker(false);

  const onFocusInput = onHighlight => onHighlight(FocusedStyle);
  const onBlurInput = onUnHighlight => onUnHighlight(BlurredStyle);

  const onSelectCountry = country => {
    setCountryCodeLib(country.code);
    setCallingCodeLib(country.dial_code);
    setCountryFlag(country.flag);
    closeCountryPicker();
  };

  const isValidPhoneNumber = () => {
    try {
      const phoneUtil = libPhoneNumber.PhoneNumberUtil.getInstance();
      const parsedNumber = phoneUtil.parseAndKeepRawInput(number, countryCodeLib);
      return phoneUtil.isValidNumber(parsedNumber);
    } catch (error) {
      return false;
    }
  };

  const loginWithGoogle = async () => {
    try {
      await GoogleSignin.hasPlayServices();
      const response = await GoogleSignin.signIn();
      if (isSuccessResponse(response)) {
      } else if (isNoSavedCredentialFoundResponse(response)) {
      }
    } catch (error) {
      if (isErrorWithCode(error)) {
        switch (error.code) {
          case statusCodes.ONE_TAP_START_FAILED:
            // Android-only, you probably have hit rate limiting.
            // You can still call `presentExplicitSignIn` in this case.
            break;
          case statusCodes.PLAY_SERVICES_NOT_AVAILABLE:
            // Android: play services not available or outdated.
            // Get more details from `error.userInfo`.
            // Web: when calling an unimplemented api (requestAuthorization)
            // or when the Google Client Library is not loaded yet.
            break;
          default:
          // something else happened
        }
      } else {
        // an error that's not related to google sign in occurred
      }
    }
  }

  const BlurredStyle = {
    borderColor: colors.white,
  };
  const FocusedStyle = {
    borderColor: colors.secondary1,
  };

  const onFocusNumber = () => {
    onFocusInput(setNumberInputStyle);
  };
  const onBlurNumber = () => {
    onBlurInput(setNumberInputStyle);
  };

  const onChangedPhoneNo = text => setNumber(text);
  const userDetails = async () => {
    const data = await getAsyncStorageData(USER_DATA);
    setData(data);
  };

  useEffect(() => {
    userDetails();
  }, []);

  const LeftIcon = () => {
    return (
      <TouchableOpacity
        onPress={openCountryPicker}
        style={localStyle.countryPickerStyle}>
        <FText>{callingCodeLib}</FText>
        <Ionicon
          name={'chevron-down'}
          size={moderateScale(16)}
          color={colors.grayScale400}
        />
        <View style={localStyle.lineView} />
      </TouchableOpacity>
    );
  };

  const onPressLogIn = async () => {
    isValidPhoneNumber() && navigation.navigate(AuthNav.VerifyLoginOtp, {number: number});
  };

  const onPressSignUp = () => {
    navigation.navigate(AuthNav.SignUp);
  };

  const SocialBtn = ({title, frontIcon, onPress = () => {}}) => {
    return (
      <TouchableOpacity style={localStyle.btnContainer} onPress={onPress}>
        {frontIcon}
        <FText style={localStyle.titleText} type={'B16'} color={colors.primary}>
          {title}
        </FText>
      </TouchableOpacity>
    );
  };
  return (
    <FSafeAreaView>
      <FHeader />
      <KeyBoardAvoidWrapper contentContainerStyle={styles.flexGrow1}>
        <View style={localStyle.mainContainer}>
          <View>
            <FText type={'B24'} color={colors.primary} align={'center'}>
              {strings.login}
            </FText>
            <FText type={'R16'} color={colors.primary} align={'center'}>
              {strings.enterYourPhoneNumberToLogin}
            </FText>
            <FInput
              placeholder={strings.mobileNumber}
              _value={number}
              keyBoardType={'number-pad'}
              autoCapitalize={'none'}
              maxLength={10}
              toGetTextFieldValue={onChangedPhoneNo}
              inputContainerStyle={numberInputStyle}
              _onFocus={onFocusNumber}
              onBlur={onBlurNumber}
              insideLeftIcon={() => <LeftIcon />}
            />
            <CountryPicker
              show={visiblePiker}
              pickerButtonOnPress={country => {onSelectCountry(country);closeCountryPicker()}}
              style={localStyle.countryPickerStyle}
            />
          </View>
          <View>
            <FButton
              type={'B16'}
              title={strings.login}
              onPress={onPressLogIn}
            />
            <SocialBtn
              title={strings.loginWithGoogle}
              frontIcon={<GoogleIcon />}
              onPress={loginWithGoogle}
            />
            {/* <SocialBtn
              title={strings.loginWithApple}
              frontIcon={<AppleIcon />}
            /> */}
            <View style={localStyle.bottomTextContainer}>
              <FText type={'M14'} color={colors.backBorder}>
                {strings.donHaveAnAccount}
              </FText>
              <TouchableOpacity onPress={onPressSignUp}>
                <FText type={'M14'} color={colors.secondary1}>
                  {strings.signUp}
                </FText>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </KeyBoardAvoidWrapper>
    </FSafeAreaView>
  );
}

const localStyle = StyleSheet.create({
  mainContainer: {
    ...styles.ph20,
    ...styles.justifyBetween,
    ...styles.flex,
  },
  lineView: {
    width: moderateScale(1),
    height: moderateScale(20),
    borderWidth: moderateScale(1),
    borderColor: colors.lightGray,
    ...styles.ml5,
  },
  countryPickerStyle: {
    ...styles.rowSpaceBetween,
    height: getHeight(52),
    width: moderateScale(89),
    ...styles.mr25,
  },
  countryPickerButton: {
    ...styles.ml5,
  },
  btnContainer: {
    ...styles.mt15,
    ...styles.p15,
    width: '100%',
    borderRadius: moderateScale(32),
    ...styles.rowCenter,
    backgroundColor: colors.white,
  },
  titleText: {
    ...styles.ml15,
  },
  bottomTextContainer: {
    ...styles.rowCenter,
    ...styles.selfCenter,
    ...styles.mv20,
  },
});
