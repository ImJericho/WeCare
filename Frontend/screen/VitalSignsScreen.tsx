import React, { useState, useEffect } from 'react';
import { View, StyleSheet, TouchableOpacity, Modal, Text, Alert } from 'react-native';
import CircularProgress from '../components/CircularProgress';
import DetailView from '../components/DetailView';

const VitalSignsScreen = () => {
  const [selectedVital, setSelectedVital] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  const vitalSigns = [
    { 
      title: 'SpO2', 
      value: 98, 
      unit: '%', 
      max: 100,
      min: 95,
      criticalLow: 90,
      criticalHigh: 100,
      lastUpdate: new Date()
    },
    { 
      title: 'Temperature', 
      value: 37.2, 
      unit: '°C', 
      max: 42,
      min: 36.5,
      criticalLow: 35,
      criticalHigh: 38.5,
      lastUpdate: new Date()
    },
    { 
      title: 'Blood Pressure', 
      value: 45, 
      unit: 'mmHg', 
      max: 120,
      min: 60,
      criticalLow: 50,
      criticalHigh: 90,
      lastUpdate: new Date()
    },
    { 
      title: 'Pulse', 
      value: 110, 
      unit: 'bpm', 
      max: 160,
      min: 120,
      criticalLow: 100,
      criticalHigh: 140,
      lastUpdate: new Date()
    }
  ];

  // Function to determine vital sign status
  const getVitalStatus = (vital) => {
    const percentage = (vital.value / vital.max) * 100;
    
    if (vital.value <= vital.criticalLow || vital.value >= vital.criticalHigh) {
      return 'critical';
    } else if (vital.value < vital.min || vital.value > vital.max) {
      return 'unstable';
    } else if (percentage >= 75) {
      return 'stable';
    } else if (percentage >= 50) {
      return 'moderate';
    } else if (percentage >= 25) {
      return 'unstable';
    } else {
      return 'critical';
    }
  };

  // Function to get alert message based on vital sign status
  const getAlertMessage = (vital) => {
    const status = getVitalStatus(vital);
    if (status === 'critical') {
      return `CRITICAL ALERT: ${vital.title} is at ${vital.value}${vital.unit}, which is ${vital.value < vital.criticalLow ? 'dangerously low' : 'dangerously high'}!`;
    } else if (status === 'unstable') {
      return `WARNING: ${vital.title} is at ${vital.value}${vital.unit}, which is outside the normal range.`;
    }
    return null;
  };

  // Function to check vital signs and show alerts
  const checkVitalSigns = () => {
    const unstableVitals = vitalSigns.filter(vital => {
      const status = getVitalStatus(vital);
      return status === 'critical' || status === 'unstable';
    });
    
    if (unstableVitals.length > 0) {
      const messages = unstableVitals.map(vital => getAlertMessage(vital));
      
      Alert.alert(
        'Vital Sign Alerts',
        messages.join('\n\n'),
        [{ text: 'OK' }],
        { cancelable: false }
      );
    }
  };

  // Check vital signs periodically
  useEffect(() => {
    checkVitalSigns(); // Check immediately on mount
    
    // Set up periodic checking
    const interval = setInterval(checkVitalSigns, 300000); // Check every 5 minutes
    
    return () => clearInterval(interval);
  }, []);

  return (
    <View style={styles.container}>
      {/* Color coding legend */}
      <View style={styles.legendContainer}>
        <Text style={styles.legendTitle}>Status Indicators:</Text>
        <View style={styles.legendItems}>
          <View style={styles.legendItem}>
            <View style={[styles.colorIndicator, { backgroundColor: '#00FF00' }]} />
            <Text style={styles.legendText}>Stable (75-100%)</Text>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.colorIndicator, { backgroundColor: '#FFFF00' }]} />
            <Text style={styles.legendText}>Moderate (50-74%)</Text>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.colorIndicator, { backgroundColor: '#FFA500' }]} />
            <Text style={styles.legendText}>Unstable (25-49%)</Text>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.colorIndicator, { backgroundColor: '#FF0000' }]} />
            <Text style={styles.legendText}>Critical (0-24%)</Text>
          </View>
        </View>
      </View>

      <View style={styles.vitalsContainer}>
        {vitalSigns.map((sign, index) => (
          <TouchableOpacity
            key={index}
            style={styles.vitalSignContainer}
            onPress={() => {
              setSelectedVital(sign);
              setModalVisible(true);
            }}>
            <CircularProgress
              percentage={(sign.value / sign.max) * 100}
              text={`${sign.value}${sign.unit}`}
              title={sign.title}
              status={getVitalStatus(sign)}
            />
          </TouchableOpacity>
        ))}
      </View>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}>
        <DetailView
          data={selectedVital}
          onClose={() => setModalVisible(false)}
          status={selectedVital ? getVitalStatus(selectedVital) : 'stable'}
        />
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f0f0',
  },
  legendContainer: {
    backgroundColor: '#fff',
    padding: 15,
    margin: 10,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  legendTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  legendItems: {
    flexDirection: 'column',
    gap: 8,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  colorIndicator: {
    width: 16,
    height: 16,
    borderRadius: 8,
    marginRight: 8,
  },
  legendText: {
    fontSize: 14,
    color: '#666',
  },
  vitalsContainer: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    alignItems: 'center',
    padding: 16,
  },
  vitalSignContainer: {
    width: '45%',
    aspectRatio: 1,
    marginBottom: 16,
  },
});

export default VitalSignsScreen;