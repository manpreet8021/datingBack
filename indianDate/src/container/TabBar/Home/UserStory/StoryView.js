import React, {useState, useRef} from 'react';
import {
  StyleSheet,
  View,
  Dimensions,
  TouchableWithoutFeedback,
  Image,
  Animated,
  StatusBar,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import LinearGradient from 'react-native-linear-gradient';
import Video from 'react-native-video';
import {useNavigation} from '@react-navigation/native';

import {getHeight, moderateScale} from '../../../../common/constants';
import {userStoryData} from '../../../../api/constant';
import {colors, styles} from '../../../../themes';
import {secondsToMilliseconds} from '../../../../utils/helpers';
import FText from '../../../../components/common/FText';

const {width, height} = Dimensions.get('window');

function StoryView({route}) {
  const img = route.params;
  const navigation = useNavigation();

  const [content, setContent] = useState(userStoryData);
  const [end, setEnd] = useState(0);
  const [current, setCurrent] = useState(0);
  const [load, setLoad] = useState(false);
  const progress = useRef(new Animated.Value(0)).current;

  // start() is for starting the animation bars at the top
  function start(n) {
    if (content[current].type == 'video') {
      // type video
      if (load) {
        Animated.timing(progress, {
          toValue: 1,
          duration: n,
          useNativeDriver: false,
        }).start(({finished}) => {
          if (finished) {
            onPressNext();
          }
        });
      }
    } else {
      // type image
      Animated.timing(progress, {
        toValue: 1,
        duration: 5000,
        useNativeDriver: false,
      }).start(({finished}) => {
        if (finished) {
          onPressNext();
        }
      });
    }
  }

  // handle playing the animation
  function play() {
    start(end);
  }

  // next() is for changing the content of the current content to +1
  function onPressNext() {
    // check if the next content is not empty
    if (current !== content.length - 1) {
      let data = [...content];
      data[current].finish = 1;
      setContent(data);
      setCurrent(current + 1);
      progress.setValue(0);
      setLoad(false);
    } else {
      // the next content is empty
      onCloseStory();
    }
  }

  // previous() is for changing the content of the current content to -1
  function onPressPrevious() {
    // checking if the previous content is not empty
    if (current - 1 >= 0) {
      let data = [...content];
      data[current].finish = 0;
      setContent(data);
      setCurrent(current - 1);
      progress.setValue(0);
      setLoad(false);
    } else {
      // the previous content is empty
      onCloseStory();
    }
  }

  // closing the modal set the animation progress to 0
  function onCloseStory() {
    progress.setValue(0);
    setLoad(false);
    navigation.goBack();
  }

  const onLoadEndImage = () => {
    progress.setValue(0);
    play();
  };

  const onLoadVideo = status => {
    setLoad(true);
    setEnd(secondsToMilliseconds(status.duration));
  };

  return (
    <SafeAreaView style={localStyles.containerModal}>
      <StatusBar backgroundColor="black" barStyle="light-content" />
      <View style={localStyles.backgroundContainer}>
        {content[current].type == 'video' ? (
          <Video
            source={{
              uri: content[current].content,
            }}
            rate={1.0}
            volume={1.0}
            resizeMode="cover"
            onReadyForDisplay={play()}
            onLoad={onLoadVideo}
            style={{height: height, width: width}}
          />
        ) : (
          <Image
            onLoadEnd={onLoadEndImage}
            source={{
              uri: content[current].content,
            }}
            style={{width: width, height: height, resizeMode: 'cover'}}
          />
        )}
      </View>
      <View style={localStyles.mainContainer}>
        <LinearGradient
          colors={['rgba(0,0,0,1)', 'transparent']}
          style={localStyles.gradientView}
        />
        {/* ANIMATION BARS */}
        <View style={localStyles.animationBar}>
          {content.map((index, key) => {
            return (
              <View key={key} style={localStyles.barItemContainer}>
                {/* THE ANIMATION OF THE BAR*/}
                <Animated.View
                  style={{
                    flex: current == key ? progress : content[key].finish,
                    height: 2,
                    backgroundColor: colors.white,
                  }}
                />
              </View>
            );
          })}
        </View>

        {/* END OF ANIMATION BARS */}

        <View style={localStyles.header}>
          {/* THE AVATAR AND USERNAME  */}
          <View style={localStyles.userAvatarContainer}>
            {!!img?.userImage && (
              <Image
                style={localStyles.userImage}
                source={{
                  uri: img.userImage,
                }}
              />
            )}
            <FText type={'S14'} style={styles.pl10}>
              {'You'}
            </FText>
          </View>
          {/* END OF THE AVATAR AND USERNAME */}
          {/* THE CLOSE BUTTON */}
          <TouchableOpacity onPress={onCloseStory}>
            <View style={localStyles.closeContainer}>
              <Ionicons name="close" size={28} color="white" />
            </View>
          </TouchableOpacity>
          {/* END OF CLOSE BUTTON */}
        </View>
        {/* HERE IS THE HANDLE FOR PREVIOUS AND NEXT PRESS */}
        <View style={localStyles.nextPreviousContainer}>
          <TouchableWithoutFeedback onPress={onPressPrevious}>
            <View style={styles.flex} />
          </TouchableWithoutFeedback>
          <TouchableWithoutFeedback onPress={onPressNext}>
            <View style={styles.flex} />
          </TouchableWithoutFeedback>
        </View>
        {/* END OF THE HANDLE FOR PREVIOUS AND NEXT PRESS */}
      </View>
    </SafeAreaView>
  );
}

export default StoryView;

const localStyles = StyleSheet.create({
  mainContainer: {
    flexDirection: 'column',
    flex: 1,
  },
  containerModal: {
    flex: 1,
    backgroundColor: '#000',
  },
  backgroundContainer: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
  },
  animationBar: {
    flexDirection: 'row',
    ...styles.pt10,
    ...styles.ph10,
  },
  barItemContainer: {
    height: 2,
    flex: 1,
    flexDirection: 'row',
    backgroundColor: 'rgba(117, 117, 117, 0.5)',
    marginHorizontal: 2,
  },
  nextPreviousContainer: {
    ...styles.flexRow,
    ...styles.flex,
  },
  closeContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    height: getHeight(50),
    ...styles.ph15,
  },
  userAvatarContainer: {flexDirection: 'row', alignItems: 'center'},
  userImage: {
    height: moderateScale(30),
    width: moderateScale(30),
    borderRadius: 25,
  },
  header: {
    height: getHeight(50),
    flexDirection: 'row',
    justifyContent: 'space-between',
    ...styles.ph15,
  },
  gradientView: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    height: getHeight(100),
  },
});
