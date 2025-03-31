import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, Dimensions } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedReaction,
  runOnJS,
  FadeIn,
  FadeOut,
  FadeInUp,
} from 'react-native-reanimated';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Marquee } from '@animatereactnative/marquee';
import { Stagger } from '@animatereactnative/stagger';
import { Easing } from 'react-native-reanimated';

// Mock data for images
const images = [
  'https://images.unsplash.com/photo-1542291026-7eec264c27ff?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2370&q=80',
  'https://images.unsplash.com/photo-1546868871-7041f2a55e12?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1064&q=80',
  'https://images.unsplash.com/photo-1583394838336-acd977736f90?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=768&q=80',
  'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1169&q=80',
  'https://images.unsplash.com/photo-1555487505-8603a1a69755?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1064&q=80',
  'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1087&q=80',
  'https://images.unsplash.com/photo-1530893609608-32a9af3aa95c?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1064&q=80',
];

const { width } = Dimensions.get('window');
const spacing = 16;
const itemWidth = width * 0.62; // 62% of screen width
const itemHeight = itemWidth * 1.67;
const itemSize = itemWidth + spacing;

const AppleInvites = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const offset = useSharedValue(0);

  // Calculate active index based on Marquee position
  useAnimatedReaction(
    () => {
      return (offset.value + width / 2) / itemSize % images.length;
    },
    (value) => {
      const floatIndex = value;
      const index = Math.abs(Math.floor(floatIndex));
      runOnJS(setActiveIndex)(index);
    }
  );

  // Item component for Marquee
  const Item = ({ image, index, offset }: { image: string; index: number; offset: any }) => {
    // Calculate position and rotation based on offset
    const itemPosition = index * itemSize;
    const totalSize = images.length * itemSize;
    
    // Calculate range for interpolation
    const range = ((itemPosition - offset.value) % totalSize + totalSize * 1000) + (width + itemSize) / 2;
    
    return (
      <Animated.View
        style={[
          styles.itemContainer,
          {
            transform: [
              {
                rotateY: `${
                  range < -itemSize
                    ? -3
                    : range > width
                    ? 3
                    : range > (width - itemSize) / 2
                    ? 0
                    : -3
                }deg`,
              },
            ],
          },
        ]}
      >
        <Image
          source={{ uri: image }}
          style={styles.itemImage}
        />
      </Animated.View>
    );
  };

  return (
    <GestureHandlerRootView style={styles.container}>
      {/* Background Image with Blur */}
      <View style={styles.backgroundContainer}>
        <Animated.Image
          key={`bg-image-${activeIndex}`}
          source={{ uri: images[activeIndex] }}
          style={styles.backgroundImage}
          blurRadius={50}
          entering={FadeIn.duration(1000)}
          exiting={FadeOut.duration(1000)}
        />
      </View>

      {/* Marquee Carousel */}
      <Marquee
        position={offset}
        spacing={spacing}
      >
        <Animated.View 
          style={styles.carouselContainer}
          entering={FadeInUp.duration(1000).delay(500).springify().damping(80).stiffness(200).withInitialValues({
            transform: [{ translateY: -itemHeight / 2 }]
          })}
        >
          {images.map((image, index) => (
            <Item 
              key={`${image}-${index}`} 
              image={image} 
              index={index} 
              offset={offset} 
            />
          ))}
        </Animated.View>
      </Marquee>

      {/* Footer with Staggered Animation */}
      <Stagger 
        style={styles.footer} 
        stagger={100} 
        duration={500} 
        initialDelay={1000}
      >
        <Text style={styles.footerText}>Welcome to</Text>
        <Text style={styles.footerTitle}>Apple Invites Animation</Text>
        <Text style={styles.footerDescription}>Swipe through the cards to see the animation effect</Text>
      </Stagger>
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  backgroundContainer: {
    ...StyleSheet.absoluteFillObject,
    opacity: 0.5,
  },
  backgroundImage: {
    flex: 1,
  },
  carouselContainer: {
    flexDirection: 'row',
    gap: spacing,
  },
  itemContainer: {
    width: itemWidth,
    height: itemHeight,
    borderRadius: 16,
  },
  itemImage: {
    flex: 1,
    borderRadius: 16,
  },
  footer: {
    flex: 0.5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  footerText: {
    color: '#fff',
    fontSize: 16,
    marginBottom: 8,
  },
  footerTitle: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  footerDescription: {
    color: '#fff',
    fontSize: 14,
    textAlign: 'center',
    paddingHorizontal: 32,
  },
});

export default AppleInvites;