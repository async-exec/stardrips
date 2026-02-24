import { relations } from 'drizzle-orm';
import { integer, varchar, text, decimal, pgTable } from 'drizzle-orm/pg-core';
import { hotelHierarchy } from './hotel-hierarchy.schema';
/**
 * Hotels
 * :: Stores basic metadata information about individual hotels
 */
export const hotel = pgTable('hotel', {
  id: integer('id').primaryKey().generatedAlwaysAsIdentity(),
  name: varchar('name', { length: 255 }).notNull(),
  address: varchar('address', { length: 255 }).notNull(),
  city: varchar('city', { length: 50 }).notNull(),
  country: varchar('country', { length: 3 }).notNull(),
  star_rating: integer('star_rating').notNull(),
  review_rating: decimal('review_rating').notNull(),
  review_count: integer('review_count').notNull(),
  property_line_id: integer('property_line_id').references(
    () => hotelHierarchy.id,
  ),
  photos: text('photos').array(),
});

export type Hotel = typeof hotel.$inferSelect;

export const hotelRelations = relations(hotel, ({ one }) => ({
  propertyLine: one(hotelHierarchy, {
    fields: [hotel.property_line_id],
    references: [hotelHierarchy.id],
  }),
}));
