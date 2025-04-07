import React, { useEffect } from "react";
import { View, StyleSheet } from "react-native";
import {
  Gesture,
  GestureDetector,
  Directions,
} from "react-native-gesture-handler";
import { ITEM_WIDTH, ITEM_HEIGHT } from "./constants";
import ParallaxForeground from "./ParallaxForeground";
import { Item } from "../../mocks/roomMock";
import Animated from "react-native-reanimated";

interface ParallaxItemProps {
  item: Item;
  index: number;
  scrollX: Animated.SharedValue<number>;
  activeIndex: Animated.SharedValue<number>;
  currentIndex: number;
  itemWidth?: number;
  itemHeight?: number;
  spacing?: number;
  translateYAmount?: number;
}

// ParallaxItem Component (Gesture Handling Wrapper)
const ParallaxItem: React.FC<ParallaxItemProps> = React.memo(
  ({
    item,
    index,
    scrollX,
    activeIndex,
    currentIndex,
    itemWidth = ITEM_WIDTH,
    itemHeight = ITEM_HEIGHT,
    spacing = 10,
    translateYAmount = itemHeight * 0.4,
  }) => {
    // Log when this component renders
    useEffect(() => {
      console.log(`ParallaxItem ${index} rendered, currentIndex: ${currentIndex}`);
    }, [index, currentIndex]);

    // Gestures to open/close the card details
    const flingUp = Gesture.Fling()
      .direction(Directions.UP)
      .numberOfPointers(1)
      .onBegin(() => {
        console.log(`Fling Up BEGAN for index: ${index}`);
      })
      .onStart(() => {
        console.log(`Fling Up STARTED for index: ${index}`);
        // Only allow opening if not already open and this is the current item
        if (activeIndex.value === -1 && currentIndex === index) {
          console.log(`Setting activeIndex to ${index}`);
          activeIndex.value = index; // Open this item
        }
      })
      .onEnd(() => {
        console.log(`Fling Up ENDED for index: ${index}`);
      });

    const flingDown = Gesture.Fling()
      .direction(Directions.DOWN)
      .numberOfPointers(1)
      .onBegin(() => {
        console.log(`Fling Down BEGAN for index: ${index}`);
      })
      .onStart(() => {
        console.log(`Fling Down STARTED for index: ${index}`);
        // Only allow closing if this item is the one currently open
        if (activeIndex.value === index) {
          console.log(`Setting activeIndex to -1`);
          activeIndex.value = -1; // Close the currently open item
        }
      })
      .onEnd(() => {
        console.log(`Fling Down ENDED for index: ${index}`);
      });

    // Add a tap gesture as fallback
    const tap = Gesture.Tap()
      .numberOfTaps(1)
      .onStart(() => {
        console.log(`Tap detected for index: ${index}`);
        // Toggle the active state
        if (activeIndex.value === index) {
          activeIndex.value = -1; // Close if this item is open
        } else if (activeIndex.value === -1 && currentIndex === index) {
          activeIndex.value = index; // Open this item if nothing is open
        }
      });

    // Combine gestures with proper priority
    const combinedGesture = Gesture.Race(
      flingUp,
      flingDown,
      tap
    );

    return (
      <GestureDetector gesture={combinedGesture}>
        <View style={styles.itemContainer}>
          <ParallaxForeground
            item={item}
            index={index}
            scrollX={scrollX}
            activeIndex={activeIndex}
            currentIndex={currentIndex}
            itemWidth={itemWidth}
            itemHeight={itemHeight}
            spacing={spacing}
            translateYAmount={translateYAmount}
            fullItemWidth={itemWidth + spacing}
            expandedItemWidth={itemWidth + spacing * 2}
          />
        </View>
      </GestureDetector>
    );
  }
);

const styles = StyleSheet.create({
  itemContainer: {
    width: ITEM_WIDTH,
    height: ITEM_HEIGHT,
  },
});

export default ParallaxItem;
