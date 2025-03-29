import { View, StyleSheet } from 'react-native';
import { useState } from 'react';
import Animated, { FadeInRight, FadeOutLeft } from 'react-native-reanimated';
import { LayoutAnimationConfig } from 'moti';
import { Tabs } from '../../components/ui/Tabs';

// Use lowercase icon names as they are exported in Lucide
const tabsData = [
  { icon: 'home', label: 'Home' },
  { icon: 'search', label: 'Search' },
  { icon: 'settings', label: 'Settings' },
  { icon: 'user', label: 'Profile' },
];

const tabColors = ['#FF5252', '#4CAF50', '#2196F3', '#9C27B0'];

export default function TabsAnimationScreen() {
  const [selectedIndex, setSelectedIndex] = useState(0);

  return (
    <View style={styles.container}>
      <Tabs
        data={tabsData}
        selectedIndex={selectedIndex}
        onChange={setSelectedIndex}
        activeColor="#fff"
        inactiveColor="#888"
        activeBackgroundColor="#007AFF"
        inactiveBackgroundColor="#f0f0f0"
      />
      
      <View style={{ flex: 1 }}>
        <Animated.View
          key={`tab-content-${selectedIndex}`}
          style={[
            styles.content,
            { backgroundColor: tabColors[selectedIndex] }
          ]}
          entering={FadeInRight.springify().damping(80).stiffness(200)}
          exiting={FadeOutLeft.springify().damping(80).stiffness(200)}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    gap: 16,
  },
  content: {
    flex: 1,
    borderRadius: 8,
  },
});