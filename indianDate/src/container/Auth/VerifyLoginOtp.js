import {StyleSheet, TouchableOpacity, View} from 'react-native';
import React, {useState, useEffect} from 'react';
import OTPInputView from '@twotalltotems/react-native-otp-input';

import CustomCountDown from '../../components/common/CustomCountDown';
import {colors, styles} from '../../themes';
import {moderateScale} from '../../common/constants';
import Typography from '../../themes/typography';
import {AuthNav, StackNav} from '../../navigation/navigationKey';
import FSafeAreaView from '../../components/common/FSafeAreaView';
import KeyBoardAvoidWrapper from '../../components/common/KeyBoardAvoidWrapper';
import FHeader from '../../components/common/FHeader';
import FText from '../../components/common/FText';
import FButton from '../../components/common/FButton';
import strings from '../../i18n/strings';
import {useValidateOtpMutation} from '../../store/slice/api/authApiSlice';
import {useSelector} from 'react-redux';
import EncryptedStorage from 'react-native-encrypted-storage';

export default function VerifyLoginOtp({navigation}) {
  const [otp, setOtp] = useState('');
  const [counterId, setCounterId] = useState('1');
  const [validateOtp, {isLoading}] = useValidateOtpMutation();
  const auth = useSelector(state => state.auth);
  const phone = auth.userInfo.phone;

  const verifyOTP = async () => {
    try {
      const user = await validateOtp({phone: phone, otp: otp});
      await EncryptedStorage.setItem('token', user?.data.token);
      navigation.reset({
        index: 0,
        routes: [{ name: AuthNav.AccountName }],
      });
      
    } catch (error) {
      throw new Error(error);
    }
  };

  const onOtpChange = text => {
    console.log(text)
    setOtp(text);
  };

  const onPressResend = () => {
    setCounterId(prev => (parseInt(prev) + 1).toString());
    setOtp('');
  };

  const onFinishTimer = () => {};

  const onPressVerify = async () => {
    try {
      await verifyOTP();
    } catch (error) {
      console.log(error);
    }
  };

  const onPressBack = () => {
    navigation.goBack();
  };

  return (
    <FSafeAreaView>
      <FHeader goBack={onPressBack} />
      <KeyBoardAvoidWrapper contentContainerStyle={styles.flexGrow1}>
        <View style={localStyle.mainContainer}>
          <View>
            <FText type={'B24'} color={colors.primary} align={'center'}>
              {strings.verifyLogin}
            </FText>
            <FText
              type={'R14'}
              color={colors.lightBlack}
              align={'center'}
              style={localStyle.secondHeading}>
              {strings.enterOTPCodeWeSentTo + ' ' + phone}
            </FText>
            <View style={localStyle.countdownText}>
              <FText type={'R14'} color={colors.lightBlack} align={'center'}>
                {strings.thisCodeWillExpiredIn}
              </FText>
              <CustomCountDown
                onFinish={onFinishTimer}
                keyId={counterId}
                digitStyle={{backgroundColor: colors.pinkBg}}
                digitTxtStyle={localStyle.digitStyle}
              />
            </View>
            <OTPInputView
              pinCount={4}
              code={otp}
              onCodeChanged={onOtpChange}
              codeInputFieldStyle={[
                localStyle.underlineStyleBase,
                {
                  backgroundColor: colors.white,
                  color: colors.black,
                  borderColor: colors.white,
                },
              ]}
              codeInputHighlightStyle={{
                borderColor: colors.secondary1,
              }}
              style={localStyle.otpInputViewStyle}
              secureTextEntry={false}
            />
            <View style={localStyle.receiveCodeContainer}>
              <FText color={colors.lightBlack} type={'R14'}>
                {strings.didReceivedTheCode}
              </FText>
              <TouchableOpacity
                style={localStyle.resendText}
                onPress={onPressResend}>
                <FText color={colors.secondary1} type={'S14'}>
                  {strings.resendCode}
                </FText>
              </TouchableOpacity>
            </View>
          </View>
          <FButton title={strings.verifyCode} onPress={onPressVerify} />
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
  otpInputViewStyle: {
    ...styles.selfCenter,
    height: '20%',
    ...styles.mt30,
  },
  underlineStyleBase: {
    width: moderateScale(64),
    height: moderateScale(64),
    borderWidth: moderateScale(1),
    borderRadius: moderateScale(16),
    ...Typography.fontWeights.Bold,
    ...Typography.fontSizes.f26,
  },
  receiveCodeContainer: {
    ...styles.rowCenter,
    ...styles.mt30,
  },
  resendText: {
    ...styles.ml5,
  },
  digitStyle: {
    fontSize: moderateScale(18),
    ...Typography.fontWeights.Regular,
    color: colors.secondary1,
  },
  countdownText: {
    ...styles.rowCenter,
  },
  secondHeading: {
    ...styles.rowCenter,
    ...styles.mt20,
  },
});
