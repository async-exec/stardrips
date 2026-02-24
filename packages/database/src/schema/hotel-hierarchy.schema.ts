import { relations } from 'drizzle-orm';
import { integer, varchar, text, pgEnum, pgTable } from 'drizzle-orm/pg-core';
import { enumToPgEnum } from '../lib/pg-enum';

/**
 * Hotel Hierarchy
 * :: Defines the hierarchical structure of hotels, brands, and groups
 *    Supports multi-level relationships: hotel_group → hotel_brand → property_line → hotel
 *    Used for mapping campaigns and subscriptions to the appropriate level
 */
export enum HotelLevels {
  HOTEL_GROUP = 'hotel_group',
  HOTEL_BRAND = 'hotel_brand',
  PROPERTY_LINE = 'property_line',
  HOTEL = 'hotel',
}

export const hotelLevels = pgEnum('hotel_levels', enumToPgEnum(HotelLevels));

export const hotelHierarchy = pgTable('hotel_hierarchy', {
  id: integer('id').primaryKey().generatedAlwaysAsIdentity(),
  name: varchar('name', { length: 255 }).notNull(),
  type: hotelLevels().notNull(),
  description: text().notNull(),
  parent_id: integer('parent_id'),
});

export type HotelHierarchy = typeof hotelHierarchy.$inferSelect;

export const hotelHierarchyRelations = relations(hotelHierarchy, ({ one }) => ({
  parent: one(hotelHierarchy, {
    fields: [hotelHierarchy.parent_id],
    references: [hotelHierarchy.id],
  }),
}));
