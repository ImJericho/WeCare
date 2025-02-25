import React from 'react';
import {
  View,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  Text,
} from 'react-native';
import {LineChart} from 'react-native-chart-kit';

const DetailScreen = ({options, setSelectedScreen}) => {
  const {data} = options;

  // Mock data for the chart
  const chartData = {
    labels: ['00:00', '04:00', '08:00', '12:00', '16:00', '20:00'],
    datasets: [
      {
        data: [
          Math.random() * data.max,
          Math.random() * data.max,
          Math.random() * data.max,
          Math.random() * data.max,
          Math.random() * data.max,
          Math.random() * data.max,
        ],
      },
    ],
  };

  return (
    <View style={styles.container}>
      {/* Back button */}
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => setSelectedScreen('default')}>
        <Text style={styles.backButtonText}>Back</Text>
      </TouchableOpacity>
      <LineChart
        data={chartData}
        width={Dimensions.get('window').width - 16}
        height={220}
        yAxisSuffix={data.unit}
        chartConfig={{
          backgroundColor: '#ffffff',
          backgroundGradientFrom: '#ffffff',
          backgroundGradientTo: '#ffffff',
          decimalPlaces: 1,
          color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
          style: {
            borderRadius: 16,
          },
        }}
        bezier
        style={styles.chart}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
  },
  chart: {
    marginVertical: 8,
    borderRadius: 16,
  },
  backButton: {
    position: 'absolute',
    top: 16,
    left: 16,
    padding: 8,
    borderRadius: 8,
    backgroundColor: '#ffffff',
  },
  backButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default DetailScreen;
