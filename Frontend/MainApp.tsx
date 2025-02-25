import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import VitalSignsScreen from './screen/VitalSignsScreen';
import PatientDetailsScreen from './screen/PatientDetailsScreen';
import DoctorDetailsScreen from './screen/DoctorDetailsScreen';
import ChatbotScreen from './screen/ChatbotScreen';
import UserManagementScreen from './screen/UserManagementScreen';

const MainApp = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = React.useState('vitals');

  const getAvailableTabs = () => {
    const tabs = [
      { id: 'vitals', label: 'Vital Signs' },
      { id: 'patient', label: 'Patient Details' },
      { id: 'doctor', label: 'Doctor Details' },
      { id: 'chat', label: 'Chatbot' },
    ];

    if (user?.role === 'admin') {
      tabs.push({ id: 'users', label: 'User Management' });
    }

    return tabs;
  };

  return (
    <View style={styles.container}>
      <Navbar
        tabs={getAvailableTabs()}
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />
      
      <View style={styles.content}>
        {activeTab === 'vitals' && <VitalSignsScreen />}
        {activeTab === 'patient' && <PatientDetailsScreen />}
        {activeTab === 'doctor' && <DoctorDetailsScreen />}
        {activeTab === 'chat' && <ChatbotScreen />}
        {activeTab === 'users' && user?.role === 'admin' && <UserManagementScreen />}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
  },
});

export default MainApp;