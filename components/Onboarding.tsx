import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  interpolate,
  Extrapolate,
  FadeIn,
  FadeOut,
  FadeInLeft,
  FadeOutLeft,
  FadeInDown,
  FadeOutUp,
  useDerivedValue,
  withSpring,
} from 'react-native-reanimated';

// Constants
const spacing = 8;
const buttonHeight = 42;
const dotContainerSize = 24;
const dotSize = dotContainerSize / 3;

// Colors
// const activeColor = '#FFF';
// const inactiveColor = '#AAA';
const activeColor = 'red';
const inactiveColor = 'red';
const primaryColor = '#006EE6';
const indicatorColor = '#34C759'; // Green color for the indicator

// Reusable layout transition
const layoutTransition = {
  type: 'spring',
  springify: true,
  damping: 80,
  stiffness: 200,
};

// Animated Button component
const Button = ({ children, style, ...rest }: any) => {
  const AnimatedPressable = Animated.createAnimatedComponent(Pressable);
  
  return (
    <AnimatedPressable 
      style={[styles.button, style]} 
      layout={layoutTransition} 
      {...rest}
    >
      {typeof children === 'string' ? (
        <Animated.Text 
          style={[styles.buttonText, style.textColor && { color: style.textColor }]} 
          layout={layoutTransition}
        >
          {children}
        </Animated.Text>
      ) : (
        children
      )}
    </AnimatedPressable>
  );
};

// Dot component for pagination
const Dot = ({ index, animation }: { index: number, animation: Animated.SharedValue<number> }) => {
  // Create animated style that interpolates color based on animation value
  const animatedStyles = useAnimatedStyle(() => {
    const backgroundColor = interpolate(
      animation.value,
      [index - 1, index, index + 1],
      [inactiveColor, activeColor, inactiveColor],
      Extrapolate.CLAMP
    );

    return { backgroundColor };
  });


  return (
    <View style={styles.dotContainer}>
      <Animated.View style={[styles.dot, animatedStyles]} />
    </View>
  );
};

// Pagination indicator that moves with the active slide
const PaginationIndicator = ({ animation, total }: { animation: Animated.SharedValue<number>, total: number }) => {
  // Animate the position of the indicator
  const animatedStyles = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: animation.value * dotContainerSize }],
    };
  });

  return (
    <Animated.View style={[styles.paginationIndicator, animatedStyles]} />
  );
};

interface OnboardingProps {
  total: number;
  selectedIndex: number;
  onIndexChange: (index: number) => void;
}

export default function Onboarding({ total, selectedIndex, onIndexChange }: OnboardingProps) {
  // Create a derived animated value from selectedIndex with spring animation
  const animation = useDerivedValue(() => {
    return withSpring(selectedIndex, {
      damping: 80,
      stiffness: 200,
    });
  }, [selectedIndex]);

  // We need to account for 0-indexed arrays
  const maxIndex = total - 1;

  return (
    <View style={styles.container}>
      {/* Pagination dots */}
      <View style={styles.pagination}>
        {/* This is the indicator that moves with the active slide */}
        <PaginationIndicator animation={animation} total={total} />
        
        {/* Map through and create a dot for each slide */}
        {Array.from({ length: total }).map((_, i) => (
          <Dot key={`dot-${i}`} index={i} animation={animation} />
        ))}
      </View>

      {/* Navigation buttons */}
      <View style={styles.buttonsContainer}>
        {selectedIndex > 0 && (
          <Button 
            style={styles.backButton}
            onPress={() => onIndexChange(Math.max(0, selectedIndex - 1))}
            entering={FadeInLeft.springify().damping(80).stiffness(200)}
            exiting={FadeOutLeft.springify().damping(80).stiffness(200)}
          >
            Back
          </Button>
        )}

        <Button 
          style={[
            styles.nextButton, 
            { flex: selectedIndex > 0 ? 1 : undefined }
          ]}
          onPress={() => {
            if (selectedIndex < maxIndex) {
              onIndexChange(selectedIndex + 1);
            } else {
              // Handle finish action
              console.log('Onboarding complete!');
            }
          }}
          layout={layoutTransition}
        >
          {selectedIndex === maxIndex ? (
            <Animated.Text 
              key="finish"
              style={styles.buttonText} 
              entering={FadeInDown.springify().damping(80).stiffness(200)}
              exiting={FadeOutUp.springify().damping(80).stiffness(200)}
              layout={layoutTransition}
            >
              Finish
            </Animated.Text>
          ) : (
            <Animated.Text 
              key="continue"
              style={styles.buttonText} 
              entering={FadeInDown.springify().damping(80).stiffness(200)}
              exiting={FadeOutUp.springify().damping(80).stiffness(200)}
              layout={layoutTransition}
            >
              Continue
            </Animated.Text>
          )}
        </Button>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: spacing * 2,
  },
  pagination: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing * 4,
    position: 'relative',
    height: dotContainerSize,
  },
  dotContainer: {
    width: dotContainerSize,
    height: dotContainerSize,
    justifyContent: 'center',
    alignItems: 'center',
  },
  dot: {
    width: dotSize,
    height: dotSize,
    borderRadius: dotSize / 2,
    backgroundColor: inactiveColor,
  },
  paginationIndicator: {
    // position: 'absolute',
    left: 0,
    top: 0,
    height: dotContainerSize,
    width: dotContainerSize,
    borderRadius: dotContainerSize / 2,
    backgroundColor: activeColor,
    opacity: 0.3,
    zIndex: -1, // Make sure it appears behind the dots
  },
  buttonsContainer: {
    flexDirection: 'row',
    gap: spacing,
  },
  button: {
    height: buttonHeight,
    borderRadius: buttonHeight / 2,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: spacing * 2,
  },
  backButton: {
    backgroundColor: '#DDD',
    textColor: '#000',
  },
  nextButton: {
    backgroundColor: primaryColor,
    textColor: '#FFF',
  },
  buttonText: {
    color: '#FFF',
    fontWeight: '600',
  },
});
