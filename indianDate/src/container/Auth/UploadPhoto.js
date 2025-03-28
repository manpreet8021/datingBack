import {
  Image,
  ImageBackground,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useCallback, useState} from 'react';
import Ionicons from 'react-native-vector-icons/Entypo';
import ImageCropPicker from 'react-native-image-crop-picker';

// custom import
import FSafeAreaView from '../../components/common/FSafeAreaView';
import FHeader from '../../components/common/FHeader';
import {colors, styles} from '../../themes';
import FText from '../../components/common/FText';
import strings from '../../i18n/strings';
import images from '../../assets/images';
import {useUpdateUserDetailMutation} from '../../store/slice/api/authApiSlice';
import {
  ACCOUNT_CREATED,
  USER_DATA,
  getHeight,
  getWidth,
  moderateScale,
} from '../../common/constants';
import {CameraIcon, SmileyEmojiIcon} from '../../assets/svg';
import StepIndicator from '../../components/Home/StepIndicator';
import FButton from '../../components/common/FButton';
import VerifiedModal from '../../components/modal/VerifiedModal';
import {StackNav, TabNav} from '../../navigation/navigationKey';
import {useDispatch, useSelector} from 'react-redux';
import { setAsyncStorageData } from '../../utils/AsyncStorage';
import { setShowScreen } from '../../store/slice/authSlice';

export default function UploadPhoto({navigation}) {
  const auth = useSelector(state => state.auth);
  const dispatch = useDispatch()

  const [addImage, setAddImage] = useState([
    {id: 0, image: {}, type: 'addImage'},
    {id: 1, image: {}, type: 'addImage'},
  ]);
  const [addImages, setAddImages] = useState([
    {id: 0, image: {}, type: 'addImages'},
    {id: 1, image: {}, type: 'addImages'},
    {id: 2, image: {}, type: 'addImages'},
  ]);

  const [updateUserDetail, {isLoading}] = useUpdateUserDetailMutation();
  const [selectImage, setSelectImage] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  const onPressGallery = useCallback(
    (type, idx) => {
      ImageCropPicker.openPicker({
        mediaType: 'photo',
        includeBase64: true,
      }).then(image => {
        const updatedItem = {
          image: {
            uri: image.path,
            name: image.path.substring(image.path.lastIndexOf('/') + 1),
            type: image.mime,
          },
          type: type,
        };
        if (type === 'addImages') {
          setAddImages(prevImages => {
            const updatedImages = [...prevImages];
            const oldItem = prevImages[idx] || {};
            updatedImages[idx] = {...oldItem, ...updatedItem};
            return updatedImages;
          });
        } else {
          setAddImage(prevImages => {
            const updatedImages = [...prevImages];
            const oldItem = prevImages[idx] || {};
            updatedImages[idx] = {...oldItem, ...updatedItem};
            return updatedImages;
          });
        }
      });
    },
    [addImage, addImages],
  );

  const onPressChangePhoto = (itm, idx) => {
    ImageCropPicker.openPicker({
      mediaType: 'photo',
      includeBase64: true,
    }).then(images => {
      setSelectImage({
        uri: images.path,
        name: images.path.substring(images.path.lastIndexOf('/') + 1),
        type: images.mime,
      });
    });
  };

  const onPressNext = async () => {
    try {
      const formData = new FormData();
      addImages.forEach((item, index) => {
        if (item.image && item.image.uri) {
          formData.append('image', {
            uri: item.image.uri,
            name: item.image.name,
            type: item.image.type,
          });
        }
      });
      addImage.forEach((item, index) => {
        if (item.image && item.image.uri) {
          formData.append('image', {
            uri: item.image.uri,
            name: item.image.name,
            type: item.image.type,
          });
        }
      });
      auth.userInfo.interest.forEach(item => {
        formData.append('interest', item);
      });
      formData.append('name', auth.userInfo.name);
      formData.append('dob', auth.userInfo.dob);
      formData.append('gender', auth.userInfo.gender);

      if (selectImage) {
        formData.append('profile', {
          uri: selectImage.uri,
          name: selectImage.name,
          type: selectImage.type,
        });
      }
      const response = await updateUserDetail(formData);
      await setAsyncStorageData(ACCOUNT_CREATED, true);
      await setAsyncStorageData(USER_DATA, response);
      setModalVisible(true);
    } catch (error) {
      console.log(error);
    }
  };

  const onPressGetStarted = async () => {
    setModalVisible(false);
    dispatch(setShowScreen('AppScreen'))
  };

  const AddPhotos = React.memo(({image, index, type, onPressGallery}) => {
    return (
      <View>
        <View style={localStyle.addPhotoContainer}>
          <ImageBackground
            source={image.uri ? {uri: image.uri} : null}
            style={[localStyle.image]}>
            <TouchableOpacity
              style={localStyle.addTextContainer}
              onPress={() => {
                onPressGallery(type, index);
              }}>
              <Ionicons
                name={'plus'}
                size={moderateScale(16)}
                color={colors.white}
              />
              <FText type={'S14'} color={colors.white}>
                {strings.add}
              </FText>
            </TouchableOpacity>
          </ImageBackground>
        </View>
      </View>
    );
  });

  return (
    <FSafeAreaView style={localStyle.mainBgContainer}>
      <FHeader />
      <View style={localStyle.mainContainer}>
        <View style={styles.flex}>
          <FText type={'B24'} color={colors.primary} align={'center'}>
            {strings.uploadYourPhotos}
          </FText>
          <View style={localStyle.userImageAndAddImage}>
            <ImageBackground
              source={selectImage ? {uri: selectImage.uri} : null}
              style={[localStyle.userImage]}>
              <TouchableOpacity
                style={localStyle.changePhotoContainer}
                onPress={() => onPressChangePhoto()}>
                <CameraIcon />
                <FText
                  type={'S14'}
                  color={colors.white}
                  style={localStyle.changePhotoText}>
                  {selectImage ? strings.changePhoto : strings.addPhoto}
                </FText>
              </TouchableOpacity>
            </ImageBackground>
            <View>
              {addImage.map((item, index) => {
                return (
                  <AddPhotos
                    image={item.image}
                    type={item.type}
                    key={item.id}
                    index={index}
                    onPressGallery={onPressGallery}
                  />
                );
              })}
            </View>
          </View>
          <View style={localStyle.bottomAddContainer}>
            {addImages.map((item, index) => {
              return (
                <AddPhotos
                  image={item.image}
                  type={item.type}
                  key={item.id}
                  index={index}
                  onPressGallery={onPressGallery}
                />
              );
            })}
          </View>
          <FButton title={strings.next} onPress={onPressNext} />
        </View>
        <StepIndicator step={5} />
        <VerifiedModal
          visible={modalVisible}
          onPressStarted={onPressGetStarted}
        />
      </View>
    </FSafeAreaView>
  );
}

