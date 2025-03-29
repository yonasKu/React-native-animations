import { Tabs } from 'expo-router';
import { Feather } from '@expo/vector-icons';

export default function TabLayout() {
  return (
    <Tabs 
      screenOptions={{ 
        headerShown: false,
        tabBarActiveTintColor: '#007AFF',
        tabBarStyle: {
          paddingBottom: 5,
          paddingTop: 5,
        }
      }}
    >
      <Tabs.Screen 
        name="index" 
        options={{
          title: 'Scroll Animation',
          tabBarIcon: ({ color, size }) => (
            <Feather name="list" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen 
        name="tabsAnimation" 
        options={{
          title: 'Tabs Animation',
          tabBarIcon: ({ color, size }) => (
            <Feather name="layers" size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
