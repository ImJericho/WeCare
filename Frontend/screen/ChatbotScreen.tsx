import React, { useState, useRef, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { chatbotAPI } from '../src/services/api';
import { useAuth } from '../context/AuthContext';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

const ChatbotScreen = () => {
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollViewRef = useRef<ScrollView>(null);

  React.useEffect(() => {
    addMessage(
      "Hello! I'm your medical assistant. I can help you with information about vital signs, patient details, and more. How can I help you today?",
      'bot'
    );
  }, []);
  
  const generateMessageId = () => Math.random().toString(36).substring(7);

  const addMessage = (text: string, sender: 'user' | 'bot') => {
    const newMessage: Message = {
      id: generateMessageId(),
      text,
      sender,
      timestamp: new Date(),
    };
    setMessages(prevMessages => [...prevMessages, newMessage]);
  };

  const sendMessage = async () => {
    if (!inputText.trim()) return;
  
    const userMessage = inputText.trim();
    setInputText('');
    addMessage(userMessage, 'user');
  
    try {
      setIsLoading(true);
      const response = await chatbotAPI.sendMessage({
        query: userMessage,
        patient_id: 20001, // Use the correct patient ID
        session_id: 1,
      });
  
      addMessage(response.reply, 'bot');
    } catch (error: any) {
      console.error('Chatbot error:', error);
      
      let errorMessage = 'I apologize, but I encountered an error. Please try again.';
      
      if (error.details) {
        errorMessage += '\n\nError details: ' + error.details;
      }
  
      addMessage(errorMessage, 'bot');
      
      Alert.alert(
        'Error',
        'Failed to process your message. Please try again.',
        [{ text: 'OK' }]
      );
    } finally {
      setIsLoading(false);
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <View style={styles.header}>
        <Text style={styles.headerTitle}>AI Assistant</Text>
        {isLoading && (
          <ActivityIndicator 
            size="small" 
            color="#007AFF" 
            style={styles.loadingIndicator} 
          />
        )}
      </View>

      <ScrollView
        ref={scrollViewRef}
        style={styles.messagesContainer}
        contentContainerStyle={styles.messagesContent}
        onContentSizeChange={() => scrollViewRef.current?.scrollToEnd({ animated: true })}
      >
        {messages.map((message) => (
          <View
            key={message.id}
            style={[
              styles.messageWrapper,
              message.sender === 'user' ? styles.userMessageWrapper : styles.botMessageWrapper,
            ]}
          >
            <View
              style={[
                styles.message,
                message.sender === 'user' ? styles.userMessage : styles.botMessage,
              ]}
            >
              <Text style={[
                styles.messageText,
                message.sender === 'user' ? styles.userMessageText : styles.botMessageText,
              ]}>
                {message.text}
              </Text>
              <Text style={[
                styles.timestamp,
                message.sender === 'user' ? styles.userTimestamp : styles.botTimestamp,
              ]}>
                {formatTime(message.timestamp)}
              </Text>
            </View>
          </View>
        ))}
      </ScrollView>

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={inputText}
          onChangeText={setInputText}
          placeholder="Type your message..."
          placeholderTextColor="#666"
          multiline
          maxLength={500}
          onSubmitEditing={sendMessage}
          editable={!isLoading}
        />
        <TouchableOpacity
          style={[styles.sendButton, !inputText.trim() && styles.sendButtonDisabled]}
          onPress={sendMessage}
          disabled={!inputText.trim() || isLoading}
        >
          <Text style={styles.sendButtonText}>Send</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  loadingIndicator: {
    marginLeft: 10,
  },
  messagesContainer: {
    flex: 1,
  },
  messagesContent: {
    padding: 16,
  },
  messageWrapper: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  userMessageWrapper: {
    justifyContent: 'flex-end',
  },
  botMessageWrapper: {
    justifyContent: 'flex-start',
  },
  message: {
    maxWidth: '80%',
    padding: 12,
    borderRadius: 16,
  },
  userMessage: {
    backgroundColor: '#007AFF',
    borderBottomRightRadius: 4,
  },
  botMessage: {
    backgroundColor: '#E8E8E8',
    borderBottomLeftRadius: 4,
  },
  messageText: {
    fontSize: 16,
    lineHeight: 20,
  },
  userMessageText: {
    color: '#fff',
  },
  botMessageText: {
    color: '#333',
  },
  timestamp: {
    fontSize: 12,
    marginTop: 4,
  },
  userTimestamp: {
    color: 'rgba(255, 255, 255, 0.7)',
    textAlign: 'right',
  },
  botTimestamp: {
    color: '#666',
  },
  inputContainer: {
    flexDirection: 'row',
    padding: 16,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  input: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 8,
    fontSize: 16,
    maxHeight: 100,
    color: '#333',
  },
  sendButton: {
    backgroundColor: '#007AFF',
    borderRadius: 20,
    paddingHorizontal: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendButtonDisabled: {
    backgroundColor: '#ccc',
  },
  sendButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default ChatbotScreen;

// import React, { useState, useRef } from 'react';
// import {
//   View,
//   Text,
//   StyleSheet,
//   TextInput,
//   TouchableOpacity,
//   ScrollView,
//   KeyboardAvoidingView,
//   Platform,
// } from 'react-native';

// const ChatbotScreen = () => {
//   const [messages, setMessages] = useState([]);
//   const [inputText, setInputText] = useState('');
//   const scrollViewRef = useRef();

//   const sendMessage = async () => {
//     if (!inputText.trim()) return;

//     const userMessage = {
//       text: inputText,
//       sender: 'user',
//       timestamp: new Date(),
//     };

//     setMessages([...messages, userMessage]);
//     setInputText('');

//     // Replace with actual API call
//     setTimeout(() => {
//       const botMessage = {
//         text: `I received your message: "${inputText}"`,
//         sender: 'bot',
//         timestamp: new Date(),
//       };
//       setMessages(prev => [...prev, botMessage]);
//     }, 1000);
//   };

//   return (
//     <KeyboardAvoidingView
//       behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
//       style={styles.container}>
//       <ScrollView
//         ref={scrollViewRef}
//         style={styles.messagesContainer}
//         onContentSizeChange={() => scrollViewRef.current.scrollToEnd()}>
//         {messages.map((message, index) => (
//           <View
//             key={index}
//             style={[
//               styles.message,
//               message.sender === 'user'
//                 ? styles.userMessage
//                 : styles.botMessage,
//             ]}>
//             <Text style={styles.messageText}>{message.text}</Text>
//             <Text style={styles.timestamp}>
//               {message.timestamp.toLocaleTimeString()}
//             </Text>
//           </View>
//         ))}
//       </ScrollView>

//       <View style={styles.inputContainer}>
//         <TextInput
//           style={styles.input}
//           value={inputText}
//           onChangeText={setInputText}
//           placeholder="Type your message..."
//           onSubmitEditing={sendMessage}
//         />
//         <TouchableOpacity style={styles.sendButton} onPress={sendMessage}>
//           <Text style={styles.sendButtonText}>Send</Text>
//         </TouchableOpacity>
//       </View>
//     </KeyboardAvoidingView>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#f5f5f5',
//   },
//   messagesContainer: {
//     flex: 1,
//     padding: 10,
//   },
//   message: {
//     maxWidth: '80%',
//     padding: 10,
//     marginVertical: 5,
//     borderRadius: 10,
//   },
//   userMessage: {
//     alignSelf: 'flex-end',
//     backgroundColor: '#007AFF',
//   },
//   botMessage: {
//     alignSelf: 'flex-start',
//     backgroundColor: '#E5E5EA',
//   },
//   messageText: {
//     color: '#fff',
//     fontSize: 16,
//   },
//   timestamp: {
//     fontSize: 12,
//     color: 'rgba(255, 255, 255, 0.7)',
//     marginTop: 5,
//   },
//   inputContainer: {
//     flexDirection: 'row',
//     padding: 10,
//     backgroundColor: '#fff',
//     borderTopWidth: 1,
//     borderTopColor: '#e5e5e5',
//   },
//   input: {
//     flex: 1,
//     backgroundColor: '#f0f0f0',
//     borderRadius: 20,
//     paddingHorizontal: 15,
//     paddingVertical: 10,
//     marginRight: 10,
//   },
//   sendButton: {
//     backgroundColor: '#007AFF',
//     borderRadius: 20,
//     paddingHorizontal: 20,
//     justifyContent: 'center',
//   },
//   sendButtonText: {
//     color: '#fff',
//     fontSize: 16,
//     fontWeight: '600',
//   },
// });

// export default ChatbotScreen;