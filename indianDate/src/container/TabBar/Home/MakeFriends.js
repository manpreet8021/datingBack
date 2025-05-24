import {
  Animated,
  FlatList,
  Image,
  ImageBackground,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

// custom import
import {
  deviceWidth,
  getHeight,
  getWidth,
  moderateScale,
} from '../../../common/constants';
import { colors, styles } from '../../../themes';
import FText from '../../../components/common/FText';
import { Comment_Icon, Like_Icon, Share_Icon } from '../../../assets/svg';
import { useSelector } from 'react-redux';
import { useSetEventMatchMutation } from '../../../store/slice/api/matchApiSlice';
import { useFetchEventsQuery } from '../../../store/slice/api/eventApiSlice';
import { skipToken } from '@reduxjs/toolkit/query';
import { StackNav } from '../../../navigation/navigationKey';

export default function MakeFriends(props) {
  const event = useSelector(state => state.event)
  const auth = useSelector(state => state.auth)
  const [setEventMatch, {isLoading}] = useSetEventMatchMutation()
  const { data: events, error, isLoading: eventLoading } = useFetchEventsQuery(
    auth.location.latitude
      ? {
          latitude: auth.location.latitude,
          longitude: auth.location.longitude,
          getUserEvent: props.selectedTab,
        }
      : skipToken
  );

  const handleEdit = (id) => {
    props?.navigation.navigate(StackNav.AddEvent, { eventId: id });
  }

  const likePress = async(id) => {
    const response = await setEventMatch({eventId: id})
  }
  
  const commentPress = (id) => {
    
  }

  const renderData = ({ item, index }) => {
    return (
      <TouchableOpacity activeOpacity={0.9} onPress={() => props.selectedTab ? handleEdit(item.id) : null}>
        <ImageBackground
          style={[localStyle.bgImage]}
          imageStyle={{ borderRadius: moderateScale(32) }}
          source={{uri: item.image_url}}>
          <LinearGradient
            start={{ x: 0.6, y: 0 }}
            end={{ x: 1, y: 1.3 }}
            colors={[colors.linearColor1, colors.linearColor4]}
            style={localStyle.innerContainer}>
            <View style={localStyle.mainViewContainer}>
              <View style={localStyle.interestContainer}>
                <FText color={colors.white} type={'M14'}>
                  {item.interest}
                </FText>
              </View>
              <View>
                <FText
                  type={'S20'}
                  color={colors.white}
                  style={localStyle.postText}>
                  {item.postText}
                </FText>
                <View style={localStyle.userImageAndName}>
                  <Image
                    src={item.profileImage}
                    style={localStyle.userProfileImage}
                  />
                  <View style={localStyle.userNameContainer}>
                    <FText type={'S14'} color={colors.white}>
                      {item.username}
                    </FText>
                    <FText
                      type={'S14'}
                      color={colors.grayScale50}
                      style={[styles.mt5, { flexShrink: 1, flexWrap: 'wrap', maxWidth: 200 }]}>
                      {item.description}
                    </FText>
                  </View>
                </View>
              </View>
            </View>
            { !props.selectedTab && (
              <View style={localStyle.likeCommentContainer}>
                <View>
                  <TouchableOpacity style={localStyle.likeCommentBg} onPress={() => likePress(item.id)}>
                    <Like_Icon />
                  </TouchableOpacity>
                  <TouchableOpacity style={localStyle.likeCommentBg} onPress={() => commentPress(item.id)}>
                    <Comment_Icon />
                  </TouchableOpacity>
                </View>
              </View>)
            }
            
          </LinearGradient>
        </ImageBackground>
      </TouchableOpacity>
    );
  };

  return (
    <FlatList
      data={props.selectedTab ? event.userEvents : event.events}
      keyExtractor={item => item.id}
      renderItem={renderData}
      vertical={true}
      bounces={false}
      showsVerticalScrollIndicator={false}
      estimatedItemSize={200}
      contentContainerStyle={localStyle.mainContainer}
      scrollEnabled={false}
      {...props}
    />
  );
}

const localStyle = StyleSheet.create({
  bgImage: {
    height: getHeight(343),
    width: deviceWidth - moderateScale(40),
    ...styles.mv10,
    overflow: 'hidden'
  },
  innerContainer: {
    height: getHeight(343),
    width: deviceWidth - moderateScale(40),
    borderRadius: moderateScale(32),
    ...styles.rowSpaceBetween,
    ...styles.flex,
  },
  mainViewContainer: {
    ...styles.justifyBetween,
    height: '100%',
    ...styles.ml10,
  },
  mainContainer: {
    ...styles.pv10,
    paddingBottom: moderateScale(70),
  },
  interestContainer: {
    height: moderateScale(32),
    borderRadius: moderateScale(32),
    ...styles.center,
    borderWidth: moderateScale(1),
    borderColor: colors.grayScale100,
    width: getWidth(100),
    ...styles.mt20,
    backgroundColor: colors.transparent,
  },
  userImageAndName: {
    ...styles.flexRow,
    ...styles.mv20,
  },
  userProfileImage: {
    height: moderateScale(48),
    width: moderateScale(48),
    borderRadius: 40, // half of width/height to make it a circle
    resizeMode: 'cover'
  },
  userNameContainer: {
    ...styles.mt5,
    ...styles.ml10,
  },
  likeCommentContainer: {
    width: getWidth(70),
    height: getHeight(150),
    borderRadius: moderateScale(24),
    backgroundColor: colors.transparent,
    margin: moderateScale(5),
    ...styles.flexRow,
    ...styles.center,
  },
  likeCommentBg: {
    height: moderateScale(40),
    width: moderateScale(40),
    borderRadius: moderateScale(20),
    backgroundColor: colors.iconBg,
    ...styles.center,
    ...styles.mv10,
    ...styles.selfCenter,
  },
  lineView: {
    height: moderateScale(30),
    width: moderateScale(5),
    borderRadius: moderateScale(24),
    backgroundColor: colors.iconBg,
    ...styles.mh5,
  },
  postText: {
    width: getWidth(247),
  },
});
