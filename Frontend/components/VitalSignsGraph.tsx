import React, { useState, useEffect } from 'react';
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
  const [graphData, setGraphData] = useState<{ labels: string[]; values: number[] }>({ labels: [], values: [] });

  // Function to generate seeded random number
  const seededRandom = (seed: number) => {
    const x = Math.sin(seed) * 10000;
    return x - Math.floor(x);
  };
  const formatValue = (value: number): number => {
    if (isNaN(value) || !isFinite(value)) {
      return data.value; // Return base value if invalid
    }
    return Number(value.toFixed(1)); // Round to 1 decimal place
  };
  const getConsistentRandomValue = (timeKey: string, baseValue: number): number => {
    try {
      const seed = Array.from(timeKey + data.title).reduce(
        (acc, char) => acc + char.charCodeAt(0),
        0
      );
      const variation = (Math.sin(seed) * 4) - 2; // Use Math.sin instead of custom seededRandom
      
      // Add bounds to keep values reasonable
      const minValue = baseValue * 0.8;
      const maxValue = baseValue * 1.2;
      const value = baseValue + variation;
      
      return formatValue(Math.min(Math.max(value, minValue), maxValue));
    } catch (error) {
      console.error('Error generating value:', error);
      return formatValue(baseValue);
    }
  };

  // Format date for consistent key generation
  const formatDateForKey = (date: Date) => {
    return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
  };

  const generateGraphData = () => {
    try {
      if (activeTab === 'hours') {
        const hoursCount = Math.min(Math.max(parseInt(hours) || 24, 1), 168); // Limit between 1 and 168 hours
        const labels: string[] = [];
        const values: number[] = [];
        const now = new Date();

        for (let i = hoursCount; i >= 0; i -= Math.max(1, hoursCount / 5)) {
          const timeForPoint = new Date(now.getTime() - (i * 60 * 60 * 1000));
          const timeKey = `${formatDateForKey(timeForPoint)}-${timeForPoint.getHours()}`;
          
          labels.push(`${Math.floor(i)}h`);
          values.push(getConsistentRandomValue(timeKey, data.value));
        }

        return {
          labels: labels.filter(Boolean),
          values: values.filter(v => isFinite(v) && !isNaN(v))
        };
      } else {
        const daysDiff = Math.max(1, Math.ceil(
          (endDate.getTime() - startDate.getTime()) / (1000 * 3600 * 24)
        ));
        const labels: string[] = [];
        const values: number[] = [];

        for (let i = 0; i <= Math.min(daysDiff, 30); i++) { // Limit to 30 days
          const dateForPoint = new Date(startDate.getTime() + (i * 24 * 60 * 60 * 1000));
          const timeKey = formatDateForKey(dateForPoint);
          
          labels.push(dateForPoint.toLocaleDateString(undefined, {
            month: 'short',
            day: 'numeric'
          }));
          values.push(getConsistentRandomValue(timeKey, data.value));
        }

        return {
          labels: labels.filter(Boolean),
          values: values.filter(v => isFinite(v) && !isNaN(v))
        };
      }
    } catch (error) {
      console.error('Error generating graph data:', error);
      return { labels: [], values: [] };
    }
  };

  // Update graph data when inputs change
  useEffect(() => {
    try {
      const newData = generateGraphData();
      if (newData.labels.length > 0 && newData.values.length > 0) {
        setGraphData(newData);
      }
    } catch (error) {
      console.error('Error updating graph data:', error);
    }
  }, [activeTab, hours, startDate, endDate, data.value]);

  // Ensure we have valid data before rendering the chart
  const hasValidData = graphData.labels.length > 0 && 
                      graphData.values.length > 0 && 
                      graphData.labels.length === graphData.values.length;

  // Handle date picker changes
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

  // Handle hours input change
  const handleHoursChange = (text: string) => {
    const numericValue = text.replace(/[^0-9]/g, '');
    setHours(numericValue);
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
            onChangeText={handleHoursChange}
            keyboardType="numeric"
            placeholder="Enter hours"
            maxLength={3}
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
        {hasValidData ? (
          <LineChart
            data={{
              labels: graphData.labels,
              datasets: [{
                data: graphData.values.map(v => formatValue(v))
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
              formatYLabel: (value) => formatValue(parseFloat(value)).toString(),
            }}
            bezier
            style={styles.graph}
            fromZero={false}
            segments={5}
          />
        ) : (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>No valid data to display</Text>
          </View>
        )}
      </View>

      {showDatePicker && (
        <DateTimePicker
          value={dateType === 'start' ? startDate : endDate}
          mode="date"
          display="default"
          onChange={handleDateChange}
          maximumDate={new Date()}
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
  errorContainer: {
    height: 220,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    color: '#666',
    fontSize: 16,
  },
});

export default VitalSignsGraph;