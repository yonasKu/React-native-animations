// app/index.tsx
import { Redirect } from 'expo-router';

export default function Index() {
  // This will redirect to the tabs navigation when the app starts
  return <Redirect href="/(tabs)" />;
}
