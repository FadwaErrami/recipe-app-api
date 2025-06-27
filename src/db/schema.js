import {pgTable,serial, text, timestamp,integer} from 'drizzle-orm/pg-core';

export const favoritesTable = pgTable('favorites', {
  id: serial('id').primaryKey(),
  userId: text('user_id').notNull(),
  recipeId: integer('recipe_id').notNull(),
  title : text('title').notNull(),
  image: text('image'),
  cookTime: text('cook_time'),
  serving: text('serving'),
  postId: integer('post_id').notNull(),
  createdAt: timestamp('created_at').defaultNow(),
});