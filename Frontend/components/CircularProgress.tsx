import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import Svg, {Circle} from 'react-native-svg';

const CircularProgress = ({percentage, text, title}) => {
  const size = 150;
  const strokeWidth = 10;
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  const color = getColor(percentage);

  return (
    <View style={styles.container}>
      <Svg width={size} height={size}>
        <Circle
          stroke="#e6e6e6"
          fill="none"
          cx={size / 2}
          cy={size / 2}
          r={radius}
          strokeWidth={strokeWidth}
        />
        <Circle
          stroke={color}
          fill="none"
          cx={size / 2}
          cy={size / 2}
          r={radius}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
        />
      </Svg>
      <View style={styles.textContainer}>
        <Text style={[styles.text, {color}]}>{text}</Text>
        <Text style={styles.title}>{title}</Text>
      </View>
    </View>
  );
};

const getColor = percentage => {
  if (percentage < 25) return '#FF0000';
  if (percentage < 50) return '#FFA500';
  if (percentage < 75) return '#FFFF00';
  return '#00FF00';
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  textContainer: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  title: {
    fontSize: 16,
    color: '#333',
  },
});

export default CircularProgress;
