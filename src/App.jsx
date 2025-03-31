// src/App.jsx
import React, { useState, useEffect } from 'react'; // Make sure useEffect is imported
import { Routes, Route, Link } from 'react-router-dom';
import HomePage from './pages/HomePage';
import RecipesPage from './pages/RecipesPage';
import PlannerPage from './pages/PlannerPage';
import './App.css';

// === Logic moved from RecipesPage ===
const RECIPES_LOCAL_STORAGE_KEY = 'myMealPlannerRecipes'; // Renamed slightly for clarity

// === Add Planner Constants ===
const PLANNER_LOCAL_STORAGE_KEY = 'myMealPlannerPlan';
const DAYS_OF_WEEK = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
const MEAL_SLOTS = ["breakfast", "morningSnack", "lunch", "afternoonSnack", "dinner"];
// === End Planner Constants ===

const initialRecipes = [
  { id: 1, name: "Spaghetti Carbonara", description: "A classic Roman pasta dish." },
  { id: 2, name: "Chicken Curry", description: "Creamy and flavorful chicken curry." },
  { id: 3, name: "Tofu Scramble", description: "A delicious vegan breakfast option." },
  { id: 4, name: "Lentil Soup", description: "Hearty and healthy lentil soup." }
];
// === End of moved logic ===

