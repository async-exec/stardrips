import { faker } from '@faker-js/faker';
import { db } from './database';

import {
  HotelLevels,
  HotelHierarchy,
  hotelHierarchy,
  Hotel,
  hotel,
  Provider,
  provider,
  Campaign,
  campaign,
  subscription,
} from './schema/entry';

type PartialHotel = Omit<Hotel, 'id' | 'property_line_id'>;

function fakeHotel(): PartialHotel {
  return {
    name: `${faker.location.city()} ${faker.helpers.arrayElement(['Hotel', 'Resort', 'Suites'])}`,
    address: faker.location.streetAddress(),
    city: faker.location.city(),
    country: faker.location.country(),
    star_rating: faker.number.int({ min: 1, max: 5 }),
    review_count: faker.number.int({ min: 0, max: 1000 }),
    review_rating: faker.number.float({ min: 1, max: 5 }).toString(),
    photos: [faker.image.url({ width: 640, height: 480 })],
  };
}

type PartialProvider = Omit<Provider, 'id'>;

function fakeProviders(): PartialProvider {
  return {
    name: faker.lorem.word(),
    metadata: {
      url: faker.internet.url(),
      description: faker.lorem.paragraph(),
    },
  };
}

type PartialBrand = Omit<HotelHierarchy, 'id' | 'parent_id'>;

function fakeBrands(): PartialBrand {
  // Use the actual HotelLevels type for the array
  const levels: HotelLevels[number][] = [
    'hotel_group',
    'hotel_brand',
    'property_line',
    'hotel',
  ];

  return {
    name: faker.company.name(),
    type: levels[Math.floor(Math.random() * levels.length)] as any,
    description: faker.lorem.paragraph(),
  };
}

type PartialCampaign = Omit<Campaign, 'id' | 'subscription_id'>;

function fakeCampaigns(): PartialCampaign {
  return {
    title: faker.lorem.sentence(),
    content: faker.lorem.paragraph(),
    sent_at: faker.date.past(),
    created_at: faker.date.past(),
    updated_at: faker.date.past(),
  };
}

async function checkTables(): Promise<void> {
  const tables = [
    { name: 'Hotel', table: hotel },
    { name: 'Hotel Hierarchy', table: hotelHierarchy },
    { name: 'Provider', table: provider },
    { name: 'Subscription', table: subscription },
    { name: 'Campaign', table: campaign },
  ];

  for (const t of tables) {
    const rows = await db.select().from(t.table).limit(5);
    console.log(`${t.name} (showing 5):`, rows);
  }
}

async function seed(): Promise<void> {
  function generate<T>(func: () => T, n = 5): T[] {
    return Array.from({ length: n }, func);
  }

  await Promise.allSettled([
    db.insert(hotelHierarchy).values(generate<PartialBrand>(fakeBrands, 5)),
    db.insert(hotel).values(generate<PartialHotel>(fakeHotel, 100)),
    db.insert(provider).values(generate<PartialProvider>(fakeProviders, 2)),
    db.insert(campaign).values(generate<PartialCampaign>(fakeCampaigns, 100)),
  ]);

  await checkTables();
}

seed().catch((err) => console.error(err));
