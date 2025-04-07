import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, Image } from "react-native";
import Animated, {
  useAnimatedStyle,
  interpolate,
  Extrapolation,
  useAnimatedRef,
  measure,
  withSpring,
  useDerivedValue,
} from "react-native-reanimated";
import { Camera } from "lucide-react-native";
import { SPACING, COLORS, FONTS } from "./constants";
import { Item } from "../../mocks/roomMock";
import CardGradients from "./CardGradients";
import DetailsList from "./DetailsList";
import SwipeUpIndicator from "./SwipeUpIndicator";

interface ParallaxForegroundProps {
  item: Item;
  index: number;
  scrollX: Animated.SharedValue<number>;
  activeIndex: Animated.SharedValue<number>;
  currentIndex: number;
  itemWidth: number;
  itemHeight: number;
  spacing: number;
  translateYAmount: number;
  fullItemWidth: number;
  expandedItemWidth: number;
}

// Create animated components
const AnimatedImage = Animated.createAnimatedComponent(Image);

// Parallax foreground component
const ParallaxForeground: React.FC<ParallaxForegroundProps> = React.memo(
  ({
    item,
    index,
    scrollX,
    activeIndex,
    currentIndex,
    itemWidth,
    itemHeight,
    spacing,
    translateYAmount,
    fullItemWidth,
    expandedItemWidth,
  }) => {
    const textRef = useAnimatedRef<Animated.View>();
    const detailsRef = useAnimatedRef<Animated.View>();
    const [textHeight, setTextHeight] = useState<number>(0);
    
    // Spring animation for active state
    const isActiveSpringy = useDerivedValue(() => {
      return withSpring(activeIndex.value === index ? 1 : 0, {
        damping: 80,
        stiffness: 200,
      });
    });

    // Image animation styles
    const imageStyles = useAnimatedStyle(() => {
      const scale = interpolate(
        scrollX.value / fullItemWidth,
        [index - 0.1, index, index + 0.1],
        [1, 1.1, 1],
        Extrapolation.CLAMP
      );

      const translateX = interpolate(
        scrollX.value / fullItemWidth,
        [index - 1, index, index + 1],
        [fullItemWidth * 0.1, 0, -fullItemWidth * 0.1],
        Extrapolation.CLAMP
      );

      return {
        transform: [{ scale }, { translateX }],
      };
    });

    // Measure the text height for animations
    useEffect(() => {
      if (textRef.current) {
        const measureText = async () => {
          try {
            const measured = await measure(textRef);
            if (measured) {
              setTextHeight(measured.height);
            }
          } catch (error) {
            console.log('Error measuring text:', error);
          }
        };
        measureText();
      }
    }, [textRef]);

    // Text animation styles
    const textStyles = useAnimatedStyle(() => {
      return {
        opacity: interpolate(
          scrollX.value / fullItemWidth,
          [index - 0.5, index, index + 0.5],
          [0, 1, 0],
          Extrapolation.CLAMP
        ),
        transform: [
          {
            translateX: interpolate(
              scrollX.value / fullItemWidth,
              [index - 1, index, index + 1],
              [itemWidth * 0.5, 0, -itemWidth * 0.5],
              Extrapolation.CLAMP
            ),
          },
        ],
      };
    });

    // Icon animation styles
    const iconStyles = useAnimatedStyle(() => {
      return {
        opacity: interpolate(
          scrollX.value / fullItemWidth,
          [index - 0.3, index, index + 0.3],
          [0, 1, 0],
          Extrapolation.CLAMP
        ),
        transform: [
          {
            scale: interpolate(
              scrollX.value / fullItemWidth,
              [index - 0.5, index, index + 0.5],
              [0.5, 1, 0.5],
              Extrapolation.CLAMP
            ),
          },
        ],
      };
    });

    // Card animation styles
    const cardStyles = useAnimatedStyle(() => {
      return {
        transform: [
          {
            translateY: interpolate(
              isActiveSpringy.value,
              [0, 1],
              [0, -translateYAmount],
              Extrapolation.CLAMP
            ),
          },
        ],
        width: interpolate(
          isActiveSpringy.value,
          [0, 1],
          [itemWidth, expandedItemWidth],
          Extrapolation.CLAMP
        ),
      };
    });

    // Gradient container styles
    const gradientContainerStyles = useAnimatedStyle(() => {
      return {
        width: interpolate(
          isActiveSpringy.value,
          [0, 1],
          [itemWidth, expandedItemWidth],
          Extrapolation.CLAMP
        ),
      };
    });

    // Details list styles
    const detailsListStyles = useAnimatedStyle(() => {
      return {
        opacity: isActiveSpringy.value,
        transform: [
          {
            translateY: interpolate(
              isActiveSpringy.value,
              [0, 1],
              [20, 0],
              Extrapolation.CLAMP
            ),
          },
        ],
      };
    });

    // Only render card contents if it's the current index or adjacent to improve performance
    const shouldRenderContent = Math.abs(currentIndex - index) <= 1;
    const isCurrentItem = currentIndex === index;

    return (
      <Animated.View style={[styles.cardContainer, cardStyles]}>
        <Animated.View style={[styles.imageContainer]}>
          <AnimatedImage
            source={{ uri: item.image }}
            style={[styles.image, imageStyles]}
          />
          
          {shouldRenderContent && (
            <CardGradients 
              gradientContainerStyles={gradientContainerStyles}
              itemWidth={itemWidth}
              itemHeight={itemHeight}
            />
          )}
        </Animated.View>

        {shouldRenderContent && (
          <>
            {/* Text container positioned on the left side */}
            <View style={styles.textWrapper}>
              <Animated.View style={[styles.textContainer, textStyles]} ref={textRef}>
                <Text style={styles.itemTitle}>
                  {item.title.toUpperCase()}
                </Text>
              </Animated.View>
            </View>

            {/* Camera icon */}
            <View style={styles.iconContainer}>
              <Animated.View style={[iconStyles]}>
                <Camera size={24} color="white" />
              </Animated.View>
            </View>

            {/* Details list */}
            <DetailsList 
              item={item} 
              ref={detailsRef}
              style={detailsListStyles}
            />
            
            {/* Swipe up indicator - only show for current index */}
            {isCurrentItem && (
              <SwipeUpIndicator isOpen={activeIndex.value === index} />
            )}
          </>
        )}
      </Animated.View>
    );
  }
);

const styles = StyleSheet.create({
  cardContainer: {
    width: SPACING,
    height: SPACING,
    borderRadius: SPACING,
    overflow: "hidden",
    backgroundColor: COLORS.cardBackground,
  },
  imageContainer: {
    ...StyleSheet.absoluteFillObject,
    overflow: "hidden",
    borderRadius: SPACING,
  },
  image: {
    ...StyleSheet.absoluteFillObject,
    width: "100%",
    height: "100%",
    resizeMode: "cover",
    opacity: 0.9,
  },
  textWrapper: {
    position: "absolute",
    left: SPACING * 4,
    bottom: SPACING * 6,
    width: "85%",
    transform: [{ rotate: "-90deg" }],
    transformOrigin: "0% 50%",
    zIndex: 10,
  },
  textContainer: {
    paddingHorizontal: SPACING * 2,
  },
  itemTitle: {
    color: "white",
    fontSize: 46,
    fontFamily: FONTS.title,
    textTransform: "uppercase",
    letterSpacing: 1,
    textShadowColor: "rgba(0,0,0,0.7)",
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 6,
  },
  iconContainer: {
    position: "absolute",
    right: SPACING,
    top: SPACING,
  },
});

export default ParallaxForeground;
