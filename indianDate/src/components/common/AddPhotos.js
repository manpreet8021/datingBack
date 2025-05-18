import { ImageBackground, StyleSheet, TouchableOpacity, View } from "react-native";
import Ionicons from 'react-native-vector-icons/Entypo';
import FText from "./FText";
import { getHeight, getWidth, moderateScale } from "../../common/constants";
import { colors, styles } from "../../themes";
import strings from "../../i18n/strings";
import React from "react";

const AddPhotos = React.memo(({ image, index=0, type, onPressGallery }) => {
    return (
        <View>
            <View style={localStyle.addPhotoContainer}>
                <ImageBackground
                    source={image.uri ? { uri: image.uri } : null}
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
const localStyle = StyleSheet.create({
    addPhotoContainer: {
    width: getWidth(100),
    height: getHeight(102),
    borderRadius: moderateScale(16),
    ...styles.center,
    backgroundColor: colors.white,
    ...styles.mh5,
    ...styles.mv5,
  },
  image: {
    width: moderateScale(100),
    height: moderateScale(100),
    borderRadius: moderateScale(16),
    overflow: 'hidden',
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
})

export default AddPhotos;