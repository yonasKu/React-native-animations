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

// const { width } = Dimensions.get('window');

const { width, height } = Dimensions.get('window');

const spacing = 16;
const itemWidth = width * 0.62; // 62% of screen width
const itemHeight = itemWidth * 1.67;
const itemSize = itemWidth + spacing;

export default function AppleInvitesScreen() {
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
}

const styles = StyleSheet.create({
  container: {
    padding:4,
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
    marginTop:height*0.06,
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



// import React, { useRef, useState, useCallback, useEffect } from 'react';
// import { View, Text, StyleSheet, Image, Dimensions, ScrollView, FlatList } from 'react-native';
// import Animated, {
//   useSharedValue,
//   useAnimatedScrollHandler,
//   useAnimatedStyle,
//   withTiming,
//   withDelay,
//   withSpring,
//   interpolate,
//   Extrapolate,
//   runOnJS,
//   Easing,
//   FadeIn,
//   FadeOut,
//   FadeInUp,
// } from 'react-native-reanimated';
// import { GestureHandlerRootView, PanGestureHandler } from 'react-native-gesture-handler';

// // Mock data for images
// const images = [
//   'https://images.unsplash.com/photo-1542291026-7eec264c27ff?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2370&q=80',
//   'https://images.unsplash.com/photo-1546868871-7041f2a55e12?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1064&q=80',
//   'https://images.unsplash.com/photo-1583394838336-acd977736f90?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=768&q=80',
//   'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1169&q=80',
//   'https://images.unsplash.com/photo-1555487505-8603a1a69755?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1064&q=80',
//   'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1087&q=80',
//   'https://images.unsplash.com/photo-1530893609608-32a9af3aa95c?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1064&q=80',
// ];

// // Create an extended array to simulate infinite scrolling
// const extendedImages = [...images, ...images, ...images]; // Repeat 3x to give illusion of infinite scroll

// const { width, height } = Dimensions.get('window');
// const spacing = 16;
// const itemWidth = width * 0.62; // 62% of screen width
// const itemHeight = itemWidth * 1.67;
// const itemSize = itemWidth + spacing;

// // Create a separate animated item component
// const AnimatedItem = ({ item, index, scrollX }) => {
//   const inputRange = [
//     (index - 2) * itemSize,
//     (index - 1) * itemSize,
//     index * itemSize,
//     (index + 1) * itemSize,
//     (index + 2) * itemSize,
//   ];
  
//   const animatedStyle = useAnimatedStyle(() => {
//     const rotateY = interpolate(
//       scrollX.value,
//       inputRange,
//       [-3, -3, 0, 3, 3],
//       Extrapolate.CLAMP
//     );
    
//     return {
//       transform: [{ rotateY: `${rotateY}deg` }]
//     };
//   });

//   return (
//     <Animated.View style={[styles.itemContainer, { marginHorizontal: spacing / 2 }, animatedStyle]}>
//       <Image
//         source={{ uri: item }}
//         style={styles.itemImage}
//       />
//     </Animated.View>
//   );
// };

// // Staggered animation implementation for footer text
// const FooterText = ({ children, index }) => {
//   return (
//     <Animated.Text 
//       style={[styles.footerText, index === 1 ? styles.footerTitle : index === 2 ? styles.footerDescription : null]}
//       entering={FadeInUp.duration(500).delay(1000 + (index * 100)).springify()}
//     >
//       {children}
//     </Animated.Text>
//   );
// };

// export default function carrousalUi() {
//   const [activeIndex, setActiveIndex] = useState(0);
//   const scrollX = useSharedValue(0);
//   const flatListRef = useRef(null);
//   const [isUserScrolling, setIsUserScrolling] = useState(false);
  
//   // For initial offset to start in the middle of the extended array
//   const initialScrollIndex = images.length;
  
//   // Auto-scroll functionality
//   useEffect(() => {
//     let scrollInterval;
    
//     // Start auto-scrolling when component mounts or when user stops scrolling
//     if (!isUserScrolling) {
//       scrollInterval = setInterval(() => {
//         if (flatListRef.current) {
//           // Get current scroll position
//           const currentOffset = scrollX.value;
//           // Calculate next position
//           const nextOffset = currentOffset + 1.35; // Move 1 pixel at a time for smooth scrolling
          
//           // Check if we need to loop back
//           if (nextOffset > (extendedImages.length - images.length) * itemSize) {
//             // Jump to equivalent position in middle set
//             const resetOffset = nextOffset - (images.length * itemSize);
//             flatListRef.current.scrollToOffset({ offset: resetOffset, animated: false });
//           } else {
//             // Normal scrolling
//             flatListRef.current.scrollToOffset({ offset: nextOffset, animated: false });
//           }
//         }
//       }, 16); // ~60fps
//     }
    
//     // Clean up interval on unmount or when user starts scrolling
//     return () => {
//       if (scrollInterval) {
//         clearInterval(scrollInterval);
//       }
//     };
//   }, [isUserScrolling]);
  
//   // Handler for scroll events
//   const scrollHandler = useAnimatedScrollHandler({
//     onScroll: (event) => {
//       scrollX.value = event.contentOffset.x;
      
//       // Calculate the active index based on scroll position
//       const calculatedIndex = Math.round(scrollX.value / itemSize) % images.length;
//       const normalizedIndex = calculatedIndex < 0 ? images.length + calculatedIndex : calculatedIndex;
      
//       runOnJS(setActiveIndex)(normalizedIndex);
//     },
//     onBeginDrag: () => {
//       // User started scrolling
//       runOnJS(setIsUserScrolling)(true);
//     },
//     onEndDrag: (event) => {
//       // User stopped scrolling
//       runOnJS(setIsUserScrolling)(false);
      
//       // Snap to the nearest item
//       const targetOffset = Math.round(event.contentOffset.x / itemSize) * itemSize;
      
//       // If we're at the beginning or end, jump to the equivalent position in the middle set
//       if (event.contentOffset.x < itemSize) {
//         // Near the beginning - jump to equivalent position in middle set
//         const targetPosition = event.contentOffset.x + (images.length * itemSize);
//         flatListRef.current?.scrollToOffset({ offset: targetPosition, animated: false });
//       } else if (event.contentOffset.x > (extendedImages.length - images.length) * itemSize) {
//         // Near the end - jump to equivalent position in middle set
//         const targetPosition = event.contentOffset.x - (images.length * itemSize);
//         flatListRef.current?.scrollToOffset({ offset: targetPosition, animated: false });
//       }
//     }
//   });

//   // Render item callback that doesn't use hooks
//   const renderItem = useCallback(({ item, index }) => {
//     return (
//       <AnimatedItem item={item} index={index} scrollX={scrollX} />
//     );
//   }, [scrollX]);

//   return (
//     <GestureHandlerRootView style={styles.container}>
//       {/* Background Image with Blur */}
//       <View style={styles.backgroundContainer}>
//         <Animated.Image
//           key={`bg-image-${activeIndex}`}
//           source={{ uri: images[activeIndex] }}
//           style={styles.backgroundImage}
//           blurRadius={50}
//           entering={FadeIn.duration(1000)}
//           exiting={FadeOut.duration(1000)}
//         />
//       </View>

//       <View style={styles.contentContainer}>
//         {/* Carousel Implementation - Now with auto-scrolling */}
//         <Animated.FlatList
//           ref={flatListRef}
//           data={extendedImages}
//           renderItem={renderItem}
//           keyExtractor={(item, index) => `image-${index}`}
//           horizontal
//           showsHorizontalScrollIndicator={false}
//           snapToInterval={itemSize}
//           decelerationRate="fast"
//           contentContainerStyle={{ paddingHorizontal: spacing / 2 }}
//           initialScrollIndex={initialScrollIndex}
//           getItemLayout={(data, index) => ({
//             length: itemSize,
//             offset: itemSize * index,
//             index,
//           })}
//           onScroll={scrollHandler}
//           scrollEventThrottle={16}
//           entering={FadeInUp.duration(1000).delay(500).springify().damping(80).stiffness(200).withInitialValues({
//             transform: [{ translateY: -itemHeight / 2 }]
//           })}
//           // Enable touch events to work properly with images
//           simultaneousHandlers={[]}
//           waitFor={null}
//         />

//         {/* Footer with Manual Staggered Animation - Now positioned higher */}
//         <View style={styles.footer}>
//           <FooterText index={0}>Welcome to</FooterText>
//           <FooterText index={1}>Apple Invites Animation</FooterText>
//           <FooterText index={2}>Swipe through the cards to see the animation effect</FooterText>
//         </View>
//       </View>
//     </GestureHandlerRootView>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#000',
//   },
//   backgroundContainer: {
//     ...StyleSheet.absoluteFillObject,
//     opacity: 0.5,
//   },
//   backgroundImage: {
//     flex: 1,
//   },
//   contentContainer: {
//     flex: 1,
//     // The content layout is adjusted to position elements properly
//     justifyContent: 'space-between',
//     paddingTop: height * 0.15, // Push carousel down by 15% of screen height
//   },
//   itemContainer: {
//     width: itemWidth,
//     height: itemHeight,
//     borderRadius: 16,
//   },
//   itemImage: {
//     flex: 1,
//     borderRadius: 16,
//   },
//   footer: {
//     paddingBottom: height * 0.12, // Move footer up by adding bottom padding
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   footerText: {
//     color: '#fff',
//     fontSize: 16,
//     marginBottom: 8,
//   },
//   footerTitle: {
//     fontSize: 24,
//     fontWeight: 'bold',
//     marginBottom: 16,
//   },
//   footerDescription: {
//     fontSize: 14,
//     textAlign: 'center',
//     paddingHorizontal: 32,
//   },
// });
