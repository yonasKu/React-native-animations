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
      <Tabs.Screen
      name='carrousalUi'
      options={{
        title:'Carrousal UI',
        tabBarIcon: ({ color, size }) => (
          <Feather name="layers" size={size} color={color} />
        ),
      }}
      />

      <Tabs.Screen 
        name="appleInvites" 
        options={{
          title: 'Apple Invites',
          tabBarIcon: ({ color, size }) => (
            <Feather name="mail" size={size} color={color} />
          ),
        }}
      />
      
      <Tabs.Screen 
        name="onboardingExample" 
        options={{
          title: 'Onboarding',
          tabBarIcon: ({ color, size }) => (
            <Feather name="clipboard" size={size} color={color} />
          ),
          href: null,
        }}
      />
      
      <Tabs.Screen 
        name="messageAnimation" 
        options={{
          title: 'Messages',
          tabBarIcon: ({ color, size }) => (
            <Feather name="message-circle" size={size} color={color} />
          ),
          href: null,
        }}
      />
      <Tabs.Screen 
        name="availabilityAnimation" 
        options={{
          title: 'Availability',
          tabBarIcon: ({ color, size }) => (
            <Feather name="layers" size={size} color={color} />
          ),
          href: null,
        }}
      />
    </Tabs>
  );
}