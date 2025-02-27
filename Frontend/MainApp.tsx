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
  let stat='patient'
  if(user?.role=='admin'){
    stat='users'
  }
  const [activeTab, setActiveTab] = React.useState(stat);

  const getAvailableTabs = () => {
    const tabs = []
    if (user?.role === 'admin') {
      tabs.push({ id: 'users', label: 'User Management' });
    }
    if(user?.role === 'patient'){
      tabs.push({ id: 'patient', label: 'Patient Details' });
      tabs.push({ id: 'vitals', label: 'Vital Signs' });
    }
    if(user?.role === 'doctor'){
      tabs.push({ id: 'doctor', label: 'Doctor Details' });
    }
    tabs.push({ id: 'chat', label: 'Chatbot' });

    

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
        {activeTab === 'users' && user?.role === 'admin' && <UserManagementScreen />}
        {activeTab === 'patient' && <PatientDetailsScreen />}
        {activeTab === 'doctor' && <DoctorDetailsScreen />}
        {activeTab === 'vitals' && <VitalSignsScreen />}
        {activeTab === 'chat' && <ChatbotScreen />}
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