import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity, Modal, Text } from 'react-native';
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
      lastUpdate: new Date()
    },
    { 
      title: 'Temperature', 
      value: 37.2, 
      unit: '°C', 
      max: 42,
      lastUpdate: new Date()
    },
    { 
      title: 'Blood Pressure', 
      value: 80, 
      unit: 'mmHg', 
      max: 120,
      lastUpdate: new Date()
    },
    { 
      title: 'Pulse', 
      value: 120, 
      unit: 'bpm', 
      max: 160,
      lastUpdate: new Date()
    }
  ];

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