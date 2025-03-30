import {
  StyleSheet,
  View,
  TouchableOpacity,
  Image,
  ScrollView,
} from 'react-native';
import React, { useEffect, useRef, useState } from 'react';

// custom import
import FSafeAreaView from '../../../components/common/FSafeAreaView';
import { colors, styles } from '../../../themes';
import FText from '../../../components/common/FText';
import strings from '../../../i18n/strings';
import { USER_DATA, moderateScale } from '../../../common/constants';
import Geolocation from "react-native-geolocation-service";
import {
  FilterIcon,
  LikeIcon,
} from '../../../assets/svg';
import UserStories from './UserStory/UserStories';
import images from '../../../assets/images';
import FastImage from 'react-native-fast-image';
import { MakeFriendsData, UserDetails } from '../../../api/constant';
import MakeFriends from './MakeFriends';
import SearchPartnerCard from './SearchPartnerCard';
import { StackNav } from '../../../navigation/navigationKey';
import { getAsyncStorageData } from '../../../utils/AsyncStorage';
import { useIsFocused } from '@react-navigation/native';
import ExploreFilter from '../../../components/modal/ExploreFilter';
import FloatingAddButton from '../../../components/common/FloatingAddButton';
import HomeHeader from './HomeHeader';
import { PermissionsAndroid, Platform } from "react-native";
import { check, request, PERMISSIONS, RESULTS } from "react-native-permissions";
import { useDispatch, useSelector } from 'react-redux';
import { setLocation } from '../../../store/slice/authSlice';
import { useInsertUserLocationMutation } from '../../../store/slice/api/authApiSlice';

