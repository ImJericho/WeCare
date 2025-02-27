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
  Image,
} from 'react-native';
import { useAuth } from '../context/AuthContext';

const WelcomeScreen = () => {
  const [mode, setMode] = useState<'welcome' | 'login'>('welcome');
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const { login } = useAuth();

  const handleLogin = async () => {
    if (!formData.email || !formData.password) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    try {
      setLoading(true);
      await login(formData.email, formData.password);
    } catch (error) {
      Alert.alert('Error', 'Invalid credentials');
    } finally {
      setLoading(false);
    }
  };

  if (mode === 'welcome') {
    return (
      <View style={styles.container}>
        <View style={styles.welcomeContent}>
          <Image
            source={require('../assets/logo.png')}
            style={styles.logo}
            resizeMode="contain"
          />
          <Text style={styles.welcomeText}>Welcome to</Text>
          <View style={styles.titleContainer}>
          <Text style={styles.titleWe}>We</Text>
          <Text style={styles.titleCare}>Care</Text>
          </View>
          <Text style={styles.subtitle}>Neonatal Monitoring System</Text>
          <View style={styles.divider} />
          <Text style={styles.description}>
            Providing advanced monitoring and care{'\n'}for our tiniest patients
          </Text>
        </View>
        <TouchableOpacity
          style={styles.loginButton}
          onPress={() => setMode('login')}>
          <Text style={styles.buttonText}>Login to Continue</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.loginContainer}>
        <View style={styles.titleContainer}>
        <Text style={[styles.titleWe,styles.loginTitleSize]}>We</Text>
        <Text style={[styles.titleCare,styles.loginTitleSize]}>Care</Text>
        </View>
        <Text style={styles.loginTitle}>Login to your account</Text>

        <View style={styles.formContainer}>
          <TextInput
            style={styles.input}
            placeholder="Email"
            value={formData.email}
            onChangeText={text => setFormData({ ...formData, email: text })}
            keyboardType="email-address"
            autoCapitalize="none"
            autoComplete="email"
          />

          <TextInput
            style={styles.input}
            placeholder="Password"
            value={formData.password}
            onChangeText={text => setFormData({ ...formData, password: text })}
            secureTextEntry
            autoComplete="password"
          />

          {loading ? (
            <ActivityIndicator size="large" color="#007AFF" style={styles.loader} />
          ) : (
            <TouchableOpacity
              style={styles.loginButton}
              onPress={handleLogin}>
              <Text style={styles.buttonText}>Login</Text>
            </TouchableOpacity>
          )}

          <TouchableOpacity
            style={styles.backButton}
            onPress={() => {
              setMode('welcome');
              setFormData({ email: '', password: '' });
            }}>
            <Text style={styles.backButtonText}>Back to Welcome Screen</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  welcomeContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  logo: {
    width: 150,
    height: 150,
    marginBottom: 30,
  },
  welcomeText: {
    fontSize: 24,
    color: '#666',
    marginBottom: 10,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  titleWe: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#34C759',
  },
  titleCare: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#007AFF', 
  },
  loginTitleSize: {
    fontSize: 36,
  },
  subtitle: {
    fontSize: 20,
    color: '#333',
    marginBottom: 20,
    textAlign: 'center',
  },
  divider: {
    width: 60,
    height: 4,
    backgroundColor: '#34C759', 
    borderRadius: 2,
    marginBottom: 20,
  },
  loginButton: {
    backgroundColor: '#007AFF', 
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  backButtonText: {
    color: '#34C759', 
    textAlign: 'center',
    fontSize: 16,
  },
  description: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 40,
  },
  loginContainer: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  loginTitle: {
    fontSize: 24,
    color: '#333',
    marginBottom: 30,
    textAlign: 'center',
  },
  formContainer: {
    width: '100%',
    maxWidth: 400,
    alignSelf: 'center',
  },
  input: {
    backgroundColor: '#f5f5f5',
    padding: 15,
    borderRadius: 12,
    marginBottom: 15,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  backButton: {
    marginTop: 15,
    padding: 10,
  },
  loader: {
    marginVertical: 20,
  },
});

export default WelcomeScreen;

// import React, { useState } from 'react';
// import {
//   View,
//   Text,
//   StyleSheet,
//   TouchableOpacity,
//   TextInput,
//   ScrollView,
//   ActivityIndicator,
//   Alert,
// } from 'react-native';
// import { useAuth } from '../context/AuthContext';

// const WelcomeScreen = () => {
//   const [mode, setMode] = useState<'welcome' | 'login' | 'register'>('welcome');
//   const [loading, setLoading] = useState(false);
//   const [formData, setFormData] = useState({
//     name: '',
//     email: '',
//     password: '',
//     confirmPassword: '',
//     role: 'patient' as 'patient' | 'doctor' | 'admin',
//   });

//   const { login, register } = useAuth();

//   const handleLogin = async () => {
//     try {
//       setLoading(true);
//       await login(formData.email, formData.password);
//     } catch (error) {
//       Alert.alert('Error', 'Invalid credentials');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleRegister = async () => {
//     if (formData.password !== formData.confirmPassword) {
//       Alert.alert('Error', 'Passwords do not match');
//       return;
//     }

//     try {
//       setLoading(true);
//       await register(formData);
//     } catch (error) {
//       Alert.alert('Error', 'Registration failed');
//     } finally {
//       setLoading(false);
//     }
//   };

//   if (mode === 'welcome') {
//     return (
//       <View style={styles.container}>
//         <Text style={styles.title}>Welcome to Neonatal Monitoring System</Text>
//         <View style={styles.buttonContainer}>
//           <TouchableOpacity
//             style={styles.button}
//             onPress={() => setMode('login')}>
//             <Text style={styles.buttonText}>Login</Text>
//           </TouchableOpacity>
//           <TouchableOpacity
//             style={[styles.button, styles.registerButton]}
//             onPress={() => setMode('register')}>
//             <Text style={styles.buttonText}>Register</Text>
//           </TouchableOpacity>
//         </View>
//       </View>
//     );
//   }

