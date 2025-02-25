import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
} from 'react-native';

const UserManagementScreen = () => {
  const [userType, setUserType] = useState('patient');
  
  // Patient Form Data
  const [patientForm, setPatientForm] = useState({
    name: '',
    id: '',
    dateOfBirth: '',
    age: '',
    weight: '',
    gender: '',
    bloodType: '',
    mother: '',
    father: '',
    ward: '',
    bedNumber: '',
    admissionDate: '',
    primaryCondition: '',
    gestationalAge: '',
  });

  // Doctor Form Data
  const [doctorForm, setDoctorForm] = useState({
    name: '',
    id: '',
    specialization: '',
    experience: '',
    department: '',
    position: '',
    email: '',
    phone: '',
    schedule: '',
    education: '',
  });

  const handleSubmit = () => {
    const formData = userType === 'patient' ? patientForm : doctorForm;
    
    // Basic validation
    if (!formData.name || !formData.id) {
      Alert.alert('Error', 'Name and ID are required fields');
      return;
    }

    // Replace with actual API call
    console.log('Submitting form:', formData);
    Alert.alert('Success', `${userType} data saved successfully!`);
  };

  const renderPatientForm = () => (
    <View style={styles.formContainer}>
      <Text style={styles.sectionTitle}>Basic Information</Text>
      <View style={styles.inputGroup}>
        <FormInput
          label="Full Name"
          value={patientForm.name}
          onChangeText={(text) => setPatientForm({...patientForm, name: text})}
        />
        <FormInput
          label="Patient ID"
          value={patientForm.id}
          onChangeText={(text) => setPatientForm({...patientForm, id: text})}
        />
        <FormInput
          label="Date of Birth"
          value={patientForm.dateOfBirth}
          onChangeText={(text) => setPatientForm({...patientForm, dateOfBirth: text})}
        />
        <FormInput
          label="Age"
          value={patientForm.age}
          onChangeText={(text) => setPatientForm({...patientForm, age: text})}
        />
        <FormInput
          label="Weight"
          value={patientForm.weight}
          onChangeText={(text) => setPatientForm({...patientForm, weight: text})}
        />
        <FormInput
          label="Gender"
          value={patientForm.gender}
          onChangeText={(text) => setPatientForm({...patientForm, gender: text})}
        />
        <FormInput
          label="Blood Type"
          value={patientForm.bloodType}
          onChangeText={(text) => setPatientForm({...patientForm, bloodType: text})}
        />
      </View>

      <Text style={styles.sectionTitle}>Parents Information</Text>
      <View style={styles.inputGroup}>
        <FormInput
          label="Mother's Name"
          value={patientForm.mother}
          onChangeText={(text) => setPatientForm({...patientForm, mother: text})}
        />
        <FormInput
          label="Father's Name"
          value={patientForm.father}
          onChangeText={(text) => setPatientForm({...patientForm, father: text})}
        />
      </View>

      <Text style={styles.sectionTitle}>Hospital Details</Text>
      <View style={styles.inputGroup}>
        <FormInput
          label="Ward"
          value={patientForm.ward}
          onChangeText={(text) => setPatientForm({...patientForm, ward: text})}
        />
        <FormInput
          label="Bed Number"
          value={patientForm.bedNumber}
          onChangeText={(text) => setPatientForm({...patientForm, bedNumber: text})}
        />
        <FormInput
          label="Admission Date"
          value={patientForm.admissionDate}
          onChangeText={(text) => setPatientForm({...patientForm, admissionDate: text})}
        />
      </View>

      <Text style={styles.sectionTitle}>Medical Information</Text>
      <View style={styles.inputGroup}>
        <FormInput
          label="Primary Condition"
          value={patientForm.primaryCondition}
          onChangeText={(text) => setPatientForm({...patientForm, primaryCondition: text})}
        />
        <FormInput
          label="Gestational Age"
          value={patientForm.gestationalAge}
          onChangeText={(text) => setPatientForm({...patientForm, gestationalAge: text})}
        />
      </View>
    </View>
  );

  const renderDoctorForm = () => (
    <View style={styles.formContainer}>
      <Text style={styles.sectionTitle}>Professional Information</Text>
      <View style={styles.inputGroup}>
        <FormInput
          label="Full Name"
          value={doctorForm.name}
          onChangeText={(text) => setDoctorForm({...doctorForm, name: text})}
        />
        <FormInput
          label="Doctor ID"
          value={doctorForm.id}
          onChangeText={(text) => setDoctorForm({...doctorForm, id: text})}
        />
        <FormInput
          label="Specialization"
          value={doctorForm.specialization}
          onChangeText={(text) => setDoctorForm({...doctorForm, specialization: text})}
        />
        <FormInput
          label="Experience"
          value={doctorForm.experience}
          onChangeText={(text) => setDoctorForm({...doctorForm, experience: text})}
        />
        <FormInput
          label="Department"
          value={doctorForm.department}
          onChangeText={(text) => setDoctorForm({...doctorForm, department: text})}
        />
        <FormInput
          label="Position"
          value={doctorForm.position}
          onChangeText={(text) => setDoctorForm({...doctorForm, position: text})}
        />
      </View>

      <Text style={styles.sectionTitle}>Contact Information</Text>
      <View style={styles.inputGroup}>
        <FormInput
          label="Email"
          value={doctorForm.email}
          onChangeText={(text) => setDoctorForm({...doctorForm, email: text})}
          keyboardType="email-address"
        />
        <FormInput
          label="Phone"
          value={doctorForm.phone}
          onChangeText={(text) => setDoctorForm({...doctorForm, phone: text})}
          keyboardType="phone-pad"
        />
      </View>

      <Text style={styles.sectionTitle}>Additional Information</Text>
      <View style={styles.inputGroup}>
        <FormInput
          label="Schedule"
          value={doctorForm.schedule}
          onChangeText={(text) => setDoctorForm({...doctorForm, schedule: text})}
          multiline
        />
        <FormInput
          label="Education & Certifications"
          value={doctorForm.education}
          onChangeText={(text) => setDoctorForm({...doctorForm, education: text})}
          multiline
        />
      </View>
    </View>
  );

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>User Management</Text>
      </View>

      <View style={styles.typeSelector}>
        <TouchableOpacity
          style={[styles.typeButton, userType === 'patient' && styles.activeTypeButton]}
          onPress={() => setUserType('patient')}>
          <Text style={[styles.typeButtonText, userType === 'patient' && styles.activeTypeButtonText]}>
            Patient Registration
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.typeButton, userType === 'doctor' && styles.activeTypeButton]}
          onPress={() => setUserType('doctor')}>
          <Text style={[styles.typeButtonText, userType === 'doctor' && styles.activeTypeButtonText]}>
            Doctor Registration
          </Text>
        </TouchableOpacity>
      </View>

      {userType === 'patient' ? renderPatientForm() : renderDoctorForm()}

      <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
        <Text style={styles.submitButtonText}>Save Information</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

