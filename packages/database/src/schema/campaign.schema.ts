import { relations } from 'drizzle-orm';
import {
  integer,
  varchar,
  text,
  timestamp,
  pgTable,
} from 'drizzle-orm/pg-core';
import { subscription } from './subscription.schema';

/**
 * Campaigns
 * :: Represents individual marketing campaigns sent via email, ads, or other channels.
 *    Linked to a subscription (newsletter, Meta Ads, etc.)
 */
export const campaign = pgTable('campaign', {
  id: integer('id').primaryKey().generatedAlwaysAsIdentity(),
  title: varchar('title', { length: 255 }),
  content: text('content'),

  subscription_id: integer('subscription_id').references(() => subscription.id),

  sent_at: timestamp('sent_at'),
  created_at: timestamp('created_at').defaultNow(),
  updated_at: timestamp('updated_at').defaultNow(),
});

export type Campaign = typeof campaign.$inferSelect;

export const campaignRelations = relations(campaign, ({ one }) => ({
  subscription: one(subscription, {
    fields: [campaign.subscription_id],
    references: [subscription.id],
  }),
}));
