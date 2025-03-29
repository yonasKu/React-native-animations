import { Dimensions } from 'react-native';
import Animated, { 
  useAnimatedScrollHandler,
  useSharedValue
} from 'react-native-reanimated';
import { Item } from '../constants/mockData';
import { AnimatedCard } from './ui/AnimatedCard';

const { height } = Dimensions.get('window');
const SPACING = 20;
const ITEM_SIZE = height * 0.72;
const ITEM_FULL_SIZE = ITEM_SIZE + SPACING * 2;

export const VerticalScrollList = ({ data }: { data: Item[] }) => {
  const scrollY = useSharedValue(0);
  
  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollY.value = event.contentOffset.y / ITEM_FULL_SIZE;
    },
  });

  return (
    <Animated.FlatList
      data={data}
      onScroll={scrollHandler}
      scrollEventThrottle={16}
      snapToInterval={ITEM_FULL_SIZE}
      contentContainerStyle={{
        paddingVertical: (height - ITEM_FULL_SIZE) / 2
      }}
      renderItem={({ item, index }) => (
        <AnimatedCard 
          item={item} 
          index={index} 
          scrollY={scrollY} 
        />
      )}
    />
  );
};