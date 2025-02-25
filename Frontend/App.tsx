import React from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import WelcomeScreen from './screen/WelcomeScreen';
import MainApp from './MainApp'; 

const App = () => {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
};

const AppContent = () => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? <MainApp /> : <WelcomeScreen />;
};

export default App;