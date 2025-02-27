import React from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';

const ChatLoading = () => (
  <View style={styles.loadingContainer}>
    <View style={styles.loadingBubble}>
      <ActivityIndicator color="#007AFF" size="small" />
    </View>
  </View>
);

const styles = StyleSheet.create({
  loadingContainer: {
    padding: 8,
    alignItems: 'flex-start',
  },
  loadingBubble: {
    backgroundColor: '#E8E8E8',
    padding: 12,
    borderRadius: 16,
    borderBottomLeftRadius: 4,
  },
});

export default ChatLoading;