// FormInput Component
const FormInput = ({ label, value, onChangeText, keyboardType = 'default', multiline = false }) => (
  <View style={styles.inputContainer}>
    <Text style={styles.inputLabel}>{label}</Text>
    <TextInput
      style={[styles.input, multiline && styles.multilineInput]}
      value={value}
      onChangeText={onChangeText}
      keyboardType={keyboardType}
      multiline={multiline}
      numberOfLines={multiline ? 3 : 1}
    />
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: '#fff',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  typeSelector: {
    flexDirection: 'row',
    padding: 10,
    backgroundColor: '#fff',
    marginVertical: 10,
  },
  typeButton: {
    flex: 1,
    padding: 15,
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    marginHorizontal: 5,
    borderRadius: 10,
  },
  activeTypeButton: {
    backgroundColor: '#007AFF',
  },
  typeButtonText: {
    fontSize: 16,
    color: '#333',
  },
  activeTypeButtonText: {
    color: '#fff',
  },
  formContainer: {
    backgroundColor: '#fff',
    margin: 10,
    borderRadius: 10,
    padding: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
    marginTop: 10,
  },
  inputGroup: {
    marginBottom: 20,
  },
  inputContainer: {
    marginBottom: 15,
  },
  inputLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
  },
  input: {
    backgroundColor: '#f5f5f5',
    padding: 12,
    borderRadius: 8,
    fontSize: 16,
    color: '#333',
  },
  multilineInput: {
    height: 80,
    textAlignVertical: 'top',
  },
  submitButton: {
    backgroundColor: '#007AFF',
    margin: 10,
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default UserManagementScreen;