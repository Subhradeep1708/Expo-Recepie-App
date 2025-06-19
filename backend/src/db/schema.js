import { integer, pgTable, varchar, serial, text, timestamp } from "drizzle-orm/pg-core";


export const favouritesTable = pgTable("favourites", {
    id: serial("id").primaryKey(),
    userId: text("user_id").notNull(),
    recipeId: integer("recipe_id").notNull(),
    title: text("title").notNull(),
    image: text("image"),
    cookTime: text("cook_time"),
    servings: text("servings"),
    createdAt: timestamp("created_at").defaultNow()
})