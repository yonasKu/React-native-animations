import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, TextStyle } from 'react-native';
import Animated, { 
  Easing,
  useAnimatedStyle, 
  useSharedValue, 
  withTiming,
  runOnJS,
  Layout,
} from 'react-native-reanimated';

type AnimatedSentenceProps = {
  /** Array of lines to animate sequentially */
  lines: string[];
  /** Style for the Text component */
  style?: TextStyle;
  /** Duration for each line to enter (ms) */
  enterDuration?: number;
  /** Duration for each line to exit (ms) */
  exitDuration?: number;
  /** Delay between a line finishing and the next line starting (ms) */
  lineDelay?: number;
  /** Callback when all lines have entered */
  onEnterFinish?: () => void;
  /** Callback when all lines have exited */
  onExitFinish?: () => void;
  /** Whether to auto-start the exit animation */
  autoExit?: boolean;
  /** Delay before auto-exit animation begins (ms) */
  autoExitDelay?: number;
};

export const AnimatedSentence = ({
  lines,
  style,
  enterDuration = 400,
  exitDuration = 300,
  lineDelay = 500, // Delay between lines
  onEnterFinish,
  onExitFinish,
  autoExit = false,
  autoExitDelay = 2000,
}: AnimatedSentenceProps) => {
  const [currentLineIndex, setCurrentLineIndex] = useState(0); // Track which line is currently animating
  const [isExiting, setIsExiting] = useState(false);
  const [exitedLineCount, setExitedLineCount] = useState(0);
  const [exitStarted, setExitStarted] = useState(false);

  // Reset state when lines change
  useEffect(() => {
    setCurrentLineIndex(0);
    setIsExiting(false);
    setExitedLineCount(0);
    setExitStarted(false);
  }, [lines]);

  // Advance to the next line after the current one finishes
  const handleLineEntered = () => {
    if (currentLineIndex < lines.length - 1) {
      // More lines to show - wait for lineDelay and then advance
      setTimeout(() => {
        setCurrentLineIndex(prev => prev + 1);
      }, lineDelay);
    } else {
      // All lines have entered
      if (onEnterFinish) {
        onEnterFinish();
      }
      
      // Auto start exit animation if enabled
      if (autoExit) {
        const timer = setTimeout(() => {
          setExitStarted(true);
        }, autoExitDelay);
        
        return () => clearTimeout(timer);
      }
    }
  };
  
  // Start exit animations in reverse order
  useEffect(() => {
    if (exitStarted && !isExiting) {
      setIsExiting(true);
      setCurrentLineIndex(lines.length - 1); // Start from last line
    }
  }, [exitStarted, isExiting, lines.length]);
  
  // Handle exit completion
  const handleLineExited = () => {
    const newExitedCount = exitedLineCount + 1;
    setExitedLineCount(newExitedCount);
    
    if (currentLineIndex > 0) {
      // Move to previous line for exit
      setTimeout(() => {
        setCurrentLineIndex(prev => prev - 1);
      }, lineDelay);
    }
    
    // All lines have exited
    if (newExitedCount === lines.length && onExitFinish) {
      onExitFinish();
    }
  };

  // Public method to start exit animation
  const startExitAnimation = () => {
    if (!exitStarted) {
      setExitStarted(true);
    }
  };

  return (
    <View style={styles.container}>
      {lines.map((line, index) => (
        <AnimatedLine
          key={`${index}-${line}`}
          line={line}
          index={index}
          isActive={index <= currentLineIndex} // Only animate lines up to current index
          isExiting={isExiting && index === currentLineIndex} // Only exit current line
          enterDuration={enterDuration}
          exitDuration={exitDuration}
          lineStyle={style}
          onEnterComplete={index === currentLineIndex ? handleLineEntered : undefined}
          onExitComplete={isExiting ? handleLineExited : undefined}
        />
      ))}
    </View>
  );
};

type AnimatedLineProps = {
  line: string;
  index: number;
  isActive: boolean;
  isExiting: boolean;
  enterDuration: number;
  exitDuration: number;
  lineStyle?: TextStyle;
  onEnterComplete?: () => void;
  onExitComplete?: () => void;
};

const AnimatedLine = ({
  line,
  index,
  isActive,
  isExiting,
  enterDuration,
  exitDuration,
  lineStyle,
  onEnterComplete,
  onExitComplete,
}: AnimatedLineProps) => {
  const opacity = useSharedValue(0);
  const translateX = useSharedValue(-50);
  const [hasAnimated, setHasAnimated] = useState(false);
  
  // Handle enter animation when this line becomes active
  useEffect(() => {
    if (isActive && !hasAnimated && !isExiting) {
      setHasAnimated(true);
      
      opacity.value = withTiming(1, {
        duration: enterDuration,
        easing: Easing.out(Easing.quad),
      }, (finished) => {
        if (finished && onEnterComplete) {
          runOnJS(onEnterComplete)();
        }
      });
      
      translateX.value = withTiming(0, {
        duration: enterDuration,
        easing: Easing.out(Easing.quad),
      });
    }
  }, [isActive, hasAnimated, isExiting, enterDuration, opacity, translateX, onEnterComplete]);
  
  // Handle exit animation
  useEffect(() => {
    if (isExiting) {
      opacity.value = withTiming(0, {
        duration: exitDuration,
        easing: Easing.in(Easing.quad),
      }, (finished) => {
        if (finished && onExitComplete) {
          runOnJS(onExitComplete)();
        }
      });
      
      translateX.value = withTiming(50, {
        duration: exitDuration,
        easing: Easing.in(Easing.quad),
      });
    }
  }, [isExiting, exitDuration, opacity, translateX, onExitComplete]);
  
  const animatedStyle = useAnimatedStyle(() => {
    return {
      opacity: opacity.value,
      transform: [{ translateX: translateX.value }],
    };
  });
  
  return (
    <Animated.Text
      style={[
        styles.line, 
        lineStyle, 
        animatedStyle,
        // Hide lines that haven't animated yet
        !isActive && !hasAnimated ? styles.hidden : null
      ]}
      layout={Layout.springify()}
    >
      {line}
    </Animated.Text>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'flex-start',
    padding: 20,
    width: '100%',
  },
  line: {
    fontSize: 24,
    marginBottom: 12,
    color: 'white',
  },
  hidden: {
    opacity: 0,
    position: 'absolute',
  },
});