const localStyle = StyleSheet.create({
  mainBgContainer: {
    ...styles.flexGrow1,
  },
  mainContainer: {
    ...styles.ph20,
    ...styles.justifyBetween,
    ...styles.flex,
  },
  userImage: {
    width: getWidth(215),
    height: getHeight(215),
    ...styles.mr5,
    backgroundColor: colors.white,
  },
  addPhotoContainer: {
    width: getWidth(100),
    height: getHeight(102),
    borderRadius: moderateScale(16),
    ...styles.center,
    backgroundColor: colors.white,
    ...styles.mh5,
    ...styles.mv5,
  },
  addTextContainer: {
    height: moderateScale(24),
    ...styles.flexRow,
    ...styles.center,
    borderRadius: moderateScale(32),
    backgroundColor: colors.secondary1,
    width: moderateScale(62),
    ...styles.rowCenter,
    ...styles.selfCenter,
    ...styles.mt5,
    position: 'absolute',
    bottom: moderateScale(10),
  },
  userImageAndAddImage: {
    ...styles.flexRow,
    ...styles.mt20,
  },
  bottomAddContainer: {
    ...styles.flexRow,
    ...styles.wrap,
    ...styles.mt10,
  },
  changePhotoContainer: {
    width: moderateScale(140),
    height: moderateScale(36),
    borderRadius: moderateScale(32),
    ...styles.rowCenter,
    position: 'absolute',
    bottom: moderateScale(10),
    ...styles.selfCenter,
    backgroundColor: colors.secondary1,
  },
  changePhotoText: {
    ...styles.ml5,
  },
  image: {
    width: moderateScale(100),
    height: moderateScale(100),
    borderRadius: moderateScale(16),
    overflow: 'hidden',
  },
  borderRadius: {
    borderRadius: moderateScale(32),
  },
});