export default function HomeScreen({ navigation }) {
  const [isSelect, setIsSelect] = useState(0);
  const isFocused = useIsFocused();
  const [userImage, setUserImage] = useState('');
  const SheetRef = useRef(null);
  const user = useSelector(state => state.auth)
  const [insertUserLocation, {isLoading}] = useInsertUserLocationMutation()
  const dispatch = useDispatch()

  const userDetails = async () => {
    const data = await getAsyncStorageData(USER_DATA);
    setUserImage(data?.userImage);
  };

  const requestLocationPermission = async () => {
    if (Platform.OS === "android") {
      const granted = await PermissionsAndroid.check(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
      );
      if (granted) return true;

      // Request only if not granted
      const newGrant = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
      );
      return newGrant === PermissionsAndroid.RESULTS.GRANTED;
    } else if (Platform.OS === "ios") {
      const permission = PERMISSIONS.IOS.LOCATION_ALWAYS; // or LOCATION_ALWAYS
      const status = await check(permission); // ✅ Check existing status

      if (status === RESULTS.GRANTED) return true; // Already granted
      if (status === RESULTS.DENIED) return request(permission) === RESULTS.GRANTED;

      if (status === RESULTS.BLOCKED) {
        return false; // Don't request again
      }

      return request(permission) === RESULTS.GRANTED;
    }
    return false;
  };

  useEffect(() => {
    const getUserLocation = async () => {
      console.log("here")
      const hasPermission = await requestLocationPermission();
      console.log(hasPermission)
      if (!hasPermission) return;
      console.log("here")
      if (!user.location.latitude) {
        Geolocation.getCurrentPosition(
          async (position) => {
            console.log(position)
            const body = {latitude: position.coords?.latitude, longitude: position.coords.longitude}
            dispatch(setLocation(body))
            const response = await insertUserLocation(body)
            console.log(response)
          },
          (error) => console.log("Location Error:", error),
          { enableHighAccuracy: true, timeout: 5000, maximumAge: 10000 }
        );
      }
    };
    getUserLocation()
  }, [])

  useEffect(() => {
    isFocused && userDetails();
  }, [isFocused]);

  const categoryData = [
    {
      id: 0,
      title: strings.exploreEvent,
      onPress: () => setIsSelect(0),
    },
    {
      id: 1,
      title: strings.yourEvent,
      onPress: () => setIsSelect(1),
    },
  ];

  // const UserProfile = React.memo(() => {
  //   return (
  //     <View style={localStyle.itemContainer}>
  //       <View style={localStyle.itemInnerContainer}>
  //         <FastImage
  //           source={userImage ? {uri: userImage} : images.UserImage1}
  //           style={[
  //             localStyle.itemImage,
  //             {
  //               borderWidth: moderateScale(1),
  //             },
  //           ]}
  //         />

  //         <StoryAddIcon
  //           name="plus"
  //           style={localStyle.addIcon}
  //           width={moderateScale(25)}
  //           height={moderateScale(25)}
  //         />
  //       </View>
  //       <FText
  //         type={'s14'}
  //         style={localStyle.itemUsername}
  //         color={colors.black}>
  //         {'Your Story'}
  //       </FText>
  //     </View>
  //   );
  // });
  // const HeaderStory = () => {
  //   return (
  //     <UserStories
  //       ListHeaderComponent={<UserProfile />}
  //       stories={UserDetails}
  //     />
  //   );
  // };

  // const onPressProfile = () => {
  //   navigation.navigate(StackNav.Profile);
  // };

  const HeaderCategory = () => {
    return categoryData.map((item, index) => {
      return (
        <TouchableOpacity
          key={index}
          onPress={item.onPress}
          style={[
            localStyle.root,
            {
              backgroundColor: isSelect === item.id ? colors.white : null,
            },
          ]}>
          <FText
            type={'M12'}
            align={'center'}
            style={styles.ml5}
            color={colors.primary}>
            {item.title}
          </FText>
        </TouchableOpacity>
      );
    });
  };

  const onPressFilter = () => {
    SheetRef?.current?.show();
  };

  const onPressAddButton = () => {
    navigation.navigate(StackNav.AddEvent)
  }

  // const SearchPartnerHeader = () => {
  //   return (
  //     <View style={localStyle.headerContainer}>
  //       <TouchableOpacity onPress={onPressProfile}>
  //         <Image
  //           style={localStyle.userImage}
  //           source={userImage ? {uri: userImage} : images.UserImage1}
  //         />
  //       </TouchableOpacity>
  //       <View style={localStyle.likeAndFilterContainer}>

  //       </View>
  //     </View>
  //   );
  // };

  return (
    <FSafeAreaView>
      <ScrollView
        bounces={false}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={localStyle.mainContainerView}>
        <HomeHeader onPressFilter={onPressFilter} />
        <View style={[localStyle.itemSelectContainer, styles.mt15]}>
          <HeaderCategory />
        </View>
        <View>
          {isSelect === 0 ? (
            <MakeFriends data={MakeFriendsData} />
          ) : (
            <SearchPartnerCard />
          )}
        </View>
      </ScrollView>
      <FloatingAddButton onPress={onPressAddButton} />
      <ExploreFilter SheetRef={SheetRef} />
    </FSafeAreaView>
  );
}

const localStyle = StyleSheet.create({
  mainContainerView: {
    ...styles.ph20,
    // ...styles.flex,
  },
  itemContainer: {
    alignItems: 'center',
    ...styles.mr20,
  },
  itemInnerContainer: {
    padding: moderateScale(2),
    borderRadius: moderateScale(43),
  },
  itemImage: {
    width: moderateScale(64),
    height: moderateScale(64),
    borderRadius: moderateScale(64 / 2),
    borderColor: colors.pinkBg,
  },
  itemUsername: {
    ...styles.mt5,
  },
  addIcon: {
    position: 'absolute',
    bottom: 2,
    right: 1,
    borderRadius: moderateScale(20),
  },
  root: {
    height: moderateScale(36),
    width: '50%',
    ...styles.p10,
    ...styles.center,
    borderRadius: moderateScale(16),
  },
  itemSelectContainer: {
    height: moderateScale(44),
    width: '100%',
    ...styles.rowCenter,
    borderRadius: moderateScale(16),
    ...styles.p5,
    ...styles.selfCenter,
    backgroundColor: colors.btnBg,
  },
  userImage: {
    height: moderateScale(48),
    width: moderateScale(48),
    borderRadius: moderateScale(48 / 2),
  },
  likeAndFilterContainer: {
    ...styles.rowCenter,
  }
});
