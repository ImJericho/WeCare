import React from 'react';
import {View, StyleSheet, TouchableOpacity} from 'react-native';
import CircularProgress from '../components/CircularProgress';

const HomeScreen = ({setSelected, setOptions}) => {
  const vitalSigns = [
    {title: 'SpO2', value: 98, unit: '%', max: 100},
    {title: 'Temperature', value: 37.2, unit: '°C', max: 42},
    {title: 'Blood Pressure', value: 80, unit: 'mmHg', max: 120},
    {title: 'Pulse', value: 120, unit: 'bpm', max: 160},
  ];

  return (
    <View style={styles.container}>
      {vitalSigns.map((sign, index) => (
        <TouchableOpacity
          key={index}
          style={styles.vitalSignContainer}
          onPress={() => {
            setSelected('detail');
            setOptions({
              title: sign.title,
              headerBackTitle: 'Back',
              data: {
                title: sign.title,
                value: sign.value,
                unit: sign.unit,
                max: sign.max,
              },
            });
          }}>
          <CircularProgress
            percentage={(sign.value / sign.max) * 100}
            text={`${sign.value}${sign.unit}`}
            title={sign.title}
          />
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#f0f0f0',
  },
  vitalSignContainer: {
    width: '45%',
    aspectRatio: 1,
    marginBottom: 16,
  },
});

export default HomeScreen;
