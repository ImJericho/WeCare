// Frontend/src/components/SuggestedQueries.tsx
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';

interface SuggestedQueriesProps {
  onSelectQuery: (query: string) => void;
}

const SuggestedQueries: React.FC<SuggestedQueriesProps> = ({ onSelectQuery }) => {
  const suggestions = [
    "What's my current temperature?",
    "Show me my blood pressure history",
    "Who is my doctor?",
    "What are my vital signs?",
    "Show my patient details",
  ];

  return (
    <ScrollView 
      horizontal 
      showsHorizontalScrollIndicator={false}
      style={styles.container}
    >
      {suggestions.map((query, index) => (
        <TouchableOpacity
          key={index}
          style={styles.suggestionButton}
          onPress={() => onSelectQuery(query)}
        >
          <Text style={styles.suggestionText}>{query}</Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 8,
  },
  suggestionButton: {
    backgroundColor: '#E8E8E8',
    padding: 8,
    borderRadius: 16,
    marginRight: 8,
  },
  suggestionText: {
    color: '#007AFF',
    fontSize: 14,
  },
});

export default SuggestedQueries;