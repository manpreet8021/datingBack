import React from 'react';
import { colors, styles } from '../../themes';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import {moderateScale} from '../../common/constants';
import FText from './FText';

const FloatingAddButton = ({ onPress }) => {
  return (
    <View style={localStyle.container}>
      <TouchableOpacity style={localStyle.fab} onPress={onPress}>
        <FText type={"s36"} color={colors.white}>+</FText>
      </TouchableOpacity>
    </View>
  );
};

const localStyle = StyleSheet.create({
  fab: {
    position: 'absolute',
    bottom: 100,
    right: 20,
    backgroundColor: colors.secondary1,
    width: moderateScale(70),
    height: moderateScale(70),
    borderRadius: moderateScale(80 / 4),
    ...styles.center
  },
});

export default FloatingAddButton;