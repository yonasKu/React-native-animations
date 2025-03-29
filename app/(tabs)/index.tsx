import { View } from 'react-native';
import { mockData } from '../../constants/mockData';
import { VerticalScrollList } from '../../components/VerticalScrollList';

export default function HomeScreen() {
  return (
    <View style={{ flex: 1, backgroundColor: '#000' }}>
      <VerticalScrollList data={mockData} />
    </View>
  );
}