import React from "react";
import { StyleSheet } from "react-native";
import Animated from "react-native-reanimated";
import { LinearGradient } from "expo-linear-gradient";
import { ITEM_WIDTH, ITEM_HEIGHT } from "./constants";

interface CardGradientsProps {
  gradientContainerStyles: any;
  itemWidth?: number;
  itemHeight?: number;
}

// Card Gradients component to optimize performance
const CardGradients: React.FC<CardGradientsProps> = ({ 
  gradientContainerStyles,
  itemWidth = ITEM_WIDTH,
  itemHeight = ITEM_HEIGHT
}) => {
  return (
    <>
      <Animated.View style={[styles.gradientContainer, gradientContainerStyles]}>
        <LinearGradient
          style={[styles.leftGradient, { width: itemWidth / 3 }]}
          colors={['rgba(0,0,0,0.2)', 'rgba(0,0,0,0)']}
          start={{ x: 0, y: 0.5 }}
          end={{ x: 1, y: 0.5 }}
          pointerEvents="none"
        />
      </Animated.View>
      
      <Animated.View style={[styles.gradientContainer, gradientContainerStyles]}>
        <LinearGradient
          style={[styles.rightGradient, { width: itemWidth / 3 }]}
          colors={['rgba(0,0,0,0)', 'rgba(0,0,0,0.2)']}
          start={{ x: 0, y: 0.5 }}
          end={{ x: 1, y: 0.5 }}
          pointerEvents="none"
        />
      </Animated.View>
      
      {/* Bottom gradient for text visibility */}
      <LinearGradient
        style={[styles.bottomGradient, { height: itemHeight / 3 }]}
        colors={['rgba(0,0,0,0)', 'rgba(0,0,0,0.7)']}
        start={{ x: 0.5, y: 0 }}
        end={{ x: 0.5, y: 1 }}
        pointerEvents="none"
      />
    </>
  );
};

const styles = StyleSheet.create({
  gradientContainer: {
    ...StyleSheet.absoluteFillObject,
    alignSelf: 'center',
  },
  leftGradient: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
  },
  rightGradient: {
    position: 'absolute',
    right: 0,
    top: 0,
    bottom: 0,
  },
  bottomGradient: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
  },
});

export default CardGradients;
