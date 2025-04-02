// components/ScheduleAnimation.tsx
import React, { useState } from 'react';
import { View, Text, Switch, Pressable, StyleSheet } from 'react-native';
import Animated, { 
  FadeInDown, 
  FadeOut, 
  Layout, 
  LinearTransition 
} from 'react-native-reanimated';
import { Plus, X } from 'lucide-react-native';

// Constants
const WEEKDAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
const SPACING = 12;
const COLOR = 'lightgray';
const BORDER_RADIUS = 12;
const DAMPING = 14;

// Create animated components
const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

// Hour block component to display time slots
const HourBlock = ({ block }: { block: number }) => {
  return (
    <View style={styles.hourBlockContainer}>
      <Text style={styles.hourText}>
        {block > 9 ? block : `0${block}`}:00 {block >= 12 ? 'PM' : 'AM'}
      </Text>
    </View>
  );
};

export const ScheduleAnimation = () => {
  // Create animations
  const entering = FadeInDown.springify().damping(DAMPING);
  const exiting = FadeOut.springify().damping(DAMPING);
  const layout = LinearTransition.springify().damping(DAMPING);

  return (
    <View style={styles.container}>
      {WEEKDAYS.map((day) => (
        <Day key={day} day={day} />
      ))}
    </View>
  );
};

// Day component
const Day = ({ day }: { day: string }) => {
  const [isOn, setIsOn] = useState(false);
  const [hours, setHours] = useState<number[]>([]);

  // Create animations
  const entering = FadeInDown.springify().damping(DAMPING);
  const exiting = FadeOut.springify().damping(DAMPING);
  const layout = LinearTransition.springify().damping(DAMPING);

  // Day block component to display time slots
  const DayBlock = () => {
    return (
      <Animated.View 
        style={styles.dayBlockContainer} 
        entering={entering} 
        exiting={exiting} 
        layout={layout}
      >
        {hours.map((hour) => (
          <Animated.View 
            key={hour} 
            style={styles.timeSlotContainer} 
            entering={entering} 
            exiting={exiting} 
            layout={layout}
          >
            <View style={styles.timeSlotContent}>
              <Text style={styles.timeSlotLabel}>From</Text>
              <HourBlock block={hour} />
            </View>
            <View style={styles.timeSlotContent}>
              <Text style={styles.timeSlotLabel}>To</Text>
              <HourBlock block={hour + 1} />
            </View>
            <Pressable 
              style={styles.removeButton} 
              onPress={() => setHours(hours.filter((h) => h !== hour))}
            >
              <View style={styles.removeButtonInner}>
                <X size={16} color="#000" />
              </View>
            </Pressable>
          </Animated.View>
        ))}
        
        <AnimatedPressable 
          style={styles.addMoreButton} 
          layout={layout}
          onPress={() => {
            if (hours.length === 0) {
              setHours([8]);
            } else {
              const lastHour = hours[hours.length - 1];
              setHours([...hours, lastHour + 1]);
            }
          }}
        >
          <View style={styles.addMoreButtonInner}>
            <Plus size={16} color="#000" />
            <Text style={styles.addMoreText}>Add more</Text>
          </View>
        </AnimatedPressable>
      </Animated.View>
    );
  };

  return (
    <Animated.View 
      style={[
        styles.dayContainer, 
        { backgroundColor: isOn ? 'transparent' : COLOR }
      ]}
      layout={layout}
    >
      <View style={styles.dayHeader}>
        <Text style={styles.dayText}>{day}</Text>
        <Switch
          value={isOn}
          onValueChange={(value) => setIsOn(value)}
          trackColor={{ false: '#999', true: '#666' }}
          style={styles.switch}
        />
      </View>
      
      {isOn && <DayBlock />}
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: SPACING,
    gap: SPACING,
  },
  dayContainer: {
    borderWidth: 1,
    borderColor: COLOR,
    borderRadius: BORDER_RADIUS,
    overflow: 'hidden',
  },
  dayHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: SPACING,
  },
  dayText: {
    fontSize: 16,
    fontWeight: '500',
  },
  switch: {
    transform: [{ scale: 0.7 }],
  },
  dayBlockContainer: {
    padding: SPACING,
    gap: SPACING,
  },
  timeSlotContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING,
  },
  timeSlotContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  timeSlotLabel: {
    fontSize: 14,
    color: '#666',
  },
  hourBlockContainer: {
    padding: 4,
    backgroundColor: '#f0f0f0',
    borderRadius: 4,
  },
  hourText: {
    fontSize: 14,
  },
  removeButton: {
    marginLeft: 'auto',
  },
  removeButtonInner: {
    padding: 8,
    backgroundColor: '#f0f0f0',
    borderRadius: 20,
  },
  addMoreButton: {
    marginTop: SPACING,
  },
  addMoreButtonInner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    padding: 8,
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  addMoreText: {
    fontSize: 14,
    fontWeight: '500',
  },
});

export default ScheduleAnimation;