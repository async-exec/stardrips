import { relations } from 'drizzle-orm';
import {
  integer,
  varchar,
  timestamp,
  pgEnum,
  pgTable,
} from 'drizzle-orm/pg-core';
import { enumToPgEnum } from '../lib/pg-enum';

import { hotelHierarchy } from './hotel-hierarchy.schema';
import { hotel } from './hotel.schema';
import { provider } from './provider.schema';

/**
 * Subscriptions
 * :: Tracks the subscriptions to campaigns from hotels or brands
 *    Serves as the connection point for campaigns we ingest and analyze
 */
export enum SubscriptionStatus {
  PENDING = 'pending',
  SUBSCRIBED = 'subscribed',
  UNSUBSCRIBED = 'unsubscribed',
}

export const subscriptionStatus = pgEnum(
  'subscription_status',
  enumToPgEnum(SubscriptionStatus),
);

export const subscription = pgTable('subscription', {
  id: integer('id').primaryKey().generatedAlwaysAsIdentity(),

  sender_email: varchar('sender_email', { length: 255 }).notNull(),
  receiver_email: varchar('receiver_email', { length: 255 }).notNull(),

  provider_id: integer('provider_id').references(() => provider.id),
  hierarchy_id: integer('hierarchy_id').references(() => hotelHierarchy.id),
  hotel_id: integer('hotel_id').references(() => hotel.id),

  status: subscriptionStatus().default(SubscriptionStatus.PENDING),
  created_at: timestamp('created_at').defaultNow(),
  updated_at: timestamp('updated_at').defaultNow(),
});

export type Subscription = typeof subscription.$inferSelect;

export const subscriptionRelations = relations(subscription, ({ one }) => ({
  provider: one(provider, {
    fields: [subscription.provider_id],
    references: [provider.id],
  }),
  hierarchy: one(hotelHierarchy, {
    fields: [subscription.hierarchy_id],
    references: [hotelHierarchy.id],
  }),
  hotel: one(hotel, {
    fields: [subscription.hotel_id],
    references: [hotel.id],
  }),
}));
