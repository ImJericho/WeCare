import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  Platform,
  StatusBar,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useAuth } from '../context/AuthContext';

interface NavbarProps {
  tabs: Array<{
    id: string;
    label: string;
  }>;
  activeTab: string;
  onTabChange: (tabId: string) => void;
}

const Navbar: React.FC<NavbarProps> = ({ tabs, activeTab, onTabChange }) => {
  const { user, logout } = useAuth();

  const getTabIcon = (tabId: string) => {
    switch (tabId) {
      case 'vitals':
        return 'heart-pulse';
      case 'patient':
        return 'account';
      case 'doctor':
        return 'doctor';
      case 'chat':
        return 'chat-processing';
      case 'users':
        return 'account-group';
      default:
        return 'apps';
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.titleContainer}>
            <Text style={styles.titleWe}>We</Text>
            <Text style={styles.titleCare}>Care</Text>
          </View>
          {/* <Text style={styles.headerTitle}>Neonatal Monitoring</Text> */}
          <View style={styles.userInfo}>
            <TouchableOpacity style={styles.userButton}>
              <Icon name="account-circle" size={24} color="#666" />
              <Text style={styles.userName}>{user?.name}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.logoutButton} onPress={logout}>
              <Icon name="logout" size={24} color="#FF3B30" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Navigation Tabs */}
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          style={styles.tabsContainer}
          contentContainerStyle={styles.tabsContent}
        >
          {tabs.map((tab) => (
            <TouchableOpacity
              key={tab.id}
              style={[
                styles.tab,
                activeTab === tab.id && styles.activeTab,
              ]}
              onPress={() => onTabChange(tab.id)}
            >
              <Icon
                name={getTabIcon(tab.id)}
                size={24}
                color={activeTab === tab.id ? '#007AFF' : '#666'}
              />
              <Text
                style={[
                  styles.tabText,
                  activeTab === tab.id && styles.activeTabText,
                ]}
              >
                {tab.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Role Badge */}
        <View style={styles.roleBadgeContainer}>
          <View style={[
            styles.roleBadge,
            user?.role === 'admin' && styles.adminBadge,
            user?.role === 'doctor' && styles.doctorBadge,
            user?.role === 'patient' && styles.patientBadge,
          ]}>
            <Text style={styles.roleBadgeText}>
              {user?.role.charAt(0).toUpperCase() + user?.role.slice(1)}
            </Text>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: '#fff',
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  container: {
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 3,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom:10,
  },
  titleWe: {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#34C759',
  },
  titleCare: {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#007AFF',
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  userButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
  },
  userName: {
    marginLeft: 8,
    fontSize: 16,
    color: '#666',
  },
  logoutButton: {
    padding: 4,
  },
  tabsContainer: {
    flexDirection: 'row',
  },
  tabsContent: {
    paddingHorizontal: 8,
  },
  tab: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    marginHorizontal: 4,
    borderRadius: 8,
    backgroundColor: '#f5f5f5',
  },
  activeTab: {
    backgroundColor: '#E1F0FF',
  },
  tabText: {
    marginLeft: 8,
    fontSize: 16,
    color: '#666',
  },
  activeTabText: {
    color: '#007AFF',
    fontWeight: '600',
  },
  roleBadgeContainer: {
    position: 'absolute',
    top: 16,
    right: 16,
  },
  roleBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    backgroundColor: '#E1E1E1',
  },
  adminBadge: {
    backgroundColor: '#FF9500',
  },
  doctorBadge: {
    backgroundColor: '#34C759',
  },
  patientBadge: {
    backgroundColor: '#5856D6',
  },
  roleBadgeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
});

export default Navbar;