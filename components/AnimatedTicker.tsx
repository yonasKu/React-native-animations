// components/AnimatedTicker.tsx
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { MotiView } from 'moti';

// Constants
const STAGGER_DURATION = 50;

// Props for the Ticker component
interface TickerProps {
  value: number;
  fontSize?: number;
  currency?: boolean;
}

// Props for the TickerList component
interface TickerListProps {
  number: number;
  fontSize: number;
  index: number;
}

// Props for the Tick component
interface TickProps extends React.ComponentProps<typeof Text> {
  fontSize: number;
}

// Tick component for displaying individual characters
const Tick: React.FC<TickProps> = ({ children, fontSize, style, ...rest }) => {
  return (
    <Text
      {...rest}
      style={[
        {
          fontSize,
          lineHeight: fontSize * 1.1,
          fontWeight: '900',
          fontVariant: ['tabular-nums'],
        },
        style,
      ]}
    >
      {children}
    </Text>
  );
};

// TickerList component for displaying a vertical list of numbers
const TickerList: React.FC<TickerListProps> = ({ number, fontSize, index }) => {
  // Create an array of numbers from 0 to 9
  const numbers = Array.from({ length: 10 }, (_, i) => i);

  return (
    <View style={{ height: fontSize * 1.1, overflow: 'hidden' }}>
      <MotiView
        animate={{
          translateY: -fontSize * 1.1 * number,
        }}
        transition={{
          delay: index * STAGGER_DURATION,
          damping: 20,
          stiffness: 200,
        }}
      >
        {numbers.map((num) => (
          <Tick key={num} fontSize={fontSize}>
            {num}
          </Tick>
        ))}
      </MotiView>
    </View>
  );
};

// Main Ticker component
const AnimatedTicker: React.FC<TickerProps> = ({
  value,
  fontSize = 50,
  currency = false,
}) => {
  const [newFontSize, setNewFontSize] = useState(fontSize);

  // Format the value as a string or currency
  const formattedValue = currency
    ? new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value)
    : value.toString();

  // Split the formatted value into individual characters
  const splitValue = formattedValue.split('');

  // Handle text layout to adjust font size if needed
  const handleTextLayout = (event: any) => {
    const { lines } = event.nativeEvent;
    if (lines && lines.length > 0) {
      const { ascender } = lines[0];
      setNewFontSize(ascender);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.row}>
        {splitValue.map((char, index) => {
          const parsedNumber = parseInt(char, 10);
          return isNaN(parsedNumber) ? (
            <Tick key={index} fontSize={newFontSize} style={{ opacity: 0.5 }}>
              {char}
            </Tick>
          ) : (
            <TickerList
              key={index}
              number={parsedNumber}
              fontSize={newFontSize}
              index={index}
            />
          );
        })}
      </View>

      {/* Hidden text used to calculate proper font size */}
      <Text
        style={[
          {
            fontSize,
            position: 'absolute',
            left: -9999,
            fontVariant: ['tabular-nums'],
            fontWeight: '900',
          },
        ]}
        numberOfLines={1}
        adjustsFontSizeToFit
        onTextLayout={handleTextLayout}
      >
        {formattedValue}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
  row: {
    flexDirection: 'row',
  },
});

export default AnimatedTicker;