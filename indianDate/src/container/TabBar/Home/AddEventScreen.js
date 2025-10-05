import {
  ImageBackground,
  StyleSheet,
  TouchableOpacity,
  View,
  ActivityIndicator,
} from 'react-native';
import FText from '../../../components/common/FText';
import FSafeAreaView from '../../../components/common/FSafeAreaView';
import FHeader from '../../../components/common/FHeader';
import KeyBoardAvoidWrapper from '../../../components/common/KeyBoardAvoidWrapper';
import FInput from '../../../components/common/FInput';
import {colors, styles} from '../../../themes';
import strings from '../../../i18n/strings';
import {Formik} from 'formik';
import FButton from '../../../components/common/FButton';
import DateTimePicker from 'react-native-modal-datetime-picker';
import {useCallback, useEffect, useState} from 'react';
import {getHeight, moderateScale} from '../../../common/constants';
import {useSelector} from 'react-redux';
import MapView from '../../../components/Home/MapView';
import * as Yup from 'yup';
import Typography from '../../../themes/typography';
import {Dropdown} from 'react-native-element-dropdown';
import {useGetLookupValueQuery} from '../../../store/slice/api/lookupApiSlice';
import {
  useAddEventMutation,
  useGetEventByIdQuery,
  useUpdateEventMutation
} from '../../../store/slice/api/eventApiSlice';
import {StackNav} from '../../../navigation/navigationKey';
import ImageCropPicker from 'react-native-image-crop-picker';
import AddPhotos from '../../../components/common/AddPhotos';
import {skipToken} from '@reduxjs/toolkit/query';

