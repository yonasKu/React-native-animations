import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity } from 'react-native';
import TikTokMessages, { 
  ChatItem, 
  MessageItem, 
  generateNewMessage, 
  ChatSpeed 
} from '../../components/TikTokMessages';

export default function MessageAnimation() {
  const [messages, setMessages] = useState<ChatItem[]>([]);
  const [speed, setSpeed] = useState<ChatSpeed>(ChatSpeed.MEDIUM);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Initialize with some messages
  useEffect(() => {
    const initialMessages = Array(10).fill(0).map(() => generateNewMessage());
    setMessages(initialMessages);
  }, []);

  // Handle chat speed changes
  useEffect(() => {
    generateData();
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [speed]);

  // Generate new messages based on the selected speed
  const generateData = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    const speedRange = {
      [ChatSpeed.SLOW]: { min: 2000, max: 3000 },
      [ChatSpeed.MEDIUM]: { min: 1000, max: 1500 },
      [ChatSpeed.FAST]: { min: 300, max: 700 },
      [ChatSpeed.INSANE]: { min: 50, max: 100 },
    };

    const selectedSpeed = speedRange[speed];
    const randomTime = Math.floor(Math.random() * (selectedSpeed.max - selectedSpeed.min + 1)) + selectedSpeed.min;

    timeoutRef.current = setTimeout(() => {
      const newMessage = generateNewMessage();
      setMessages(prevMessages => [newMessage, ...prevMessages.slice(0, 19)]);
      generateData(); // Schedule the next message
    }, randomTime);
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>TikTok Live Messages</Text>
      
      <View style={styles.speedControl}>
        <Text style={styles.label}>Message Speed:</Text>
        <View style={styles.segmentedControl}>
          {Object.values(ChatSpeed).map((value) => (
            <TouchableOpacity
              key={value}
              style={[
                styles.speedButton,
                speed === value && styles.speedButtonActive
              ]}
              onPress={() => setSpeed(value)}
            >
              <Text style={[
                styles.speedButtonText,
                speed === value && styles.speedButtonTextActive
              ]}>
                {value}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
      
      <TikTokMessages
        data={messages}
        renderItem={MessageItem}
        keyExtractor={(item) => item.key}
        contentContainerStyle={styles.messagesList}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    paddingVertical: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 16,
  },
  speedControl: {
    marginBottom: 16,
    paddingHorizontal: 16,
  },
  label: {
    fontSize: 16,
    color: '#fff',
    marginBottom: 8,
  },
  segmentedControl: {
    flexDirection: 'row',
    backgroundColor: '#222',
    borderRadius: 8,
    marginBottom: 16,
    overflow: 'hidden',
  },
  speedButton: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  speedButtonActive: {
    backgroundColor: '#555',
  },
  speedButtonText: {
    color: '#aaa',
    fontSize: 14,
    fontWeight: '500',
    textTransform: 'capitalize',
  },
  speedButtonTextActive: {
    color: '#fff',
  },
  messagesList: {
    paddingBottom: 16,
  },
});