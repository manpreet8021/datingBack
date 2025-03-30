import { StyleSheet, TextInput, TouchableOpacity, View } from "react-native";
import FText from "../../../components/common/FText";
import FSafeAreaView from "../../../components/common/FSafeAreaView";
import { ScrollView } from "react-native-actions-sheet";
import FHeader from "../../../components/common/FHeader";
import KeyBoardAvoidWrapper from "../../../components/common/KeyBoardAvoidWrapper";
import FInput from "../../../components/common/FInput";
import { colors, styles } from "../../../themes";
import strings from "../../../i18n/strings";
import { Formik } from "formik"
import FButton from "../../../components/common/FButton";
import DateTimePicker from "react-native-modal-datetime-picker";
import { useState } from "react";
import { getHeight, moderateScale } from "../../../common/constants";

export default function AddEventScreen() {
  const initialState = {
    title: '',
    description: '',
    dateTime: '',
    category: ''
  }
  return (
    <FSafeAreaView>
      <FHeader />
      <KeyBoardAvoidWrapper contentContainerStyle={styles.flexGrow1}>
        <View style={localStyle.mainContainer}>
          <View>
            <FText type={'B24'} color={colors.primary} align={'center'}>
              {strings.createEvent}
            </FText>
            <Formik initialValues={initialState}>
              {({ handleChange, handleBlur, handleSubmit, values, errors, touched, setFieldValue }) => {
                const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
                const hideDatePicker = () => {
                  setDatePickerVisibility(false);
                };
                const handleConfirm = date => {
                  console.log(date.toISOString())
                  var dateOfBirth = new Date(date.toISOString()).toLocaleString()
                  setFieldValue('dateTime', dateOfBirth);
              
                  hideDatePicker();
                };
                return (
                  <View>
                    <FInput
                      keyBoardType={'default'}
                      autoCapitalize={'none'}
                      toGetTextFieldValue={handleChange('title')}
                      onBlur={handleBlur('title')}
                      placeholder="Title"
                      _value={values.title}
                      _errorText={touched.title && errors.title && errors.title}
                    />

                    <FInput
                      keyBoardType={'default'}
                      autoCapitalize={'none'}
                      toGetTextFieldValue={handleChange('description')}
                      onBlur={handleBlur('description')}
                      placeholder="Description"
                      multiline={true}
                      _value={values.description}
                      _errorText={touched.description && errors.description && errors.description}
                    />

                    <TouchableOpacity
                      style={[
                        localStyle.datePikerStyle,
                        {
                          borderColor: colors.white,
                        },
                      ]}
                      onPress={() => { setDatePickerVisibility(true) }}>
                      <FText
                        type={'M16'}
                        color={values.dateTime ? colors.black : colors.grayScale400}
                        style={styles.ml5}>
                        {values.dateTime ? values.dateTime : strings.birthDate}
                      </FText>
                      <DateTimePicker
                        isVisible={isDatePickerVisible}
                        mode="datetime"
                        onCancel={hideDatePicker}
                        onConfirm={handleConfirm}
                        minimumDate={new Date()}
                      />
                    </TouchableOpacity>

                    <FButton title="Add Event" onPress={handleSubmit} />
                  </View>

                )
              }}
            </Formik>
          </View>
        </View>
      </KeyBoardAvoidWrapper>
    </FSafeAreaView>
  )
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
})