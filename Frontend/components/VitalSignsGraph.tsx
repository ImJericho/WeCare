import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Dimensions,
} from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import DateTimePicker from '@react-native-community/datetimepicker';

interface VitalSignsGraphProps {
  data: {
    title: string;
    value: number;
    unit: string;
    max: number;
  };
}

const VitalSignsGraph: React.FC<VitalSignsGraphProps> = ({ data }) => {
  const [activeTab, setActiveTab] = useState<'hours' | 'dateRange'>('hours');
  const [hours, setHours] = useState('24');
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [dateType, setDateType] = useState<'start' | 'end'>('start');
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());

  // Replace with actual API call (actual data fetching)
  const generateGraphData = () => {
    if (activeTab === 'hours') {
      const hoursCount = parseInt(hours) || 24;
      const labels = [];
      const values = [];
      for (let i = 0; i <= hoursCount; i += hoursCount / 4) {
        labels.push(`${i}h`);
        values.push(data.value + Math.random() * 4 - 2);
      }
      return { labels, values };
    } else {
      const daysDiff = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 3600 * 24));
      const labels = [];
      const values = [];
      for (let i = 0; i <= daysDiff; i++) {
        labels.push(`Day ${i + 1}`);
        values.push(data.value + Math.random() * 4 - 2);
      }
      return { labels, values };
    }
  };

  const graphData = generateGraphData();

  const handleDateChange = (event: any, selectedDate?: Date) => {
    setShowDatePicker(false);
    if (selectedDate) {
      if (dateType === 'start') {
        setStartDate(selectedDate);
      } else {
        setEndDate(selectedDate);
      }
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Historical Data</Text>

      {/* Tab Selector */}
      <View style={styles.tabSelector}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'hours' && styles.activeTab]}
          onPress={() => setActiveTab('hours')}>
          <Text style={[styles.tabText, activeTab === 'hours' && styles.activeTabText]}>
            Hours
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'dateRange' && styles.activeTab]}
          onPress={() => setActiveTab('dateRange')}>
          <Text style={[styles.tabText, activeTab === 'dateRange' && styles.activeTabText]}>
            Date Range
          </Text>
        </TouchableOpacity>
      </View>

      {/* Hours Input */}
      {activeTab === 'hours' && (
        <View style={styles.hoursContainer}>
          <Text style={styles.label}>Hours to look back:</Text>
          <TextInput
            style={styles.hoursInput}
            value={hours}
            onChangeText={setHours}
            keyboardType="numeric"
            placeholder="Enter hours"
          />
        </View>
      )}

      {/* Date Range Picker */}
      {activeTab === 'dateRange' && (
        <View style={styles.dateRangeContainer}>
          <TouchableOpacity
            style={styles.dateButton}
            onPress={() => {
              setDateType('start');
              setShowDatePicker(true);
            }}>
            <Text style={styles.dateButtonText}>
              From: {startDate.toLocaleDateString()}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.dateButton}
            onPress={() => {
              setDateType('end');
              setShowDatePicker(true);
            }}>
            <Text style={styles.dateButtonText}>
              To: {endDate.toLocaleDateString()}
            </Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Graph */}
      <View style={styles.graphWrapper}>
        <LineChart
          data={{
            labels: graphData.labels,
            datasets: [{
              data: graphData.values
            }]
          }}
          width={Dimensions.get('window').width - 60}
          height={220}
          chartConfig={{
            backgroundColor: '#ffffff',
            backgroundGradientFrom: '#ffffff',
            backgroundGradientTo: '#ffffff',
            decimalPlaces: 1,
            color: (opacity = 1) => `rgba(0, 122, 255, ${opacity})`,
            labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
            style: {
              borderRadius: 16,
            },
            propsForDots: {
              r: '6',
              strokeWidth: '2',
              stroke: '#007AFF',
            },
          }}
          bezier
          style={styles.graph}
        />
      </View>

      {showDatePicker && (
        <DateTimePicker
          value={dateType === 'start' ? startDate : endDate}
          mode="date"
          display="default"
          onChange={handleDateChange}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 15,
    backgroundColor: '#f5f5f5',
    borderRadius: 10,
    marginTop: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  tabSelector: {
    flexDirection: 'row',
    marginBottom: 15,
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 5,
  },
  tab: {
    flex: 1,
    padding: 10,
    alignItems: 'center',
    borderRadius: 8,
  },
  activeTab: {
    backgroundColor: '#007AFF',
  },
  tabText: {
    fontSize: 16,
    color: '#333',
  },
  activeTabText: {
    color: '#fff',
  },
  hoursContainer: {
    marginBottom: 15,
  },
  label: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
  },
  hoursInput: {
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 8,
    fontSize: 16,
  },
  dateRangeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  dateButton: {
    flex: 1,
    padding: 10,
    marginHorizontal: 5,
    backgroundColor: '#fff',
    borderRadius: 8,
    alignItems: 'center',
  },
  dateButtonText: {
    fontSize: 14,
    color: '#333',
  },
  graphWrapper: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 10,
    alignItems: 'center',
  },
  graph: {
    marginVertical: 8,
    borderRadius: 16,
  },
});

export default VitalSignsGraph;