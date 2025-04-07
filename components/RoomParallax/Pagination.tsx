import React from "react";
import { StyleSheet, View } from "react-native";
import Animated, {
  useAnimatedStyle,
  interpolate,
  Extrapolation,
  withSpring,
} from "react-native-reanimated";
import {
  DOT_SIZE,
  DOT_SPACING,
  DOT_INDICATOR_SIZE,
  INDICATOR_BORDER_SIZE,
  INDICATOR_BORDER_COLOR,
} from "./constants";
import { Item } from "../../mocks/roomMock";

interface DotProps {
  index: number;
  scrollX: Animated.SharedValue<number>;
}

interface PaginationIndicatorProps {
  scrollX: Animated.SharedValue<number>;
  data: Item[];
}

interface PaginationProps {
  scrollX: Animated.SharedValue<number>;
  data: Item[];
  isOpen?: boolean;
}

// Individual dot component for pagination
function Dot({ index, scrollX }: DotProps) {
  const ITEM_FULL_SIZE = DOT_SIZE + DOT_SPACING;
  
  const dotStyle = useAnimatedStyle(() => {
    const opacity = interpolate(
      scrollX.value,
      [(index - 0.5) * ITEM_FULL_SIZE, index * ITEM_FULL_SIZE, (index + 0.5) * ITEM_FULL_SIZE],
      [0.5, 1, 0.5],
      Extrapolation.CLAMP
    );
    
    const width = interpolate(
      scrollX.value,
      [(index - 1) * ITEM_FULL_SIZE, index * ITEM_FULL_SIZE, (index + 1) * ITEM_FULL_SIZE],
      [DOT_SIZE, DOT_SIZE * 1.5, DOT_SIZE],
      Extrapolation.CLAMP
    );
    
    return {
      opacity,
      width,
    };
  });
  
  return (
    <Animated.View style={[styles.paginationDot, dotStyle]} />
  );
}

// Pagination indicator component
function PaginationIndicator({ scrollX, data }: PaginationIndicatorProps) {
  const ITEM_FULL_SIZE = DOT_SIZE + DOT_SPACING;
  
  const indicatorStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateX: (scrollX.value / ITEM_FULL_SIZE) * (DOT_SIZE + DOT_SPACING),
        },
      ],
    };
  });
  
  return (
    <Animated.View style={[styles.paginationIndicator, indicatorStyle]} />
  );
}

// Pagination component
const Pagination: React.FC<PaginationProps> = ({ scrollX, data, isOpen = false }) => {
  const containerStyle = useAnimatedStyle(() => {
    return {
      opacity: withSpring(isOpen ? 0.5 : 1, {
        damping: 80,
        stiffness: 200,
      }),
    };
  });
  
  return (
    <Animated.View style={[styles.paginationContainer, containerStyle]}>
      {data.map((_, index) => (
        <Dot 
          key={`dot-${index}`} 
          index={index} 
          scrollX={scrollX} 
        />
      ))}
      <PaginationIndicator scrollX={scrollX} data={data} />
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  paginationContainer: {
    flexDirection: "row",
    position: "absolute",
    bottom: 30,
    alignSelf: "center",
    gap: DOT_SPACING,
  },
  paginationDot: {
    height: DOT_SIZE,
    borderRadius: DOT_SIZE / 2,
    backgroundColor: "#fff",
  },
  paginationIndicator: {
    position: "absolute",
    width: DOT_INDICATOR_SIZE,
    height: DOT_INDICATOR_SIZE,
    borderRadius: DOT_INDICATOR_SIZE / 2,
    borderWidth: INDICATOR_BORDER_SIZE,
    borderColor: INDICATOR_BORDER_COLOR,
    top: -INDICATOR_BORDER_SIZE,
    left: -INDICATOR_BORDER_SIZE,
  },
});

export default Pagination;
