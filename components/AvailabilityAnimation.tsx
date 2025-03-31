// components/AvailabilityAnimation.tsx
import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import Animated, {
  FadeIn,
  FadeOut,
  ZoomIn,
  ZoomOut,
} from 'react-native-reanimated';
import { MotiView } from 'moti';

// Constants
const spacing = 8;
const borderRadius = 12;
const itemSize = 60;

// Colors
const loadingColor = '#DDD';
const loadingColorWashed = '#EEE';

// Get random rotation value between min and max
const getRandomValue = (min = -5, max = 15) => {
  return Math.random() * (max - min) + min;
};

// Home item type
export interface HomeType {
  key: string;
  image: string;
}

interface AvailabilityAnimationProps {
  data: HomeType[];
  isLoading: boolean;
  showLeaderboard?: boolean;
  salesUsers?: UserType[];
}

// User type for leaderboard
export interface UserType {
  name: string;
  score: number;
  avatar?: string;
}

// Skeleton component for loading state
const Skeleton = ({ style, ...rest }: any) => {
  return (
    <MotiView
      {...rest}
      style={[styles.skeleton, style]}
      animate={{
        backgroundColor: [loadingColor, loadingColorWashed],
      }}
      transition={{
        duration: 1000,
        loop: true,
        repeatReverse: true,
      }}
    />
  );
};

const Item = ({ item, index }: { item: HomeType; index: number }) => {
  return (
    <View 
      style={[
        styles.imageContainer,
        { 
          marginLeft: index !== 0 ? -itemSize / 2 : 0,
          zIndex: index,
          transform: [{ rotate: `${getRandomValue()}deg` }]
        }
      ]}
    >
      <Image source={{ uri: item.image }} style={styles.image} />
    </View>
  );
};

// Loading skeleton items
const LoadingSkeleton = () => {
  return (
    <View style={styles.row}>
      {[0, 1, 2].map((index) => (
        <View 
          key={index} 
          style={[
            styles.imageContainer,
            { 
              marginLeft: index !== 0 ? -itemSize / 2 : 0,
              zIndex: index,
              transform: [{ rotate: `${getRandomValue()}deg` }]
            }
          ]}
        >
          <Skeleton 
            style={{
              width: '100%',
              height: '100%',
              borderRadius,
              borderWidth: spacing / 2,
              borderColor: 'white'
            }} 
          />
        </View>
      ))}
    </View>
  );
};

// Leaderboard Place component
type PlaceProps = {
  user: UserType;
  index: number;
  animationValue: Animated.SharedValue<number>;
  onFinish?: () => void;
};

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
  React.useEffect(() => {
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

// Leaderboard section component
const LeaderboardSection: React.FC<{ users: UserType[] }> = ({ users }) => {
  // Default users if none provided
  const defaultUsers: UserType[] = [
    { name: 'Alice', score: 95, avatar: 'https://i.pravatar.cc/150?u=alice' },
    { name: 'Bob', score: 82, avatar: 'https://i.pravatar.cc/150?u=bob' },
    { name: 'Charlie', score: 78, avatar: 'https://i.pravatar.cc/150?u=charlie' },
    { name: 'David', score: 65, avatar: 'https://i.pravatar.cc/150?u=david' },
    { name: 'Eva', score: 60, avatar: 'https://i.pravatar.cc/150?u=eva' },
  ];

  const displayUsers = users && users.length > 0 ? users : defaultUsers;
  
  // Shared animation value
  const animationValue = useSharedValue(0);

  // Start the animation when the component mounts
  React.useEffect(() => {
    // Reset animation value
    animationValue.value = 0;
    
    // Start animation after a short delay
    const timeout = setTimeout(() => {
      animationValue.value = 1;
    }, 500);
    
    return () => clearTimeout(timeout);
  }, []);

  // Handle when the last avatar animation finishes
  const handleLastAvatarFinish = () => {
    console.log('All animations completed!');
  };

  return (
    <View style={styles.leaderboardContainer}>
      <Text style={styles.leaderboardTitle}>Sales Leaderboard</Text>
      <View style={styles.placesContainer}>
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

export default function AvailabilityAnimation({ 
  data, 
  isLoading, 
  showLeaderboard = false,
  salesUsers
}: AvailabilityAnimationProps) {
  return (
    <View style={styles.mainContainer}>
      <View style={styles.container}>
        {!isLoading ? (
          <Animated.Text 
            style={styles.availableText}
            entering={FadeIn.springify().damping(80).stiffness(200)}
            exiting={FadeOut.springify().damping(80).stiffness(200)}
          >
            {data.length} available
          </Animated.Text>
        ) : (
          <Skeleton 
            style={{ 
              width: '80%', 
              height: itemSize * 0.25, 
              borderRadius: borderRadius / 2,
            }} 
            entering={FadeIn.springify().damping(80).stiffness(200)}
            exiting={FadeOut.springify().damping(80).stiffness(200)}
          />
        )}

        <View style={styles.imagesContainer}>
          {!isLoading ? (
            <View style={styles.row}>
              {data.map((item, index) => (
                <Animated.View 
                  key={item.key}
                  style={{ zIndex: index }}
                  entering={ZoomIn.springify().damping(80).stiffness(200).delay(index * 75)}
                  exiting={ZoomOut.springify().damping(80).stiffness(200).delay(index * 75)}
                >
                  <Item item={item} index={index} />
                </Animated.View>
              ))}
            </View>
          ) : (
            <LoadingSkeleton />
          )}
        </View>
      </View>

      {showLeaderboard && (
        <LeaderboardSection users={salesUsers} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    width: '100%',
  },
  container: {
    padding: spacing * 2,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    minHeight: itemSize,
  },
  availableText: {
    fontSize: 18,
    fontWeight: 'bold',
    flex: 6,
  },
  imagesContainer: {
    flex: 1,
    justifyContent: 'center',
    minHeight: itemSize,
  },
  row: {
    flexDirection: 'row',
    justifyContent:'flex-end',
  },
  imageContainer: {
    width: itemSize,
    height: itemSize,
    aspectRatio: 1,
    borderRadius,
    padding: spacing,
    backgroundColor: 'white',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 5,
  },
  image: {
    flex: 1,
    borderRadius,
  },
  skeleton: {
    backgroundColor: loadingColor,
  },
  leaderboardContainer: {
    padding: spacing * 2,
    marginTop: spacing * 2,
  },
  leaderboardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: spacing * 3,
    textAlign: 'center',
  },
  placesContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'flex-end',
    height: 300,
    width: '100%',
  },
  placeContainer: {
    alignItems: 'center',
    width: AVATAR_SIZE + spacing,
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