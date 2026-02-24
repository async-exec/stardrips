import { integer, varchar, jsonb, pgTable } from 'drizzle-orm/pg-core';

/**
 * Source Provider
 * :: Lists external sources from which campaigns are received
 *    Examples: Mailchimp, Meta Ads, TikTok Ads, or hotel email servers
 *    Used to track the origin of each subscription
 */
export const provider = pgTable('provider', {
  id: integer('id').primaryKey().generatedAlwaysAsIdentity(),
  name: varchar('name', { length: 255 }).notNull(),
  metadata: jsonb('metadata'),
});

export type Provider = typeof provider.$inferSelect;