//   return (
//     <ScrollView contentContainerStyle={styles.container}>
//       <Text style={styles.title}>
//         {mode === 'login' ? 'Login' : 'Register'}
//       </Text>

//       {mode === 'register' && (
//         <TextInput
//           style={styles.input}
//           placeholder="Full Name"
//           value={formData.name}
//           onChangeText={text => setFormData({ ...formData, name: text })}
//         />
//       )}

//       <TextInput
//         style={styles.input}
//         placeholder="Email"
//         value={formData.email}
//         onChangeText={text => setFormData({ ...formData, email: text })}
//         keyboardType="email-address"
//         autoCapitalize="none"
//       />

//       <TextInput
//         style={styles.input}
//         placeholder="Password"
//         value={formData.password}
//         onChangeText={text => setFormData({ ...formData, password: text })}
//         secureTextEntry
//       />

//       {mode === 'register' && (
//         <>
//           <TextInput
//             style={styles.input}
//             placeholder="Confirm Password"
//             value={formData.confirmPassword}
//             onChangeText={text =>
//               setFormData({ ...formData, confirmPassword: text })
//             }
//             secureTextEntry
//           />

//           <View style={styles.roleSelector}>
//             <Text style={styles.roleLabel}>Select Role:</Text>
//             <View style={styles.roleButtons}>
//               <TouchableOpacity
//                 style={[
//                   styles.roleButton,
//                   formData.role === 'patient' && styles.activeRoleButton,
//                 ]}
//                 onPress={() => setFormData({ ...formData, role: 'patient' })}>
//                 <Text
//                   style={[
//                     styles.roleButtonText,
//                     formData.role === 'patient' && styles.activeRoleButtonText,
//                   ]}>
//                   Patient
//                 </Text>
//               </TouchableOpacity>
//               <TouchableOpacity
//                 style={[
//                   styles.roleButton,
//                   formData.role === 'doctor' && styles.activeRoleButton,
//                 ]}
//                 onPress={() => setFormData({ ...formData, role: 'doctor' })}>
//                 <Text
//                   style={[
//                     styles.roleButtonText,
//                     formData.role === 'doctor' && styles.activeRoleButtonText,
//                   ]}>
//                   Doctor
//                 </Text>
//               </TouchableOpacity>
//             </View>
//           </View>
//         </>
//       )}

//       {loading ? (
//         <ActivityIndicator size="large" color="#007AFF" />
//       ) : (
//         <TouchableOpacity
//           style={styles.button}
//           onPress={mode === 'login' ? handleLogin : handleRegister}>
//           <Text style={styles.buttonText}>
//             {mode === 'login' ? 'Login' : 'Register'}
//           </Text>
//         </TouchableOpacity>
//       )}

//       <TouchableOpacity
//         style={styles.switchButton}
//         onPress={() => {
//           setMode(mode === 'login' ? 'register' : 'login');
//           setFormData({
//             name: '',
//             email: '',
//             password: '',
//             confirmPassword: '',
//             role: 'patient',
//           });
//         }}>
//         <Text style={styles.switchButtonText}>
//           {mode === 'login'
//             ? "Don't have an account? Register"
//             : 'Already have an account? Login'}
//         </Text>
//       </TouchableOpacity>

//       <TouchableOpacity
//         style={styles.backButton}
//         onPress={() => setMode('welcome')}>
//         <Text style={styles.backButtonText}>Back to Welcome</Text>
//       </TouchableOpacity>
//     </ScrollView>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     padding: 20,
//     justifyContent: 'center',
//     backgroundColor: '#fff',
//   },
//   title: {
//     fontSize: 24,
//     fontWeight: 'bold',
//     textAlign: 'center',
//     marginBottom: 30,
//     color: '#333',
//   },
//   input: {
//     backgroundColor: '#f5f5f5',
//     padding: 15,
//     borderRadius: 10,
//     marginBottom: 15,
//     fontSize: 16,
//   },
//   buttonContainer: {
//     width: '100%',
//   },
//   button: {
//     backgroundColor: '#007AFF',
//     padding: 15,
//     borderRadius: 10,
//     alignItems: 'center',
//     marginBottom: 15,
//   },
//   registerButton: {
//     backgroundColor: '#34C759',
//   },
//   buttonText: {
//     color: '#fff',
//     fontSize: 16,
//     fontWeight: '600',
//   },
//   switchButton: {
//     marginTop: 15,
//   },
//   switchButtonText: {
//     color: '#007AFF',
//     textAlign: 'center',
//     fontSize: 16,
//   },
//   backButton: {
//     marginTop: 15,
//   },
//   backButtonText: {
//     color: '#666',
//     textAlign: 'center',
//     fontSize: 16,
//   },
//   roleSelector: {
//     marginBottom: 15,
//   },
//   roleLabel: {
//     fontSize: 16,
//     color: '#333',
//     marginBottom: 10,
//   },
//   roleButtons: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//   },
//   roleButton: {
//     flex: 1,
//     padding: 15,
//     backgroundColor: '#f5f5f5',
//     borderRadius: 10,
//     marginHorizontal: 5,
//     alignItems: 'center',
//   },
//   activeRoleButton: {
//     backgroundColor: '#007AFF',
//   },
//   roleButtonText: {
//     fontSize: 16,
//     color: '#333',
//   },
//   activeRoleButtonText: {
//     color: '#fff',
//   },
// });

// export default WelcomeScreen;