import { StyleSheet, TouchableOpacity, View } from "react-native";
import FText from "../../../components/common/FText";
import FSafeAreaView from "../../../components/common/FSafeAreaView";
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
import { useSelector } from "react-redux";
import MapView from "../../../components/Home/MapView";
import * as Yup from 'yup';
import Typography from "../../../themes/typography";
import { Dropdown } from 'react-native-element-dropdown';
import { useGetLookupValueQuery } from "../../../store/slice/api/lookupApiSlice";
import { useAddEventMutation } from "../../../store/slice/api/eventApiSlice";

export default function AddEventScreen() {
  const user = useSelector(state => state.auth)
  const { isLoading, data: categories } = useGetLookupValueQuery('event')
  const [addEvent, {isLoading: addEventLoader}] = useAddEventMutation()
  const location = user?.location

  const [mapViewVisible, setMapViewVisible] = useState(false);

  const handleSubmit = async (e) => {
    const response = await addEvent(e)
    console.log(response)
  }

  const eventSchema = Yup.object().shape({
    title: Yup.string()
      .max(25, 'Too Long!'),
    description: Yup.string()
      .max(50, 'Too Long!'),
    dateTime: Yup.string().required('Date and time for the event is required'),
    category: Yup.string().required('Please select a category'),
    latitude: Yup.number().required('Location is required'),
    longitude: Yup.number().required('Location is required')
  });

  const initialState = {
    title: '',
    description: '',
    dateTime: '',
    category: '',
    latitude: null,
    longitude: null
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

            <Formik initialValues={initialState}
              onSubmit={handleSubmit}
              validationSchema={eventSchema}>
              {({ handleChange, handleBlur, handleSubmit, values, errors, touched, setFieldValue }) => {
                const [isDatePickerVisible, setDatePickerVisibility] = useState(false);

                const hideDatePicker = () => {
                  setDatePickerVisibility(false);
                };

                const handleConfirm = date => {
                  var dateOfBirth = new Date(date.toISOString()).toLocaleString()
                  setFieldValue('dateTime', dateOfBirth);
                  hideDatePicker();
                };

                return (
                  <View style={localStyle.map}>
                    {
                      mapViewVisible ? (
                        <MapView location={location} setFieldValue={setFieldValue} setMapViewVisible={setMapViewVisible} latitude={values.latitude} longitude={values.longitude} />
                      ) : (
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
                              style={styles.ml5}
                              _errorText={touched.dateTime && errors.dateTime && errors.dateTime}>
                              {values.dateTime ? values.dateTime : 'Event Date'}
                            </FText>

                            <DateTimePicker
                              isVisible={isDatePickerVisible}
                              mode="date"
                              onCancel={hideDatePicker}
                              onConfirm={handleConfirm}
                              minimumDate={new Date()}
                            />
                          </TouchableOpacity>

                          <FText
                            style={{
                              ...localStyle.errorText,
                              color: colors.alertColor,
                            }}>
                            {touched.dateTime && errors.dateTime && errors.dateTime}
                          </FText>

                          <Dropdown
                            style={[
                              localStyle.datePikerStyle,
                              {
                                borderColor: colors.white,
                              },
                            ]}
                            data={categories ? categories : []}
                            labelField="name"
                            valueField="id"
                            onChange={(e) => { setFieldValue('category', e.id) }}
                            value={values.category}
                          />

                          <FText
                            style={{
                              ...localStyle.errorText,
                              color: colors.alertColor,
                            }}>
                            {touched.category && errors.category && errors.category}
                          </FText>

                          <TouchableOpacity
                            style={[
                              localStyle.datePikerStyle,
                              {
                                borderColor: colors.white,
                              },
                            ]}
                            onPress={() => { setMapViewVisible(true) }}>
                            <FText
                              type={'M16'}
                              color={values.latitude ? colors.black : colors.grayScale400}
                              style={styles.ml5}>
                              {values.latitude ? 'Location Added' : 'Event Location'}
                            </FText>

                          </TouchableOpacity>
                          <FText
                            style={{
                              ...localStyle.errorText,
                              color: colors.alertColor,
                            }}>
                            {touched.latitude && errors.latitude && errors.latitude}
                          </FText>
                          <FButton title="Add Event" onPress={handleSubmit} />
                        </View>
                      )
                    }
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
  errorText: {
    ...Typography.fontSizes.f12,
    ...styles.mt5,
    ...styles.ml5,
  },
  map: {
    width: '100%',
    height: '100%',
  },
})