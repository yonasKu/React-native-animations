export type Item = {
  key: string;
  title: string;
  image: string;
  bg: string;
  description: string;
  author: {
    name: string;
    avatar: string;
  };
};

export const mockData: Item[] = [
  {
    key: '1',
    title: 'Beautiful Mountains',
    image: 'https://images.pexels.com/photos/1366919/pexels-photo-1366919.jpeg',
    bg: '#1a1a1a',
    description: 'Majestic mountain peaks reaching into the clouds with snow-capped summits and lush green valleys below. Perfect for hiking and photography enthusiasts.',
    author: {
      name: 'John Doe',
      avatar: 'https://randomuser.me/api/portraits/men/1.jpg'
    }
  },
  {
    key: '2',
    title: 'Ocean Waves',
    image: 'https://images.pexels.com/photos/1295138/pexels-photo-1295138.jpeg',
    bg: '#2a2a2a',
    description: 'Peaceful ocean waves crashing on the shore, with a beautiful sunset casting orange and pink hues across the water. The perfect place to relax and unwind.',
    author: {
      name: 'Jane Smith',
      avatar: 'https://randomuser.me/api/portraits/women/1.jpg'
    }
  },
  {
    key: '3',
    title: 'City Lights',
    image: 'https://images.pexels.com/photos/466685/pexels-photo-466685.jpeg',
    bg: '#3a3a3a',
    description: 'Vibrant city lights illuminating the night sky, with tall skyscrapers and bustling streets. The energy of the city never stops, day or night.',
    author: {
      name: 'Mike Johnson',
      avatar: 'https://randomuser.me/api/portraits/men/2.jpg'
    }
  },
  {
    key: '4',
    title: 'Forest Adventure',
    image: 'https://images.pexels.com/photos/167698/pexels-photo-167698.jpeg',
    bg: '#4a4a4a',
    description: 'Deep in the forest where sunlight filters through the dense canopy, creating magical light beams on the forest floor. A place of mystery and wonder.',
    author: {
      name: 'Emily Davis',
      avatar: 'https://randomuser.me/api/portraits/women/2.jpg'
    }
  }
];