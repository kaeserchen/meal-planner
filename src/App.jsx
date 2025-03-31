// src/App.jsx
import React, { useState, useEffect, useCallback } from 'react'; // Add useCallback
import { Routes, Route, Link } from 'react-router-dom';
import HomePage from './pages/HomePage';
import RecipesPage from './pages/RecipesPage';
import PlannerPage from './pages/PlannerPage';
import './App.css';

// Constants
const RECIPES_LOCAL_STORAGE_KEY = 'myMealPlannerRecipes';
const ALL_PLANS_LOCAL_STORAGE_KEY = 'myMealPlannerAllPlans'; // Renamed for clarity
const DAYS_OF_WEEK = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
const MEAL_SLOTS = ["breakfast", "morningSnack", "lunch", "afternoonSnack", "dinner"];
const initialRecipes = [ /* ... */ ];

// --- Helper Functions ---

// Get the date for the Monday of the week containing the given date
function getMonday(d) {
  d = new Date(d);
  d.setHours(0, 0, 0, 0); // Normalize time
  const day = d.getDay(); // 0 = Sun, 1 = Mon, ..., 6 = Sat
  const diff = d.getDate() - day + (day === 0 ? -6 : 1); // Adjust when day is Sunday
  return new Date(d.setDate(diff));
}

// Format date as YYYY-MM-DD for using as object keys
function formatDateKey(date) {
    const d = new Date(date);
    const month = `${d.getMonth() + 1}`.padStart(2, '0');
    const day = `${d.getDate()}`.padStart(2, '0');
    const year = d.getFullYear();
    return `${year}-${month}-${day}`;
}

// Get array of 7 Date objects starting from the given start date
function getWeekDates(startDate) {
  const weekDates = [];
  const start = new Date(startDate); // Use the provided start date
  start.setHours(0, 0, 0, 0);

  for (let i = 0; i < 7; i++) {
    const date = new Date(start);
    date.setDate(start.getDate() + i);
    weekDates.push(date);
  }
  return weekDates;
}

