// components/LeaderboardAnimation.tsx
import React, { useEffect } from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withSpring, 
  withDelay, 
  withTiming, 
  runOnJS,
  interpolate,
  interpolateColor,
  useDerivedValue
} from 'react-native-reanimated';

// Constants
const AVATAR_SIZE = 40;
const SPACING = 8;
const STAGGER_DURATION = 50;
const BAR_COLOR = 'rgba(0, 0, 0, 0.1)';
const FIRST_PLACE_COLOR = '#FFD700'; // Gold color

// Types
export type User = {
  name: string;
  score: number;
  avatar?: string;
};

type PlaceProps = {
  user: User;
  index: number;
  animationValue: Animated.SharedValue<number>;
  onFinish?: () => void;
};

// The Place component for each user in the leaderboard
const Place: React.FC<PlaceProps> = ({ user, index, animationValue, onFinish }) => {
  // Create a derived value with spring animation and delay
  const animValue = useDerivedValue(() => {
    return withDelay(
      STAGGER_DURATION * index,
      withSpring(animationValue.value, {
        damping: 80,
        stiffness: 200,
      })
    );
  });

  // Animated styles for the bar
  const barStyles = useAnimatedStyle(() => {
    const height = Math.max(
      interpolate(
        animValue.value,
        [0, 1],
        [AVATAR_SIZE, user.score * 3]
      ),
      AVATAR_SIZE
    );

    const backgroundColor = index === 0 
      ? interpolateColor(
          animValue.value,
          [0, 1],
          [BAR_COLOR, FIRST_PLACE_COLOR]
        )
      : BAR_COLOR;

    return {
      height,
      backgroundColor,
    };
  });

  // Animated styles for the score text
  const textStyles = useAnimatedStyle(() => {
    return {
      opacity: interpolate(
        animValue.value,
        [0, 0.5, 1],
        [0, 0, 1]
      ),
    };
  });

  // Handle animation completion
  useEffect(() => {
    const timeout = setTimeout(() => {
      if (onFinish && index === 0) {
        onFinish();
      }
    }, 1000 + (STAGGER_DURATION * index));
    
    return () => clearTimeout(timeout);
  }, [index, onFinish]);

  return (
    <View style={styles.placeContainer}>
      <Animated.View style={[styles.bar, barStyles]}>
        <View style={styles.avatarContainer}>
          <Image 
            source={{ 
              uri: user.avatar || `https://i.pravatar.cc/150?u=${user.name}` 
            }} 
            style={styles.avatar} 
          />
        </View>
        <Animated.Text style={[styles.scoreText, textStyles]}>
          {user.score}
        </Animated.Text>
      </Animated.View>
      <Text style={styles.nameText}>{user.name}</Text>
    </View>
  );
};

// Main LeaderboardAnimation component
interface LeaderboardAnimationProps {
  users?: User[];
}

const LeaderboardAnimation: React.FC<LeaderboardAnimationProps> = ({ users }) => {
  // Default users if none provided
  const defaultUsers: User[] = [
    { name: 'Alice', score: 95, avatar: 'https://i.pravatar.cc/150?u=alice' },
    { name: 'Bob', score: 82, avatar: 'https://i.pravatar.cc/150?u=bob' },
    { name: 'Charlie', score: 78, avatar: 'https://i.pravatar.cc/150?u=charlie' },
    { name: 'David', score: 65, avatar: 'https://i.pravatar.cc/150?u=david' },
    { name: 'Eva', score: 60, avatar: 'https://i.pravatar.cc/150?u=eva' },
    { name: 'Frank', score: 55, avatar: 'https://i.pravatar.cc/150?u=frank' },
    { name: 'Grace', score: 45, avatar: 'https://i.pravatar.cc/150?u=grace' },
  ];

  const displayUsers = users && users.length > 0 ? users : defaultUsers;
  
  // Shared animation value
  const animationValue = useSharedValue(0);

  // Start the animation when the component mounts
  useEffect(() => {
    // Reset animation value
    animationValue.value = 0;
    
    // Start animation after a short delay
    const timeout = setTimeout(() => {
      animationValue.value = withTiming(1, { duration: 500 });
    }, 500);
    
    return () => clearTimeout(timeout);
  }, []);

  // Handle when the last avatar animation finishes
  const handleLastAvatarFinish = () => {
    console.log('All animations completed!');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Sales Leaderboard</Text>
      <View style={styles.leaderboardContainer}>
        {displayUsers.map((user, index) => (
          <Place 
            key={user.name} 
            user={user} 
            index={index}
            animationValue={animationValue}
            onFinish={index === 0 ? handleLastAvatarFinish : undefined}
          />
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 24,
    textAlign: 'center',
  },
  leaderboardContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'flex-end',
    height: 300,
    width: '100%',
  },
  placeContainer: {
    alignItems: 'center',
    width: AVATAR_SIZE + SPACING,
  },
  bar: {
    width: AVATAR_SIZE,
    borderRadius: AVATAR_SIZE / 2,
    alignItems: 'center',
    justifyContent: 'flex-start',
    overflow: 'hidden',
  },
  avatarContainer: {
    width: AVATAR_SIZE,
    height: AVATAR_SIZE,
    aspectRatio: 1,
    overflow: 'hidden',
  },
  avatar: {
    width: '100%',
    height: '100%',
    borderRadius: AVATAR_SIZE / 2,
  },
  scoreText: {
    fontSize: 12,
    fontWeight: '700',
    marginTop: 4,
  },
  nameText: {
    fontSize: 12,
    marginTop: 8,
    textAlign: 'center',
  },
});

export default LeaderboardAnimation;