export default function AddEventScreen({navigation, route}) {
  const user = useSelector(state => state.auth);
  const {isLoading, data: categories} = useGetLookupValueQuery('event');
  const [addEvent, {isLoading: addEventLoader}] = useAddEventMutation();
  const [updateEvent, {isLoading: upddateEventLoader}] = useUpdateEventMutation();
  const {
    data: event,
    error,
    isLoading: eventLoading,
  } = useGetEventByIdQuery(
    route.params
      ? {
          eventId: route.params.eventId,
        }
      : skipToken,
      { refetchOnMountOrArgChange: true }
  );
  const location = user?.location;

  const [mapViewVisible, setMapViewVisible] = useState(false);

  const handleSubmit = async e => {
    try {
      const formData = new FormData();
      formData.append('category', e.category);
      formData.append('dateTime', e.dateTime);
      formData.append('description', e.description);
      formData.append('latitude', e.latitude || location.latitude);
      formData.append('longitude', e.longitude || location.longitude);
      formData.append('title', e.title);
      if (route.params && route.params.eventId) {
        formData.append('id', route.params.eventId)
      }
      if(e.thumbnail.image.name) {
        formData.append('thumbnail', {
          uri: e.thumbnail.image.uri,
          name: e.thumbnail.image.name,
          type: e.thumbnail.image.type,
        });
      }

      const response = route.params && route.params.eventId ? await updateEvent(formData) : await addEvent(formData);
      if (response.error) {
        throw new Error(response.error);
      } else {
        navigation.navigate(StackNav.TabNavigation);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const eventSchema = Yup.object().shape({
    title: Yup.string()
      .required()
      .max(50, 'You can only use 50 character in Title'),
    description: Yup.string()
      .required()
      .max(100, 'You can only use 100 character in Title'),
    dateTime: Yup.string().required('Date and time for the event is required'),
    category: Yup.string().required('Please select a category'),
    latitude: Yup.number().nullable(),
    longitude: Yup.number().nullable(),
    thumbnail: Yup.object().shape({
      id: Yup.number().moreThan(0, 'Please select an event image'),
      image: Yup.mixed(),
      type: Yup.string(),
    }),
  });

  const [initialState, setInitialState] = useState({
    title: '',
    description: '',
    dateTime: '',
    category: '',
    latitude: null,
    longitude: null,
    thumbnail: {id: 0, image: {}, type: 'eventImage'},
  });

  useEffect(() => {
    if (event) {
      console.log(event)
      setInitialState({
        title: event.title || '',
        description: event.description || '',
        dateTime: event.dateTime || '',
        category: event.category || '',
        latitude: event.latitude,
        longitude: event.longitude,
        thumbnail: {id: 1, image: {uri: event.image_url}, type: 'eventImage'},
      });
    }
  }, [event]);

  return (
    <FSafeAreaView>
      <FHeader />
      <KeyBoardAvoidWrapper contentContainerStyle={styles.flexGrow1}>
        <View style={localStyle.mainContainer}>
          <View>
            <FText type={'B24'} color={colors.primary} align={'center'}>
              {route.params ? strings.editEvent : strings.createEvent}
            </FText>
            {eventLoading ? (
              <ActivityIndicator />
            ) : (
              <Formik
                initialValues={initialState}
                onSubmit={handleSubmit}
                validationSchema={eventSchema}
                enableReinitialize={true}>
                {({
                  handleChange,
                  handleBlur,
                  handleSubmit,
                  values,
                  errors,
                  touched,
                  setFieldValue,
                  isSubmitting,
                }) => {
                  const [isDatePickerVisible, setDatePickerVisibility] =
                    useState(false);

                  const hideDatePicker = () => {
                    setDatePickerVisibility(false);
                  };

                  const handleConfirm = date => {
                    var dateOfBirth = new Date(
                      date.toISOString(),
                    ).toLocaleString('en-CA', {
                      year: 'numeric',
                      month: '2-digit',
                      day: '2-digit',
                    });
                    setFieldValue('dateTime', dateOfBirth);
                    hideDatePicker();
                  };

                  const onPressGallery = useCallback(() => {
                    ImageCropPicker.openPicker({
                      mediaType: 'photo',
                      includeBase64: true,
                    }).then(image => {
                      const updatedItem = {
                        id: 1,
                        image: {
                          uri: image.path,
                          name: image.path.substring(
                            image.path.lastIndexOf('/') + 1,
                          ),
                          type: image.mime,
                        },
                      };
                      setFieldValue('thumbnail', updatedItem);
                    });
                  }, [values.thumbnail]);

                  return (
                    <View style={localStyle.map}>
                      {mapViewVisible ? (
                        <MapView
                          location={location}
                          setFieldValue={setFieldValue}
                          setMapViewVisible={setMapViewVisible}
                          latitude={values.latitude}
                          longitude={values.longitude}
                        />
                      ) : (
                        <View>
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
                            onChange={e => {
                              setFieldValue('category', e.id);
                            }}
                            value={values.category}
                            placeholder="Select event category"
                          />

                          {touched.category && errors.category && (
                            <FText
                              style={{
                                ...localStyle.errorText,
                                color: colors.alertColor,
                              }}>
                              {errors.category}
                            </FText>
                          )}

                          <FInput
                            keyBoardType={'default'}
                            autoCapitalize={'none'}
                            toGetTextFieldValue={handleChange('title')}
                            onBlur={handleBlur('title')}
                            placeholder="Event title"
                            _value={values.title}
                            _errorText={
                              touched.title && errors.title ? errors.title : ''
                            }
                          />

                          <FInput
                            keyBoardType={'default'}
                            autoCapitalize={'none'}
                            toGetTextFieldValue={handleChange('description')}
                            onBlur={handleBlur('description')}
                            placeholder="Event description"
                            multiline={true}
                            _value={values.description}
                            _errorText={
                              touched.description && errors.description
                                ? errors.description
                                : ''
                            }
                          />

                          <TouchableOpacity
                            style={[
                              localStyle.datePikerStyle,
                              {
                                borderColor: colors.white,
                              },
                            ]}
                            onPress={() => {
                              setDatePickerVisibility(true);
                            }}>
                            <FText
                              type={'M16'}
                              color={
                                values.dateTime
                                  ? colors.black
                                  : colors.grayScale400
                              }
                              style={styles.ml5}
                              _errorText={
                                touched.dateTime &&
                                errors.dateTime &&
                                errors.dateTime
                              }>
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

                          {touched.dateTime && errors.dateTime && (
                            <FText
                              style={{
                                ...localStyle.errorText,
                                color: colors.alertColor,
                              }}>
                              {errors.dateTime}
                            </FText>
                          )}

                          <TouchableOpacity
                            style={[
                              localStyle.datePikerStyle,
                              {
                                borderColor: colors.white,
                              },
                            ]}
                            onPress={() => {
                              setMapViewVisible(true);
                            }}>
                            <FText
                              type={'M16'}
                              color={
                                values.latitude
                                  ? colors.black
                                  : colors.grayScale400
                              }
                              style={styles.ml5}>
                              {values.latitude
                                ? 'Location Added'
                                : 'Event Location (optional)'}
                            </FText>
                            {touched.latitude && errors.latitude && (
                              <FText
                                style={{
                                  ...localStyle.errorText,
                                  color: colors.alertColor,
                                }}>
                                {errors.latitude}
                              </FText>
                            )}
                          </TouchableOpacity>
                          <View style={localStyle.photoContainer}>
                            <AddPhotos
                              image={values.thumbnail.image}
                              type={values.thumbnail.type}
                              key={values.thumbnail.id}
                              onPressGallery={onPressGallery}
                            />
                            {errors.thumbnail?.id && (
                              <FText
                                style={{
                                  ...localStyle.errorText,
                                  color: colors.alertColor,
                                }}>
                                {errors.thumbnail?.id}
                              </FText>
                            )}
                          </View>
                          {isSubmitting ? (
                            <ActivityIndicator />
                          ) : (
                            <FButton
                              title={
                                route.params
                                  ? strings.updateEvent
                                  : strings.addEvent
                              }
                              onPress={handleSubmit}
                            />
                          )}
                        </View>
                      )}
                    </View>
                  );
                }}
              </Formik>
            )}
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
  errorText: {
    ...Typography.fontSizes.f12,
    ...styles.mt5,
    ...styles.ml5,
  },
  map: {
    width: '100%',
    height: '100%',
  },
  photoContainer: {
    ...styles.mt15,
  },
  loader: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 10,
  },
});
