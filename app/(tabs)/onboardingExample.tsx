import React, { useState } from 'react';
import { View, Text, StyleSheet, Dimensions, Image, SafeAreaView } from 'react-native';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';
import Onboarding from '../../components/Onboarding';

const { width, height } = Dimensions.get('window');

// Example onboarding slides data
const slides = [
  {
    id: 1,
    title: 'Welcome',
    description: 'Discover amazing animations with React Native Reanimated',
    image: 'https://images.unsplash.com/photo-1556740758-90de374c12ad?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1000&q=80',
    color: '#5856D6',
  },
  {
    id: 2,
    title: 'Beautiful UI',
    description: 'Create stunning user interfaces with smooth animations',
    image: 'https://images.unsplash.com/photo-1540162875225-3f6b56d69e5f?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1000&q=80',
    color: '#34C759', // Green color matching the pagination indicator
  },
  {
    id: 3,
    title: 'Layout Animations',
    description: 'Learn to use entering, exiting, and layout animations',
    image: 'https://images.unsplash.com/photo-1590755465939-ceb583049737?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1000&q=80',
    color: '#FF9500',
  },
  {
    id: 4,
    title: 'Get Started',
    description: 'Ready to create your own amazing animations?',
    image: 'https://images.unsplash.com/photo-1600267204091-5c1ab8b10c02?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1000&q=80',
    color: '#FF2D55',
  },
];

export default function OnboardingExample() {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const currentSlide = slides[selectedIndex];

  return (
    <SafeAreaView style={styles.container}>
      {/* Background with blur effect */}
      <View style={styles.backgroundContainer}>
        <Animated.Image
          key={`bg-image-${selectedIndex}`}
          source={{ uri: currentSlide.image }}
          style={[styles.backgroundImage, { backgroundColor: currentSlide.color }]}
          blurRadius={25}
          entering={FadeIn.duration(800)}
          exiting={FadeOut.duration(800)}
        />
        <View style={[styles.backgroundOverlay, { backgroundColor: currentSlide.color, opacity: 0.2 }]} />
      </View>

      {/* Content */}
      <View style={styles.contentContainer}>
        {/* Slide number for reference */}
        <Text style={styles.slideNumber}>Slide {selectedIndex + 1} of {slides.length}</Text>
        
        {/* Main image */}
        <Animated.Image
          key={`image-${selectedIndex}`}
          source={{ uri: currentSlide.image }}
          style={styles.image}
          entering={FadeIn.duration(1000).delay(200)}
          exiting={FadeOut.duration(500)}
        />

        {/* Text content */}
        <View style={styles.textContainer}>
          <Animated.Text
            key={`title-${selectedIndex}`}
            style={styles.title}
            entering={FadeIn.duration(800).delay(300)}
            exiting={FadeOut.duration(500)}
          >
            {currentSlide.title}
          </Animated.Text>
          
          <Animated.Text
            key={`description-${selectedIndex}`}
            style={styles.description}
            entering={FadeIn.duration(800).delay(400)}
            exiting={FadeOut.duration(500)}
          >
            {currentSlide.description}
          </Animated.Text>
        </View>

        {/* Pagination and navigation */}
        <View style={styles.navigationContainer}>
          <Onboarding
            total={slides.length}
            selectedIndex={selectedIndex}
            onIndexChange={setSelectedIndex}
          />
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  backgroundContainer: {
    ...StyleSheet.absoluteFillObject,
  },
  backgroundImage: {
    flex: 1,
  },
  backgroundOverlay: {
    ...StyleSheet.absoluteFillObject,
    opacity: 0.2,
  },
  contentContainer: {
    flex: 1,
    justifyContent: 'space-between',
    paddingVertical: 40,
  },
  slideNumber: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
    marginTop: 20,
    opacity: 0.8,
  },
  image: {
    width: width * 0.8,
    height: width * 0.8,
    alignSelf: 'center',
    borderRadius: 20,
    marginTop: 20,
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  textContainer: {
    alignItems: 'center',
    padding: 20,
    marginTop: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFF',
    marginBottom: 10,
    textAlign: 'center',
  },
  description: {
    fontSize: 16,
    color: '#EEE',
    textAlign: 'center',
    lineHeight: 24,
  },
  navigationContainer: {
    paddingHorizontal: 20,
    marginTop: 40,
  },
});
