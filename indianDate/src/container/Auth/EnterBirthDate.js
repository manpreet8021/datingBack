import {StyleSheet, TouchableOpacity, View} from 'react-native';
import React, {useState} from 'react';
import DateTimePicker from 'react-native-modal-datetime-picker';

// custom import
import FSafeAreaView from '../../components/common/FSafeAreaView';
import FHeader from '../../components/common/FHeader';
import {colors, styles} from '../../themes';
import KeyBoardAvoidWrapper from '../../components/common/KeyBoardAvoidWrapper';
import {AuthNav} from '../../navigation/navigationKey';
import FText from '../../components/common/FText';
import strings from '../../i18n/strings';
import StepIndicator from '../../components/Home/StepIndicator';
import {getHeight, moderateScale} from '../../common/constants';
import {useDispatch, useSelector} from 'react-redux';
import {setUser} from '../../store/slice/authSlice';

export default function EnterBirthDate({navigation}) {
  const user = useSelector(state => state.auth);
  const dispatch = useDispatch();

  const [selectedDate, setSelectedDate] = useState(user.userInfo?.dob);
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);

  const onPressNext = async () => {
    if (selectedDate === '') {
      alert(strings.pleaseEnterYourBirthDate);
    } else {
      dispatch(setUser({dob: selectedDate}));
      navigation.navigate(AuthNav.SelectGender);
    }
  };

  const handleConfirm = date => {
    var dateOfBirth = date.toISOString().split('T')[0];
    setSelectedDate(dateOfBirth);

    hideDatePicker();
  };
  const showDatePicker = () => {
    setDatePickerVisibility(true);
  };
  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };

  const formatDate = (value) => {
    const day = value.split('-')[2];
    const month = value.split('-')[1];
    const year = value.split('-')[0];
     return day + '/' + month + '/' + year;
  }

  return (
    <FSafeAreaView>
      <FHeader />
      <KeyBoardAvoidWrapper contentContainerStyle={styles.flexGrow1}>
        <View style={localStyle.mainContainer}>
          <View>
            <FText type={'B24'} color={colors.primary} align={'center'}>
              {strings.whenIsYourBirthday}
            </FText>
            <TouchableOpacity
              style={[
                localStyle.datePikerStyle,
                {
                  borderColor: selectedDate ? colors.secondary1 : colors.white,
                },
              ]}
              onPress={showDatePicker}>
              <FText
                type={'M16'}
                color={selectedDate ? colors.black : colors.grayScale400}
                style={styles.ml5}>
                {selectedDate ? formatDate(selectedDate) : strings.birthDate}
              </FText>
              <DateTimePicker
                isVisible={isDatePickerVisible}
                mode="date"
                onCancel={hideDatePicker}
                onConfirm={handleConfirm}
                date={new Date()}
                maximumDate={new Date()}
              />
            </TouchableOpacity>
          </View>
          <View>
            <StepIndicator step={2} rightIcon onPressNext={onPressNext} />
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
  datePikerStyle: {
    backgroundColor: colors.white,
    width: '100%',
    ...styles.selfCenter,
    borderRadius: moderateScale(16),
    height: getHeight(52),
    ...styles.mt20,
    ...styles.ph10,
    ...styles.pv15,
    borderWidth: moderateScale(1),
  },
});