// Create an empty structure for a single week's plan
const createEmptyPlan = () => {
    return DAYS_OF_WEEK.reduce((acc, day) => {
        acc[day] = MEAL_SLOTS.reduce((meals, slot) => {
            meals[slot] = []; // Initialize each slot as empty array
            return meals;
        }, {});
        return acc;
    }, {});
};


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

  // --- Week Navigation State ---
  const [currentWeekStartDate, setCurrentWeekStartDate] = useState(() => getMonday(new Date()));
  
  // --- All Meal Plans State ---
  const [allMealPlans, setAllMealPlans] = useState(() => {
    try {
      const storedPlans = localStorage.getItem(ALL_PLANS_LOCAL_STORAGE_KEY);
      return storedPlans ? JSON.parse(storedPlans) : {}; // Default to empty object
    } catch (error) {
      console.error("Error parsing all meal plans from localStorage", error);
      return {};
    }
  });

  // Effect to save allMealPlans to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(ALL_PLANS_LOCAL_STORAGE_KEY, JSON.stringify(allMealPlans));
    } catch (error) {
      console.error("Error saving all meal plans to localStorage", error);
    }
  }, [allMealPlans]);

  // --- Get Derived State for the Current Week ---
  const currentWeekKey = formatDateKey(currentWeekStartDate);
  const currentWeekDates = getWeekDates(currentWeekStartDate);
  // Get the plan for the current week, or create an empty one if it doesn't exist
  const currentMealPlan = allMealPlans[currentWeekKey] || createEmptyPlan();


  // --- Week Navigation Handlers ---
  const goToNextWeek = useCallback(() => {
    setCurrentWeekStartDate(prevDate => {
      const nextWeek = new Date(prevDate);
      nextWeek.setDate(prevDate.getDate() + 7);
      return nextWeek;
    });
  }, []);

  const goToPreviousWeek = useCallback(() => {
    setCurrentWeekStartDate(prevDate => {
      const prevWeek = new Date(prevDate);
      prevWeek.setDate(prevDate.getDate() - 7);
      return prevWeek;
    });
  }, []);

  const goToCurrentWeek = useCallback(() => {
      const todayMonday = getMonday(new Date());
      // Only update state if it's actually different to avoid unnecessary re-renders
      if (formatDateKey(todayMonday) !== formatDateKey(currentWeekStartDate)) {
          setCurrentWeekStartDate(todayMonday);
      }
  }, [currentWeekStartDate]); // Re-create if currentWeekStartDate changes relative to today


  // --- UPDATED Meal Plan Modification Handlers ---
  // Now operate on the allMealPlans state using currentWeekKey

  const handleAddRecipeToMeal = useCallback((day, slot, recipe) => {
    if (!recipe) return;
    const weekKey = currentWeekKey; // Use the key from derived state
    console.log(`Adding RECIPE ${recipe.name} to ${day} ${slot} for week ${weekKey}`);

    setAllMealPlans(prevPlans => {
      const newPlans = { ...prevPlans }; // Shallow copy top level
      // Ensure the week exists, create if not
      if (!newPlans[weekKey]) {
          newPlans[weekKey] = createEmptyPlan();
      }
      // Deep copy the specific week plan before modifying
      const weekPlan = JSON.parse(JSON.stringify(newPlans[weekKey]));

      if (!Array.isArray(weekPlan[day]?.[slot])) { weekPlan[day][slot] = []; }

      const recipeExists = weekPlan[day][slot].some(item => item.type === 'recipe' && item.recipeId === recipe.id);

      if (!recipeExists) {
        weekPlan[day][slot].push({
            type: 'recipe',
            id: `recipe-${recipe.id}-${Date.now()}`, // Add timestamp for potential duplication across slots/days
            recipeId: recipe.id,
            recipeName: recipe.name
        });
        newPlans[weekKey] = weekPlan; // Put the modified week plan back
        return newPlans;
      } else {
          console.log(`Recipe ${recipe.name} already in ${day} ${slot}`);
          return prevPlans; // No change needed
      }
    });
  }, [currentWeekKey]); // Depend on currentWeekKey

  const handleAddCustomItemToMeal = useCallback((day, slot, text) => {
    if (!text || !text.trim()) return;
    const trimmedText = text.trim();
    const weekKey = currentWeekKey;
    console.log(`Adding CUSTOM TEXT "${trimmedText}" to ${day} ${slot} for week ${weekKey}`);

    setAllMealPlans(prevPlans => {
      const newPlans = { ...prevPlans };
      if (!newPlans[weekKey]) {
          newPlans[weekKey] = createEmptyPlan();
      }
      const weekPlan = JSON.parse(JSON.stringify(newPlans[weekKey]));

      if (!Array.isArray(weekPlan[day]?.[slot])) { weekPlan[day][slot] = []; }

      weekPlan[day][slot].push({
        type: 'custom',
        id: `custom-${Date.now()}`,
        text: trimmedText
      });
      newPlans[weekKey] = weekPlan;
      return newPlans;
    });
  }, [currentWeekKey]);

  const handleRemoveItemFromMeal = useCallback((day, slot, itemIdToRemove) => {
    const weekKey = currentWeekKey;
    console.log(`Removing item ID ${itemIdToRemove} from ${day} ${slot} for week ${weekKey}`);

    setAllMealPlans(prevPlans => {
        const newPlans = { ...prevPlans };
        // Only proceed if the week and slot actually exist and have data
        if (newPlans[weekKey] && Array.isArray(newPlans[weekKey][day]?.[slot])) {
            const weekPlan = JSON.parse(JSON.stringify(newPlans[weekKey]));
            weekPlan[day][slot] = weekPlan[day][slot].filter(item => item.id !== itemIdToRemove);
            newPlans[weekKey] = weekPlan;
            return newPlans;
        }
        return prevPlans; // No change if week/slot/item doesn't exist
    });
  }, [currentWeekKey]);

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
          <Route
            path="/"
            element={
              <HomePage
                // Pass data for the *current* view week
                mealPlan={currentMealPlan}
                daysOfWeek={DAYS_OF_WEEK}
                mealSlots={MEAL_SLOTS}
                weekDates={currentWeekDates}
                // Pass navigation handlers
                onNextWeek={goToNextWeek}
                onPreviousWeek={goToPreviousWeek}
                onGoToCurrent={goToCurrentWeek}
                currentWeekStartDate={currentWeekStartDate} // Pass start date for display
              />
            }
          />
          <Route
            path="/recipes"
            element={
              <RecipesPage
                recipes={recipes}
                onAddRecipe={handleAddRecipe}
                onDeleteRecipe={handleDeleteRecipe}
              />
            }
          />
          <Route
            path="/planner"
            element={
              <PlannerPage
                recipes={recipes} // Needed for dropdown
                 // Pass data for the *current* view week
                mealPlan={currentMealPlan}
                daysOfWeek={DAYS_OF_WEEK}
                mealSlots={MEAL_SLOTS}
                weekDates={currentWeekDates}
                // Pass modification handlers (already depend on correct week via useCallback)
                onAddRecipeToMeal={handleAddRecipeToMeal}
                onAddCustomItemToMeal={handleAddCustomItemToMeal}
                onRemoveItemFromMeal={handleRemoveItemFromMeal}
                 // Pass navigation handlers
                onNextWeek={goToNextWeek}
                onPreviousWeek={goToPreviousWeek}
                onGoToCurrent={goToCurrentWeek}
                currentWeekStartDate={currentWeekStartDate} // Pass start date for display
              />
            }
          />
        </Routes>
      </main>
    </div>
  );
}

export default App;