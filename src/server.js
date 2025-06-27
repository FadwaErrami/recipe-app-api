import express from "express"
import { ENV } from "./config/env.js";
import {db} from "./config/db.js";  
import { favoritesTable } from "./db/schema.js";
import { eq, and } from "drizzle-orm";

const app = express();
const PORT = ENV.PORT || 8001;

app.use(express.json());

app.get("/api/health", (req, res) => {
  res.status(200).json({
    status: "ok",
    message: "Server is running",
  });
});


app.post("/api/favorites",async (req, res) => {
      try {
       const {userId, recipeId, image,title,cookTime,serving,postId} = req.body;
       if(!userId || !recipeId || !image || !title || !cookTime || !serving || !postId) {
         return res.status(400).json({ error: "All fields are required" });
       }
       const newFFavorite = await db.insert(favoritesTable).values({
         userId,
          recipeId,
          image,
          title,  
          cookTime,
          serving,
          postId
       }). returning();

       res.status(201).json(newFFavorite[0]);
     } catch (error) {
       console.error("Error processing favorites:", error);
       res.status(500).json({ error: "Internal Server Error" });
     }
});


app.delete("/api/favorites/:userId/:recipeId", async (req, res) => {
  const { userId, recipeId } = req.params;

  try {
    await db
      .delete(favoritesTable)
      .where(
        and(
          eq(favoritesTable.userId, userId),
          eq(favoritesTable.recipeId, parseInt(recipeId))
        )
      );

    res.status(200).json({ message: "Favorite deleted successfully" });
  } catch (error) {
    console.error("Error deleting favorite:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});


app.get("/api/favorites/:userId", async (req, res) => {
  const { userId } = req.params;

  try {
    const favorites = await db
      .select()
      .from(favoritesTable)
      .where(eq(favoritesTable.userId, userId));

    res.status(200).json(favorites);
  } catch (error) {
    console.error("Error fetching favorites:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

