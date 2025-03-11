import {FlatList, StyleSheet, TouchableOpacity, View} from 'react-native';
import React, {useState} from 'react';

// custom import
import FSafeAreaView from '../../components/common/FSafeAreaView';
import FHeader from '../../components/common/FHeader';
import {colors, styles} from '../../themes';
import FText from '../../components/common/FText';
import strings from '../../i18n/strings';
import {moderateScale} from '../../common/constants';
import {SelectInterestData} from '../../api/constant';
import StepIndicator from '../../components/Home/StepIndicator';
import {AuthNav} from '../../navigation/navigationKey';
import { useDispatch, useSelector } from 'react-redux';
import { setUser } from '../../store/slice/authSlice';
import { useGetLookupValueQuery } from '../../store/slice/api/lookupApiSlice';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

export default function SelectInterest({navigation}) {
  const user = useSelector(state => state.auth)
  const dispatch = useDispatch()
  const [selectedChips, setSelectedChips] = useState(user.userInfo.interest);
  const {data: interest, isLoading} = useGetLookupValueQuery('interest')

  const renderChips = ({item, index}) => {
    return (
      <TouchableOpacity
        onPress={() => onPressChips(item.id)}
        key={item}
        style={[
          localStyle.chipsContainer,
          {borderColor: colors.selectBorder},
          selectedChips.includes(item.id) && {
            backgroundColor: colors.secondary1,
          },
        ]}>
        <FText
          type={'b18'}
          color={selectedChips.includes(item.id) ? colors.white : colors.primary}>
            <MaterialCommunityIcons name={item.icon} size={12}/> {item.name}
        </FText>
      </TouchableOpacity>
    );
  };
  const onPressChips = value => {
    if (selectedChips.includes(value)) {
      setSelectedChips(selectedChips.filter(item => item !== value));
    } else {
      setSelectedChips([...selectedChips, value]);
    }
  };
  const onPressNext = () => {
    if (selectedChips.length === 5 || selectedChips.length > 5) {
      dispatch(setUser({interest: selectedChips}))
      navigation.navigate(AuthNav.UploadPhoto);
    } else {
      alert(strings.pleaseSelectAtLeastYourInterest);
    }
  };
  return (
    <FSafeAreaView style={localStyle.mainBgContainer}>
      <FHeader />
      <View style={localStyle.mainContainer}>
        <View style={styles.flex}>
          <FText type={'B24'} color={colors.primary} align={'center'}>
            {strings.selectUptoInterests}
          </FText>
          <View style={localStyle.chipMainContainer}>
            <FlatList
              data={interest}
              renderItem={renderChips}
              showsVerticalScrollIndicator={true}
              keyExtractor={(item, index) => index.toString()}
              bounces={false}
              numColumns={2}
              columnWrapperStyle={localStyle.columnWrapperStyle}
            />
          </View>
        </View>
        <StepIndicator step={4} rightIcon onPressNext={onPressNext} />
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
  chipsContainer: {
    ...styles.ph20,
    ...styles.pv10,
    borderWidth: moderateScale(2),
    borderRadius: moderateScale(32),
    ...styles.mt15,
    ...styles.mh5,
  },
  chipMainContainer: {
    ...styles.wrap,
    ...styles.flexRow,
  },
  columnWrapperStyle: {
    ...styles.wrap,
  },
});
