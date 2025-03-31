// components/TikTokMessages.tsx
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, FlatList } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  useDerivedValue,
  withSpring,
  interpolate,
  FadeInDown,
  LinearTransition,
} from 'react-native-reanimated';

// Custom AnimatedFlatList with layout animations
const AnimatedFlatList = Animated.createAnimatedComponent(FlatList);

// Maximum number of messages to display opacity for
const MAX_MESSAGES = 6;

// Different chat speeds
export enum ChatSpeed {
  SLOW = 'slow',
  MEDIUM = 'medium',
  FAST = 'fast',
  INSANE = 'insane',
}

// Speed settings in milliseconds
const CHAT_SPEED_RANGES = {
  [ChatSpeed.SLOW]: { min: 2000, max: 3000 },
  [ChatSpeed.MEDIUM]: { min: 1000, max: 1500 },
  [ChatSpeed.FAST]: { min: 300, max: 700 },
  [ChatSpeed.INSANE]: { min: 50, max: 100 },
};

// Message item type
export interface ChatItem {
  key: string;
  content: string;
  description?: string;
  user: {
    name: string;
    avatar: string;
  };
}

// Props for our TikTok messages component
interface TikTokMessagesProps<T> extends Omit<React.ComponentProps<typeof AnimatedFlatList>, 'renderItem'> {
  renderItem: (info: { item: T; index: number }) => React.ReactElement;
  chatSpeed?: ChatSpeed;
}

// Random ID generator
const generateId = () => Math.random().toString(36).substring(2, 10);

// Animated item that wraps each message
const AnimatedItem = ({ index, children }: { index: number; children: React.ReactNode }) => {
  // Animate the index changes with spring physics
  const newIndex = useDerivedValue(() => {
    return withSpring(index, {
      damping: 80,
      stiffness: 200,
    });
  }, [index]);

  // Create opacity animation based on index
  const styles = useAnimatedStyle(() => {
    const opacity = interpolate(
      newIndex.value,
      [0, 1],
      [1, 1 - 1 / MAX_MESSAGES]
    );

    return { opacity: opacity > 0 ? opacity : 0 };
  });

  return (
    <Animated.View 
      style={styles}
      entering={FadeInDown
        .springify()
        .damping(80)
        .stiffness(200)
        .withInitialValues({ opacity: 0, transform: [{ translateY: 100 }] })
      }
    >
      {children}
    </Animated.View>
  );
};

// Our main TikTok Messages component
export default function TikTokMessages<T extends ChatItem>({ 
  renderItem, 
  data, 
  chatSpeed = ChatSpeed.MEDIUM,
  ...rest 
}: TikTokMessagesProps<T>) {
  // Custom render item that wraps with animation
  const animatedRenderItem = ({ item, index }: { item: T; index: number }) => {
    return (
      <AnimatedItem index={index}>
        {renderItem({ item, index })}
      </AnimatedItem>
    );
  };

  return (
    <AnimatedFlatList
      data={data}
      renderItem={animatedRenderItem}
      inverted={true}
      itemLayoutAnimation={LinearTransition.springify().damping(80).stiffness(200)}
      {...rest}
    />
  );
}

// Default message item renderer
export const MessageItem = ({ item }: { item: ChatItem }) => {
  return (
    <View style={styles.messageContainer}>
      <Image source={{ uri: item.user.avatar }} style={styles.avatar} />
      <View style={styles.messageContent}>
        <Text style={styles.username}>{item.user.name}</Text>
        <Text style={styles.messageText}>{item.content}</Text>
        {item.description && (
          <Text style={styles.description}>{item.description}</Text>
        )}
      </View>
    </View>
  );
};

// Generate a random message
export const generateNewMessage = (): ChatItem => {
  const avatars = [
    'https://randomuser.me/api/portraits/women/1.jpg',
    'https://randomuser.me/api/portraits/men/1.jpg',
    'https://randomuser.me/api/portraits/women/2.jpg',
    'https://randomuser.me/api/portraits/men/2.jpg',
    'https://randomuser.me/api/portraits/women/3.jpg',
    'https://randomuser.me/api/portraits/men/3.jpg',
  ];

  const names = [
    'Emma Watson',
    'Chris Evans',
    'Scarlett Johansson',
    'Robert Downey Jr.',
    'Jennifer Lawrence',
    'Chris Hemsworth',
  ];

  const messages = [
    'Hey there! How are you doing today?',
    'Just watched an amazing movie last night!',
    'Have you seen the new React Native updates?',
    'I love the animations in this app!',
    'Good morning from the other side of the world!',
    'Anyone else excited about the new iPhone?',
    'Just learned about Reanimated 3, it\'s amazing!',
    'Weekend plans?',
    'This chat animation is so smooth!',
    'Anyone know how to fix this React error I\'m getting?',
  ];

  const randomAvatar = avatars[Math.floor(Math.random() * avatars.length)];
  const randomName = names[Math.floor(Math.random() * names.length)];
  const randomMessage = messages[Math.floor(Math.random() * messages.length)];

  return {
    key: generateId(),
    content: randomMessage,
    user: {
      name: randomName,
      avatar: randomAvatar,
    },
  };
};

const styles = StyleSheet.create({
  messageContainer: {
    flexDirection: 'row',
    padding: 12,
    marginVertical: 4,
    marginHorizontal: 16,
    backgroundColor: '#1e1e1e',
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  messageContent: {
    flex: 1,
  },
  username: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 4,
  },
  messageText: {
    fontSize: 16,
    color: '#fff',
    lineHeight: 22,
  },
  description: {
    fontSize: 12,
    color: '#aaa',
    marginTop: 4,
  },
});