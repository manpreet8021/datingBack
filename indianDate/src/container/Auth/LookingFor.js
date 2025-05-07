import { FlatList, StyleSheet, TouchableOpacity, View } from 'react-native';
import React, { useState } from 'react';
import Ionicons from 'react-native-vector-icons/Ionicons';
// custom import
import FSafeAreaView from '../../components/common/FSafeAreaView';
import FHeader from '../../components/common/FHeader';
import { colors, styles } from '../../themes';
import { getHeight, getWidth, moderateScale } from '../../common/constants';
import FText from '../../components/common/FText';
import StepIndicator from '../../components/Home/StepIndicator';
import { AuthNav } from '../../navigation/navigationKey';
import strings from '../../i18n/strings';
import { useDispatch, useSelector } from 'react-redux';
import { setUser } from '../../store/slice/authSlice';
import { useGetLookupValueQuery } from '../../store/slice/api/lookupApiSlice';

export default function LookingFor({ navigation }) {
	const user = useSelector(state => state.auth);
	const [select, setSelect] = useState(user.userInfo?.lookingFor);
	const dispatch = useDispatch();
	const { data: genderData, isLoading } = useGetLookupValueQuery('gender');

	const onPressItem = item => {
		console.log(item)
		setSelect(prevSelect => {
			if (prevSelect.includes(item.id)) {
				return prevSelect.filter(i => i !== item.id);
			} else {
				return [...prevSelect, item.id];
			}
		});
	};

	const onPressNext = () => {
		if (select === '') {
			alert(strings.pleaseSelectWhomYouAreLookingFor);
		} else {
			dispatch(setUser({ lookingFor: select }));
			navigation.navigate(AuthNav.SelectInterest);
		}
	};

	const selectGender = ({ item, index }) => {
		return (
			<TouchableOpacity
				onPress={() => onPressItem(item)}
				style={[
					localStyle.genderContainer,
					{
						borderColor: select.includes(item.id) ? colors.secondary1 : colors.white,
					},
				]}>
				{select.includes(item.id) ? (
					<Ionicons
						name={'checkmark-circle'}
						color={colors.secondary1}
						size={moderateScale(20)}
						style={localStyle.checkMarkIcon}
					/>
				) : null}

				<View
					style={[
						localStyle.iconBg,
						{
							backgroundColor:
								select.includes(item.id) ? colors.secondary1 : colors.primary,
						},
					]}>
					<Ionicons
						name={item.icon}
						size={moderateScale(32)}
						color={item.color}
					/>
				</View>
				<FText type={'M16'} color={colors.primary} style={localStyle.titleText}>
					{item.name}
				</FText>
			</TouchableOpacity>
		);
	};

	return (
		<FSafeAreaView>
			<FHeader />
			<View style={localStyle.mainContainer}>
				<View>
					<FText type={'B24'} color={colors.primary} align={'center'}>
						{strings.whomYouAreLookingFor	}
					</FText>
					{!isLoading && (
						<FlatList
							data={genderData}
							renderItem={selectGender}
							numColumns={2}
							keyExtractor={(item, index) => index.toString()}
							showsHorizontalScrollIndicator={false}
							bounces={false}
						/>
					)}
				</View>
				<View>
					<StepIndicator step={4} rightIcon onPressNext={onPressNext} />
				</View>
			</View>
		</FSafeAreaView>
	);
}

const localStyle = StyleSheet.create({
	genderContainer: {
		height: getHeight(150),
		width: getWidth(160),
		borderWidth: moderateScale(1),
		...styles.mr10,
		...styles.p20,
		...styles.center,
		borderRadius: moderateScale(24),
		backgroundColor: colors.white,
		...styles.mt20,
	},
	iconBg: {
		height: moderateScale(56),
		width: moderateScale(56),
		borderRadius: moderateScale(56 / 2),
		...styles.center,
	},
	mainContainer: {
		...styles.ph20,
		...styles.justifyBetween,
		...styles.flex,
	},
	titleText: {
		...styles.mt20,
	},
	checkMarkIcon: {
		...styles.selfEnd,
	},
});