function App() {
  // === State and handlers now live in App ===
  const [recipes, setRecipes] = useState(() => {
    try {
      const storedRecipes = localStorage.getItem(RECIPES_LOCAL_STORAGE_KEY);
      return storedRecipes ? JSON.parse(storedRecipes) : initialRecipes;
    } catch (error) {
      console.error("Error parsing recipes from localStorage", error);
      return initialRecipes;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(RECIPES_LOCAL_STORAGE_KEY, JSON.stringify(recipes));
    } catch (error) {
      console.error("Error saving recipes to localStorage", error);
    }
  }, [recipes]);

  const handleAddRecipe = (newRecipeData) => { // Parameter changed slightly
    const newRecipe = {
      id: Date.now(),
      name: newRecipeData.name,
      description: newRecipeData.description,
    };
    setRecipes(prevRecipes => [...prevRecipes, newRecipe]);
  };

  const handleDeleteRecipe = (idToDelete) => {
    if (window.confirm("Are you sure you want to delete this recipe?")) {
      setRecipes(prevRecipes => prevRecipes.filter(recipe => recipe.id !== idToDelete));
    }
  };
  // === End of state and handlers ===


  // === Meal Plan State ===
  const [mealPlan, setMealPlan] = useState(() => {
    // Function to create a default empty plan structure
    const createEmptyPlan = () => {
        return DAYS_OF_WEEK.reduce((acc, day) => {
            acc[day] = MEAL_SLOTS.reduce((meals, slot) => {
                meals[slot] = []; // Initialize each slot as empty array
                return meals;
            }, {});
            return acc;
        }, {});
    };

    try {
        const storedPlan = localStorage.getItem(PLANNER_LOCAL_STORAGE_KEY);
        // Parse stored plan if it exists, otherwise create a new empty one
        return storedPlan ? JSON.parse(storedPlan) : createEmptyPlan();
    } catch (error) {
        console.error("Error parsing meal plan from localStorage", error);
        // Fallback to an empty plan on error
        return createEmptyPlan();
    }
  });

  // Effect to save mealPlan to localStorage whenever it changes
  useEffect(() => {
    try {
      localStorage.setItem(PLANNER_LOCAL_STORAGE_KEY, JSON.stringify(mealPlan));
    } catch (error) {
      console.error("Error saving meal plan to localStorage", error);
    }
  }, [mealPlan]); // Dependency array ensures this runs only when mealPlan changes

     // === UPDATED Meal Plan Handlers ===

    // Add a Recipe from the list
    const handleAddRecipeToMeal = (day, slot, recipe) => {
      if (!recipe) return;
      console.log(`Adding RECIPE ${recipe.name} to ${day} ${slot}`);
      setMealPlan(prevPlan => {
          const newPlan = JSON.parse(JSON.stringify(prevPlan));
          if (!Array.isArray(newPlan[day][slot])) { newPlan[day][slot] = []; } // Ensure array exists

          // Check if recipe already exists
          const recipeExists = newPlan[day][slot].some(item => item.type === 'recipe' && item.recipeId === recipe.id);

          if (!recipeExists) {
              newPlan[day][slot].push({
                  type: 'recipe',         // <-- Add type
                  id: `recipe-${recipe.id}`, // Unique ID for React key (can be simple for recipes)
                  recipeId: recipe.id,
                  recipeName: recipe.name
              });
          } else {
              console.log(`Recipe ${recipe.name} already in ${day} ${slot}`);
          }
          return newPlan;
      });
  };

  // Add a Custom Text Item
  const handleAddCustomItemToMeal = (day, slot, text) => {
      if (!text || !text.trim()) return; // Don't add empty text
      const trimmedText = text.trim();
      console.log(`Adding CUSTOM TEXT "${trimmedText}" to ${day} ${slot}`);
      setMealPlan(prevPlan => {
          const newPlan = JSON.parse(JSON.stringify(prevPlan));
          if (!Array.isArray(newPlan[day][slot])) { newPlan[day][slot] = []; } // Ensure array exists

          newPlan[day][slot].push({
              type: 'custom',         // <-- Add type
              id: `custom-${Date.now()}`, // Unique ID for custom items
              text: trimmedText
          });
          return newPlan;
      });
  };


  // Remove an Item (Recipe or Custom) using its unique 'id'
  const handleRemoveItemFromMeal = (day, slot, itemIdToRemove) => {
       console.log(`Removing item ID ${itemIdToRemove} from ${day} ${slot}`);
       setMealPlan(prevPlan => {
          const newPlan = JSON.parse(JSON.stringify(prevPlan));
          if (Array.isArray(newPlan[day][slot])) {
              // Filter out the item with the matching 'id'
              newPlan[day][slot] = newPlan[day][slot].filter(item => item.id !== itemIdToRemove);
          }
          return newPlan;
      });
  };
  // === End of UPDATED Meal Plan Handlers ===

  return (
    <div className="App">
.     <nav style={{ padding: '1rem', backgroundColor: '#eee', marginBottom: '1rem' }}>
        <ul style={{ listStyle: 'none', display: 'flex', gap: '1rem', margin: 0, padding: 0 }}>
          <li><Link to="/">Home</Link></li>
          <li><Link to="/recipes">Recipes</Link></li>
          <li><Link to="/planner">Planner</Link></li>
        </ul>
      </nav>

      <main>
        <Routes>
          <Route path="/" element={<HomePage />} /> {/* Will pass mealPlan later */}
          {/* Pass recipes state and handlers down to RecipesPage */}
          <Route
            path="/recipes"
            element={
              <RecipesPage
                recipes={recipes}
                onAddRecipe={handleAddRecipe} // Pass add handler
                onDeleteRecipe={handleDeleteRecipe} // Pass delete handler
              />
            }
          />

          {/* PlannerPage receives its props */}
          <Route
            path="/planner"
            element={
              <PlannerPage
                recipes={recipes}
                mealPlan={mealPlan}
                // Pass down the updated/new handlers
                onAddRecipeToMeal={handleAddRecipeToMeal}
                onAddCustomItemToMeal={handleAddCustomItemToMeal} // New handler
                onRemoveItemFromMeal={handleRemoveItemFromMeal} // Renamed/updated handler
                // Pass constants
                daysOfWeek={DAYS_OF_WEEK}
                mealSlots={MEAL_SLOTS}
              /> 
            } 
          />
        </Routes>
      </main>
    </div>
  );
}

export default App;