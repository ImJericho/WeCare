import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { useAuth } from '../context/AuthContext';

const WelcomeScreen = () => {
  const [mode, setMode] = useState<'welcome' | 'login' | 'register'>('welcome');
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'patient' as 'patient' | 'doctor' | 'admin',
  });

  const { login, register } = useAuth();

  const handleLogin = async () => {
    try {
      setLoading(true);
      await login(formData.email, formData.password);
    } catch (error) {
      Alert.alert('Error', 'Invalid credentials');
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async () => {
    if (formData.password !== formData.confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }

    try {
      setLoading(true);
      await register(formData);
    } catch (error) {
      Alert.alert('Error', 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  if (mode === 'welcome') {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Welcome to Neonatal Monitoring System</Text>
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.button}
            onPress={() => setMode('login')}>
            <Text style={styles.buttonText}>Login</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.button, styles.registerButton]}
            onPress={() => setMode('register')}>
            <Text style={styles.buttonText}>Register</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>
        {mode === 'login' ? 'Login' : 'Register'}
      </Text>

      {mode === 'register' && (
        <TextInput
          style={styles.input}
          placeholder="Full Name"
          value={formData.name}
          onChangeText={text => setFormData({ ...formData, name: text })}
        />
      )}

      <TextInput
        style={styles.input}
        placeholder="Email"
        value={formData.email}
        onChangeText={text => setFormData({ ...formData, email: text })}
        keyboardType="email-address"
        autoCapitalize="none"
      />

      <TextInput
        style={styles.input}
        placeholder="Password"
        value={formData.password}
        onChangeText={text => setFormData({ ...formData, password: text })}
        secureTextEntry
      />

      {mode === 'register' && (
        <>
          <TextInput
            style={styles.input}
            placeholder="Confirm Password"
            value={formData.confirmPassword}
            onChangeText={text =>
              setFormData({ ...formData, confirmPassword: text })
            }
            secureTextEntry
          />

          <View style={styles.roleSelector}>
            <Text style={styles.roleLabel}>Select Role:</Text>
            <View style={styles.roleButtons}>
              <TouchableOpacity
                style={[
                  styles.roleButton,
                  formData.role === 'patient' && styles.activeRoleButton,
                ]}
                onPress={() => setFormData({ ...formData, role: 'patient' })}>
                <Text
                  style={[
                    styles.roleButtonText,
                    formData.role === 'patient' && styles.activeRoleButtonText,
                  ]}>
                  Patient
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.roleButton,
                  formData.role === 'doctor' && styles.activeRoleButton,
                ]}
                onPress={() => setFormData({ ...formData, role: 'doctor' })}>
                <Text
                  style={[
                    styles.roleButtonText,
                    formData.role === 'doctor' && styles.activeRoleButtonText,
                  ]}>
                  Doctor
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </>
      )}

      {loading ? (
        <ActivityIndicator size="large" color="#007AFF" />
      ) : (
        <TouchableOpacity
          style={styles.button}
          onPress={mode === 'login' ? handleLogin : handleRegister}>
          <Text style={styles.buttonText}>
            {mode === 'login' ? 'Login' : 'Register'}
          </Text>
        </TouchableOpacity>
      )}

      <TouchableOpacity
        style={styles.switchButton}
        onPress={() => {
          setMode(mode === 'login' ? 'register' : 'login');
          setFormData({
            name: '',
            email: '',
            password: '',
            confirmPassword: '',
            role: 'patient',
          });
        }}>
        <Text style={styles.switchButtonText}>
          {mode === 'login'
            ? "Don't have an account? Register"
            : 'Already have an account? Login'}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.backButton}
        onPress={() => setMode('welcome')}>
        <Text style={styles.backButtonText}>Back to Welcome</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 30,
    color: '#333',
  },
  input: {
    backgroundColor: '#f5f5f5',
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
    fontSize: 16,
  },
  buttonContainer: {
    width: '100%',
  },
  button: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 15,
  },
  registerButton: {
    backgroundColor: '#34C759',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  switchButton: {
    marginTop: 15,
  },
  switchButtonText: {
    color: '#007AFF',
    textAlign: 'center',
    fontSize: 16,
  },
  backButton: {
    marginTop: 15,
  },
  backButtonText: {
    color: '#666',
    textAlign: 'center',
    fontSize: 16,
  },
  roleSelector: {
    marginBottom: 15,
  },
  roleLabel: {
    fontSize: 16,
    color: '#333',
    marginBottom: 10,
  },
  roleButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  roleButton: {
    flex: 1,
    padding: 15,
    backgroundColor: '#f5f5f5',
    borderRadius: 10,
    marginHorizontal: 5,
    alignItems: 'center',
  },
  activeRoleButton: {
    backgroundColor: '#007AFF',
  },
  roleButtonText: {
    fontSize: 16,
    color: '#333',
  },
  activeRoleButtonText: {
    color: '#fff',
  },
});

export default WelcomeScreen;