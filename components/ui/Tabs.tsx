import { View, Text, Pressable, StyleSheet } from 'react-native';
import Animated, { FadeInRight, FadeOutRight } from 'react-native-reanimated';
import { MotiView } from 'moti';
import * as Icons from 'lucide-react-native';

// Define types
type IconName = keyof typeof Icons;

type TabItem = {
  icon: IconName;
  label: string;
};

type TabsProps = {
  data: TabItem[];
  selectedIndex: number;
  onChange: (index: number) => void;
  activeColor?: string;
  inactiveColor?: string;
  activeBackgroundColor?: string;
  inactiveBackgroundColor?: string;
};

// Constants
const SPACING = 4;

export const Tabs = ({
  data,
  selectedIndex,
  onChange,
  activeColor = '#fff',
  inactiveColor = '#888',
  activeBackgroundColor = '#007AFF',
  inactiveBackgroundColor = '#f0f0f0',
}: TabsProps) => {
  return (
    <View style={styles.container}>
      {data.map((item, index) => {
        const isSelected = selectedIndex === index;
        
        return (
          <MotiView
            key={index}
            style={styles.tab}
            animate={{
              backgroundColor: isSelected ? activeBackgroundColor : inactiveBackgroundColor,
            }}
            transition={{ type: 'spring', damping: 80, stiffness: 200 }}
            layout={{
              type: 'spring',
              damping: 80,
              stiffness: 200,
            }}
          >
            <Pressable
              onPress={() => onChange(index)}
              style={styles.tabButton}
            >
              <Icon
                name={item.icon}
                animate={{
                  color: isSelected ? activeColor : inactiveColor,
                }}
              />
              {isSelected && (
                <Animated.Text
                  style={[styles.label, { color: activeColor }]}
                  entering={FadeInRight.springify()
                    .damping(80)
                    .stiffness(200)}
                  exiting={FadeOutRight.springify()
                    .damping(80)
                    .stiffness(200)}
                >
                  {item.label}
                </Animated.Text>
              )}
            </Pressable>
          </MotiView>
        );
      })}
    </View>
  );
};

// Icon component that uses Moti for animations
const Icon = ({ name, animate }: { name: IconName; animate?: any }) => {
  const IconComponent = Icons[name];
  return (
    <MotiView {...animate}>
      <IconComponent size={16} />
    </MotiView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    gap: SPACING * 2,
  },
  tab: {
    borderRadius: 8,
    overflow: 'hidden',
  },
  tabButton: {
    padding: SPACING * 3,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: SPACING * 2,
  },
  label: {
    fontWeight: '500',
  },
});