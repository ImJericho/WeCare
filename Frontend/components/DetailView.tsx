import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity,
  ScrollView
} from 'react-native';
import VitalSignsGraph from './VitalSignsGraph';

const DetailView = ({ data, onClose }) => {
  if (!data) return null;

  const formatTimestamp = (date) => {
    return new Intl.DateTimeFormat('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true,
    }).format(date);
  };

  return (
    <View style={styles.modalContainer}>
      <ScrollView style={styles.modalContent}>
        <View style={styles.header}>
          <Text style={styles.title}>{data.title}</Text>
          <View style={styles.timestampContainer}>
            <Text style={styles.timestampLabel}>Last Updated:</Text>
            <Text style={styles.timestamp}>
              {formatTimestamp(data.lastUpdate)}
            </Text>
          </View>
        </View>
        
        <View style={styles.valueContainer}>
          <Text style={styles.currentValue}>Current Value</Text>
          <Text style={styles.value}>
            {data.value}
            <Text style={styles.unit}>{data.unit}</Text>
          </Text>
        </View>

        <View style={styles.infoContainer}>
          <Text style={styles.rangeLabel}>Normal Range:</Text>
          <Text style={styles.range}>
            {`${data.max * 0.75}-${data.max} ${data.unit}`}
          </Text>
        </View>

        {/* Graph Component */}
        <VitalSignsGraph data={data} />

        <TouchableOpacity 
          style={styles.closeButton} 
          onPress={onClose}
          activeOpacity={0.7}
        >
          <Text style={styles.closeButtonText}>Close</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 20,
    width: '90%',
    maxHeight: '90%',
    padding: 20,
  },
  header: {
    width: '100%',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  timestampContainer: {
    marginTop: 10,
    alignItems: 'center',
  },
  timestampLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 2,
  },
  timestamp: {
    fontSize: 16,
    color: '#333',
    fontWeight: '500',
  },
  valueContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  currentValue: {
    fontSize: 16,
    color: '#666',
    marginBottom: 5,
  },
  value: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#007AFF',
  },
  unit: {
    fontSize: 24,
    color: '#666',
  },
  infoContainer: {
    width: '100%',
    backgroundColor: '#f5f5f5',
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
  },
  rangeLabel: {
    fontSize: 16,
    color: '#666',
    marginBottom: 5,
  },
  range: {
    fontSize: 18,
    color: '#333',
    fontWeight: '500',
  },
  closeButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 30,
    paddingVertical: 12,
    borderRadius: 25,
    width: '100%',
    marginTop: 20,
  },
  closeButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
});

export default DetailView;