import { StyleSheet, TouchableOpacity, View } from "react-native";
import FText from "../../../components/common/FText";
import { FilterIcon, LikeIcon } from "../../../assets/svg";
import { colors, styles } from "../../../themes";
import strings from "../../../i18n/strings";
import { moderateScale } from "../../../common/constants";

const HomeHeader = ({showFilter=true, onPressFilter}) => {
  return (
    <View>
      <View style={localStyle.headerContainer}>
        <View>
          <FText type={'B28'} color={colors.primary}>
            {strings.friendzy}
          </FText>
        </View>
        <View style={localStyle.headerContainer}>
          <TouchableOpacity style={localStyle.notificationBg}>
            <LikeIcon />
          </TouchableOpacity>
          {showFilter && (<TouchableOpacity style={localStyle.notificationBg} onPress={onPressFilter}>
            <FilterIcon />
          </TouchableOpacity>)}
        </View>
      </View>
      {/* <HeaderStory /> */}
    </View>
  );
};

export default HomeHeader

const localStyle = StyleSheet.create({
  headerContainer: {
    ...styles.rowSpaceBetween,
    ...styles.mv10,
  },
  notificationBg: {
    height: moderateScale(48),
    width: moderateScale(48),
    borderRadius: moderateScale(48 / 2),
    borderColor: colors.lightGray,
    borderWidth: moderateScale(1),
    ...styles.mr10,
    ...styles.center,
  },
})