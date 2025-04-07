import { faker } from '@faker-js/faker';

const images = [
  'https://images.unsplash.com/photo-1616594039964-ae9021a400a0?q=80&w=1470&h=1080',
  'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?q=80&w=1470&h=1080',
  'https://images.unsplash.com/photo-1560185007-c5ca9d2c014d?q=80&w=1470&h=1080',
  'https://images.unsplash.com/photo-1560185127-6ed189bf02f4?q=80&w=1470&h=1080',
];

export type ItemDetail = {
  title: string;
  value: number | boolean;
  unit: string;
};

export type ItemExtra = {
  title: string;
  value: boolean;
};

export const data = Array(4)
  .fill(0)
  .map((_, index) => ({
    key: faker.string.uuid(),
    title: faker.commerce.department(),
    image: images[index % images.length],
    details: [
      {
        title: 'temperature',
        value: faker.number.int({ min: 12, max: 40 }),
        unit: '°C',
      },
      {
        title: 'humidity',
        value: faker.number.int({ min: 30, max: 80 }),
        unit: '%',
      },
      {
        title: 'timer',
        value: faker.datatype.boolean(),
        unit: '',
      },
    ],
    extras: [
      {
        title: 'lights',
        value: faker.datatype.boolean(),
      },
      {
        title: 'air conditioner',
        value: faker.datatype.boolean(),
      },
      {
        title: 'music',
        value: faker.datatype.boolean(),
      },
    ],
  }));

export type Item = typeof data[0];
