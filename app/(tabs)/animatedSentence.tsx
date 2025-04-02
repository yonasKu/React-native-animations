import React, { useEffect, useState, useCallback } from 'react';
import { StyleSheet, View, Text, SafeAreaView, StatusBar, TouchableOpacity } from 'react-native';
import { Stack } from 'expo-router';
import { MotiView } from 'moti';
import { AnimatedSentence } from '../../components/AnimatedSentence';

// Example sentences split into lines
const sentenceSets = [
  [
    "This animated sentence component",
    "brings words to life with",
    "smooth staggered animations.",
  ],
  [
    "Each line enters and exits",
    "with beautiful transitions,", 
    "powered by Reanimated.",
  ],
  [
    "You can customize styles,",
    "timing, and animations",
    "for each set of lines.",
  ],
  [
    "The background color",
    "transitions smoothly",
    "using Moti animations.",
  ],
  [
    "Perfect for step-by-step instructions,",
    "onboarding flows,",
    "or dramatic text reveals.",
  ],
  [
    "This animated sentence component brings words to life.",
    "Each word enters and exits with smooth staggered animations.",
    "Powered by React Native Reanimated layout animations.",
    "You can set different styles for each sentence.",
    "The background color transitions smoothly using Moti.",
    "Timing is based on average reading speed for optimal readability.",
  ],
];

const backgroundColors = [
  '#4A1FB0', // Purple
  '#1E2A78', // Dark Blue
  '#0D0D30', // Navy
  '#1A5568', // Teal
  '#772B9D', // Violet
  '#40128B', // Indigo
];

export default function AnimatedSentenceScreen() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [key, setKey] = useState(0); // Used to force remount of AnimatedSentence component
  const [isAnimating, setIsAnimating] = useState(true);
  
  const handleNextSentence = useCallback(() => {
    setIsAnimating(true);
    setCurrentIndex((prev) => (prev + 1) % sentenceSets.length);
    setKey((prev) => prev + 1);
  }, []);
  
  // Auto cycle through sentences after a delay
  useEffect(() => {
    if (!isAnimating) {
      const timer = setTimeout(handleNextSentence, 3000); // Fixed delay for each set
      return () => clearTimeout(timer);
    }
  }, [currentIndex, isAnimating, handleNextSentence]);
  
  const handleEnterFinish = () => {
    setIsAnimating(false);
  };
  
  const handleManualNext = () => {
    if (!isAnimating) {
      handleNextSentence();
    }
  };
  
  const getCurrentStyle = () => {
    // Different styles for each sentence to showcase flexibility
    const baseStyle = { fontSize: 26, fontWeight: 'bold' as const };
    
    // Mix up styles based on index
    switch (currentIndex % 3) {
      case 0:
        return { ...baseStyle, color: '#FFFFFF' };
      case 1:
        return { ...baseStyle, color: '#FFD700', textShadowColor: 'rgba(0,0,0,0.5)', textShadowOffset: { width: 1, height: 1 }, textShadowRadius: 2 };
      case 2:
        return { ...baseStyle, color: '#7DF9FF', letterSpacing: 1 };
      default:
        return baseStyle;
    }
  };
  
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />
      <Stack.Screen options={{ title: 'Animated Sentence', headerBackTitle: 'Back' }} />
      
      <MotiView
        from={{ backgroundColor: backgroundColors[(currentIndex - 1 + backgroundColors.length) % backgroundColors.length] }}
        animate={{ backgroundColor: backgroundColors[currentIndex % backgroundColors.length] }}
        transition={{ type: 'timing', duration: 1000 }}
        style={styles.contentContainer}
      >
        <View style={styles.sentenceContainer}>
          <AnimatedSentence
            key={key}
            lines={sentenceSets[currentIndex]} // Pass the current set of lines
            style={getCurrentStyle()}
            enterDuration={500}
            exitDuration={300}
            staggerDelay={400} // Longer delay between lines
            onEnterFinish={handleEnterFinish}
            autoExit={false}
          />
        </View>
        
        <TouchableOpacity 
          style={styles.nextButton} 
          onPress={handleManualNext}
          disabled={isAnimating}
        >
          <Text style={[styles.nextButtonText, isAnimating && styles.disabledText]}>
            {isAnimating ? 'Loading...' : 'Next Example'}
          </Text>
        </TouchableOpacity>
        
        <Text style={styles.infoText}>
          Example {currentIndex + 1} of {sentenceSets.length}
        </Text>
        
      </MotiView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  contentContainer: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sentenceContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  nextButton: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 25,
    marginBottom: 20,
  },
  nextButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  disabledText: {
    opacity: 0.5,
  },
  infoText: {
    color: 'rgba(255, 255, 255, 0.7)',
    marginBottom: 30,
  },
  descriptionContainer: {
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    padding: 20,
    borderRadius: 10,
    width: '100%',
    marginBottom: 20,
  },
  descriptionTitle: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  descriptionText: {
    color: 'rgba(255, 255, 255, 0.8)',
    marginBottom: 8,
  },
});