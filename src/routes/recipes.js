import express from "express";
import jsonwebtoken from "jsonwebtoken";
import bcrypt from "bcryptjs";

import { Recipe } from "../models/Recipes.js";
import { User } from "../models/Users.js";

const router = express.Router();
router.use(express.json());

router.get("/", async (req, res) => {
  const recipes = await Recipe.find();
  res.json(recipes);
});

router.post("/create", async (req, res) => {
  const { name, ingredients, instructions, imageUrl, cookingTime, userOwner } = req.body;
  
  const newRecipe = new Recipe({
    name,
    ingredients,
    instructions,
    imageUrl,
    cookingTime,
    userOwner,
  });

  await newRecipe.save();
  res.json({
    message: "✅ Recipe created successfully!",
    color: "green",
    recipe: newRecipe,
  });
});

router.put("/save", async (req, res) => {
  const { userID, recipeID } = req.body;

  try {
    const user = await User.findById(userID);
    if (!user) {
      return res.status(404).json({ message: "User not found", color: "red" });
    }

    const recipe = await Recipe.findById(recipeID);
    if (!recipe) {
      return res.status(404).json({ message: "Recipe not found", color: "red" });
    }

    if (!user.savedRecipes.includes(recipeID)) {
      user.savedRecipes.push(recipeID);
      await user.save();
    }

    res.json({ message: "✅ Recipe saved successfully", color: "green" });
  } catch (error) {
    console.error("Error saving recipe:", error);
    res.status(500).json({ message: "Server error", color: "red" });
  }
});

router.get("/saved/:id", async (req, res) => {
  const userID = req.params.id;

  try {
    const user = await User.findById(userID);
    if (!user) {
      return res.status(404).json({ message: "User not found", color: "red" });
    }

    res.json(user.savedRecipes);
  } catch (error) {
    console.error("Error fetching saved recipes:", error);
    res.status(500).json({ message: "Server error", color: "red" });
  }
});

router.get("/:id", async (req, res) => {
  const recipeID = req.params.id;

  try {
    const recipe = await Recipe.findById(recipeID);
    if (!recipe) {
      return res.status(404).json({ message: "Recipe not found", color: "red" });
    }

    res.json(recipe);
  } catch (error) {
    console.error("Error fetching recipe:", error);
    res.status(500).json({ message: "Server error", color: "red" });
  }
});

export { router as recipesRouter };
