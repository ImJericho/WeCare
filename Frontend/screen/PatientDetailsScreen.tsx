import React, {useState, useEffect, useCallback} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
} from 'react-native';
import {useAuth} from '../context/AuthContext';
import {PatientDetailAPI} from '../src/services/api';

const PatientDetailsScreen = () => {
  const initialPatientInfo = {
    name: 'Baby Jain',
    id: 'NEO2023001',
    dateOfBirth: '2025-02-10',
    age: '5 days',
    weight: '3.2 kg',
    gender: 'Female',
    bloodType: 'O+',
    mother: 'Mom Jain',
    father: 'Dad Jain',
    ward: 'NICU-A',
    bedNumber: 'A-101',
    admissionDate: '2025-02-15',
    primaryCondition: 'Premature Birth',
    gestationalAge: '34 weeks',
  };

  const [patientInfo, setPatientInfo] = useState(initialPatientInfo);

  const {user} = useAuth();
  console.log('user = ', user);

  const getPatientDetails = useCallback(async () => {
    const userDetials = await PatientDetailAPI.getPatientDetails({
      userID: user.id,
    });
    console.log('the UserDetails = ', userDetials);
    setPatientInfo(prev => {
      return {...prev, ...userDetials};
    });
  }, [user.id]);

  useEffect(() => {
    getPatientDetails();
  }, [getPatientDetails]);

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Image
          source={require('../assets/baby-avatar.png')}
          style={styles.avatar}
        />
        <View style={styles.headerInfo}>
          <Text style={styles.name}>{patientInfo.name}</Text>
          <Text style={styles.id}>ID: {patientInfo.id}</Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Basic Information</Text>
        <View style={styles.infoGrid}>
          <InfoItem label="Date of Birth" value={patientInfo.dateOfBirth} />
          <InfoItem label="Age" value={patientInfo.age} />
          <InfoItem label="Weight" value={patientInfo.weight} />
          <InfoItem label="Gender" value={patientInfo.gender} />
          <InfoItem label="Blood Type" value={patientInfo.bloodType} />
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Parents Information</Text>
        <View style={styles.infoGrid}>
          <InfoItem label="Mother" value={patientInfo.mother} />
          <InfoItem label="Father" value={patientInfo.father} />
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Hospital Details</Text>
        <View style={styles.infoGrid}>
          <InfoItem label="Ward" value={patientInfo.ward} />
          <InfoItem label="Bed Number" value={patientInfo.bedNumber} />
          <InfoItem label="Admission Date" value={patientInfo.admissionDate} />
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Medical Information</Text>
        <View style={styles.infoGrid}>
          <InfoItem
            label="Primary Condition"
            value={patientInfo.primaryCondition}
          />
          <InfoItem
            label="Gestational Age"
            value={patientInfo.gestationalAge}
          />
        </View>
      </View>
    </ScrollView>
  );
};

const InfoItem = ({label, value}) => (
  <View style={styles.infoItem}>
    <Text style={styles.label}>{label}</Text>
    <Text style={styles.value}>{value}</Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    flexDirection: 'row',
    padding: 20,
    backgroundColor: '#fff',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginRight: 15,
  },
  headerInfo: {
    flex: 1,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  id: {
    fontSize: 16,
    color: '#666',
    marginTop: 5,
  },
  section: {
    backgroundColor: '#fff',
    margin: 10,
    padding: 15,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  infoGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  infoItem: {
    width: '50%',
    marginBottom: 15,
  },
  label: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
  },
  value: {
    fontSize: 16,
    color: '#333',
    fontWeight: '500',
  },
});

export default PatientDetailsScreen;
