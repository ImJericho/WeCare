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
import {PatientDetailAPI, DoctorDetailAPI} from '../src/services/api';

const DoctorDetailsScreen = () => {
  const InitialdoctorInfo = {
    name: 'Dr. Shashvat Jain',
    id: 'DOC2023045',
    specialization: 'Neonatologist',
    experience: '15 years',
    department: 'Neonatal Intensive Care Unit',
    position: 'Senior Consultant',
    email: 'shashvat.jain@hospital.com',
    phone: '+91 95824 96558',
    schedule: [
      {day: 'Monday', hours: '9:00 AM - 5:00 PM'},
      {day: 'Tuesday', hours: '9:00 AM - 5:00 PM'},
      {day: 'Wednesday', hours: '9:00 AM - 5:00 PM'},
      {day: 'Thursday', hours: '9:00 AM - 5:00 PM'},
      {day: 'Friday', hours: '9:00 AM - 3:00 PM'},
    ],
    education: [
      'MD in Pediatrics, ISM Medical School',
      'Fellowship in Neonatology, ISM Hospital',
      'Board Certified in Neonatal-Perinatal Medicine',
    ],
  };

  const [doctorInfo, setDoctorInfo] = useState(InitialdoctorInfo);
  const {user} = useAuth();

  const getPatientsDoctorDetails = useCallback(async () => {
    const doctorDetails = await PatientDetailAPI.getDoctorDetails({
      userID: user.id,
    });
    if (doctorDetails?.education) {
      doctorDetails.education = JSON.parse(doctorDetails?.education);
    }
    if (doctorDetails?.schedule) {
      doctorDetails.schedule = JSON.parse(doctorDetails?.schedule);
    }
    console.log('the doctorDetails = ', doctorDetails);
    setDoctorInfo(prev => {
      return {...prev, ...doctorDetails};
    });
  }, [user.id]);

  const getDoctorDetails = useCallback(async () => {
    const doctorDetails = await DoctorDetailAPI.getDoctorDetails({
      userID: user.id,
    });
    console.log('the doctorDetails = ', doctorDetails);
    if (doctorDetails?.education) {
      doctorDetails.education = JSON.parse(doctorDetails?.education);
    }
    if (doctorDetails?.schedule) {
      doctorDetails.schedule = JSON.parse(doctorDetails?.schedule);
    }
    setDoctorInfo(prev => {
      return {...prev, ...doctorDetails};
    });
  }, [user.id]);

  useEffect(() => {
    if (user && user?.role === 'patient') {
      getPatientsDoctorDetails();
    } else if (user && user?.role === 'doctor') {
      getDoctorDetails();
    } else {
      console.log('Neither Doctor not patient');
    }
  }, [user, getPatientsDoctorDetails, getDoctorDetails]);

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Image
          source={require('../assets/doctor-avatar.png')}
          style={styles.avatar}
        />
        <View style={styles.headerInfo}>
          <Text style={styles.name}>{doctorInfo.name}</Text>
          <Text style={styles.specialization}>{doctorInfo.specialization}</Text>
          <Text style={styles.id}>ID: {doctorInfo.id}</Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Professional Information</Text>
        <View style={styles.infoGrid}>
          <InfoItem label="Department" value={doctorInfo.department} />
          <InfoItem label="Position" value={doctorInfo.position} />
          <InfoItem label="Experience" value={doctorInfo.experience} />
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Contact Information</Text>
        <View style={styles.infoGrid}>
          <InfoItem label="Email" value={doctorInfo.email} />
          <InfoItem label="Phone" value={doctorInfo.phone} />
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Schedule</Text>
        {doctorInfo.schedule.map((schedule, index) => (
          <View key={index} style={styles.scheduleItem}>
            <Text style={styles.scheduleDay}>{schedule.day}</Text>
            <Text style={styles.scheduleHours}>{schedule.hours}</Text>
          </View>
        ))}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Education & Certifications</Text>
        {doctorInfo.education.map((edu, index) => (
          <Text key={index} style={styles.educationItem}>
            • {edu}
          </Text>
        ))}
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
    width: 100,
    height: 100,
    borderRadius: 50,
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
  specialization: {
    fontSize: 18,
    color: '#007AFF',
    marginTop: 5,
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
  scheduleItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  scheduleDay: {
    fontSize: 16,
    color: '#333',
    fontWeight: '500',
  },
  scheduleHours: {
    fontSize: 16,
    color: '#666',
  },
  educationItem: {
    fontSize: 16,
    color: '#333',
    marginBottom: 10,
    lineHeight: 22,
  },
});

export default DoctorDetailsScreen;
