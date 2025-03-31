// src/pages/RecipesPage.jsx
import React, { useState } from 'react'; // Keep useState for form inputs
import RecipeItem from '../components/RecipeItem';

// Component now receives props from App.jsx
function RecipesPage({ recipes, onAddRecipe, onDeleteRecipe }) {
  // State only needed for the form inputs now
  const [newRecipeName, setNewRecipeName] = useState('');
  const [newRecipeDescription, setNewRecipeDescription] = useState('');

  // Handler for form submission - now calls the prop function
  const handleAddSubmit = (event) => {
    event.preventDefault();
    if (!newRecipeName.trim()) {
      alert("Please enter a recipe name.");
      return;
    }
    // Call the function passed down from App.jsx
    onAddRecipe({ name: newRecipeName, description: newRecipeDescription });

    // Clear local form state
    setNewRecipeName('');
    setNewRecipeDescription('');
  };

  // No need for handleDeleteRecipe here anymore - it's passed directly to RecipeItem

  return (
    <div>
      <h2>My Recipes</h2>

      {recipes.length === 0 ? (
        <p>No recipes yet. Add your first one!</p>
      ) : (
        <ul style={{ padding: 0 }}>
          {recipes.map((recipe) => (
            <RecipeItem
              key={recipe.id}
              recipe={recipe}
              // Pass the onDeleteRecipe function received from App down to RecipeItem
              onDelete={onDeleteRecipe}
            />
          ))}
        </ul>
      )}

      <hr />
      <h3>Add a New Recipe</h3>
      {/* Make sure form onSubmit calls the local handleAddSubmit */}
      <form onSubmit={handleAddSubmit} style={{ marginTop: '1rem' }}>
        <div>
          <label htmlFor="recipeName">Recipe Name: </label>
          <input
            type="text"
            id="recipeName"
            value={newRecipeName}
            onChange={(e) => setNewRecipeName(e.target.value)}
            required
          />
        </div>
        <div style={{ marginTop: '0.5rem' }}>
          <label htmlFor="recipeDescription">Description: </label>
          <textarea
            id="recipeDescription"
            value={newRecipeDescription}
            onChange={(e) => setNewRecipeDescription(e.target.value)}
            rows="3"
            style={{ verticalAlign: 'top' }}
          />
        </div>
        <button type="submit" style={{ marginTop: '0.5rem' }}>
          Add Recipe
        </button>
      </form>
    </div>
  );
}

export default RecipesPage;