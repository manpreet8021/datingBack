import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { colors, styles } from '../../themes';
import FText from '../../components/common/FText';

export default function CustomCountDown({ duration = 59, onFinish, keyId, digitStyle, digitTxtStyle }) {
  const [timeLeft, setTimeLeft] = useState(duration);

  useEffect(() => {
    setTimeLeft(duration); // reset when keyId changes
  }, [keyId]);

  useEffect(() => {
    if (timeLeft === 0) {
      onFinish && onFinish();
      return;
    }

    const interval = setInterval(() => {
      setTimeLeft(prev => prev - 1);
    }, 1000);

    return () => clearInterval(interval); // cleanup
  }, [timeLeft]);

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  return (
    <View style={[localStyle.countdownText]}>
      <FText style={[localStyle.seperater, digitTxtStyle]}>
        {`${minutes < 10 ? '0' : ''}${minutes} : ${seconds < 10 ? '0' : ''}${seconds}`}
      </FText>
    </View>
  );
}

const localStyle = StyleSheet.create({
  countdownText: {
    ...styles.ml5,
    ...styles.digitCont
  },
  seperater: {
    ...styles.separatorTxt,
    ...styles.digitTxt,
    ...styles.timeTxt
  }
});