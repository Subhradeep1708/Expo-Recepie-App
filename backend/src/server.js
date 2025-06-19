import express from 'express'
import cors from 'cors'
import { env } from './config/env.js'
import { db } from './config/db.js'
import { favouritesTable } from './db/schema.js'
import { and, eq } from 'drizzle-orm'

const port = env.PORT
const app = express()
app.use(cors())
app.use(express.json())

app.get('/api/hello', (req, res) => {
    res.send("Hello")
})

app.post("/api/v1/favourites", async (req, res) => {
    try {
        const { userId, recipeId, title, image, cookTime, servings } = req.body;

        if (!userId || !recipeId || !title) {
            return res.status(400).json({ error: "Missing required fields" })
        }

        const newFavourite = await db.insert(favouritesTable).values({
            userId,
            recipeId,
            title,
            image,
            cookTime,
            servings,
        }).returning();

        res.status(201).json(newFavourite[0])
    } catch (error) {
        console.log("Error adding favourite", error);
        res.status(500).json({ error: "Something went very very wrong" })
    }
})


app.get('/api/v1/favourites/:userId', async (req, res) => {
    try {
        const { userId } = req.params

        const userFavourites = await db.select().from(favouritesTable).where(eq(favouritesTable.userId, userId))

        // res.status(200).json(newFavourite) its by default status(200)
        res.json(userFavourites);

    } catch (error) {
        console.log("Error fetching the favourites", error);
        res.status(500).json({ error: "Something went very very wrong" })
    }
})

app.delete("/api/v1/favourites/:userId/:recipeId", async (req, res) => {
    try {
        const { userId, recipeId } = req.params

        await db
            .delete(favouritesTable)
            .where(
                and(eq(favouritesTable.userId, userId), eq(favouritesTable.recipeId, parseInt(recipeId)))
            )

        res.status(200).json({ message: "Favourite deleted successfully" })

    } catch (error) {
        console.log("Error removing a favourite", error);
        res.status(500).json({ error: "Something went very very wrong" })
    }
})



app.listen(port, () => {
    console.log("server listening on port", port);
})