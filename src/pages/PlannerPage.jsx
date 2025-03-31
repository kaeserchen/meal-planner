// src/pages/PlannerPage.jsx
import React, { useState } from 'react'; // Import useState for input fields

// Receive the updated/new handlers
function PlannerPage({
    recipes,
    mealPlan,
    onAddRecipeToMeal,
    onAddCustomItemToMeal, // New prop
    onRemoveItemFromMeal,  // Updated prop name
    daysOfWeek,
    mealSlots
}) {

    // State to hold the current text input values for each slot
    // Structure: { "Monday-breakfast": "current text", "Monday-lunch": "...", ... }
    const [customInputs, setCustomInputs] = useState({});

    // Helper to find recipe object by ID
    const findRecipeById = (recipeId) => {
         if (recipeId === null || recipeId === undefined || recipeId === "") return null;
         return recipes.find(r => r.id === parseInt(recipeId, 10));
    };

    // Update the state for a specific text input
    const handleInputChange = (day, slot, value) => {
        const key = `${day}-${slot}`;
        setCustomInputs(prev => ({
            ...prev,
            [key]: value
        }));
    };

    // Handle adding custom text when button is clicked or Enter is pressed
    const handleAddCustomText = (day, slot) => {
        const key = `${day}-${slot}`;
        const text = customInputs[key] || "";
        if (text.trim()) {
            onAddCustomItemToMeal(day, slot, text.trim());
            // Clear the input field after adding
            setCustomInputs(prev => ({
                ...prev,
                [key]: ''
            }));
        }
    };

    return (
        <div>
            <h2>Weekly Meal Planner</h2>
            <div style={{ display: 'flex', gap: '10px', overflowX: 'auto', paddingBottom: '10px' }}>
                {daysOfWeek.map(day => (
                    <div key={day} style={{ border: '1px solid #ccc', padding: '10px', minWidth: '220px', flexShrink: 0 }}> {/* Increased minWidth slightly */}
                        <h3>{day}</h3>
                        {mealSlots.map(slot => {
                            const plannedItems = Array.isArray(mealPlan[day]?.[slot]) ? mealPlan[day][slot] : [];
                            const inputKey = `${day}-${slot}`; // Unique key for the input state

                            return (
                                <div key={slot} style={{ borderTop: '1px dashed #eee', marginTop: '10px', paddingTop: '10px', minHeight: '100px' /* More space */ }}>
                                    <strong>{slot.charAt(0).toUpperCase() + slot.slice(1).replace(/([A-Z])/g, ' $1').trim()}:</strong>
                                    <div>
                                        {/* List of planned items (recipes OR custom text) */}
                                        <ul style={{ listStyle: 'none', paddingLeft: '5px', margin: '5px 0' }}>
                                            {plannedItems.length > 0 ? (
                                                plannedItems.map(item => (
                                                    // Use item.id as the key (it's unique for both types now)
                                                    <li key={item.id} style={{ marginBottom: '3px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                        {/* Display based on type */}
                                                        <span>{item.type === 'recipe' ? item.recipeName : item.text}</span>
                                                        {/* Remove button calls updated handler with item.id */}
                                                        <button
                                                            onClick={() => onRemoveItemFromMeal(day, slot, item.id)} // Use item.id
                                                            style={{ marginLeft: '10px', padding: '1px 5px', cursor: 'pointer', color: 'red', border: '1px solid red', background: 'none', fontSize: '0.8em' }}
                                                            title={`Remove ${item.type === 'recipe' ? item.recipeName : item.text}`}
                                                        >
                                                            X
                                                        </button>
                                                    </li>
                                                ))
                                            ) : (
                                                <li style={{ fontStyle: 'italic', color: '#777' }}>Empty</li>
                                            )}
                                        </ul>

                                        {/* --- Input section for adding --- */}
                                        <div style={{ marginTop: '10px' }}>
                                            {/* Dropdown to ADD a recipe */}
                                            <select
                                                value="" // Keep dropdown visually reset
                                                onChange={(e) => {
                                                    const recipe = findRecipeById(e.target.value);
                                                    if (recipe) { onAddRecipeToMeal(day, slot, recipe); }
                                                    e.target.value = ""; // Attempt reset
                                                }}
                                                style={{ width: '100%', padding: '4px', marginBottom: '5px' }}
                                            >
                                                <option value="">-- Add Recipe --</option>
                                                {recipes.map(recipe => ( <option key={recipe.id} value={recipe.id}>{recipe.name}</option> ))}
                                            </select>

                                            {/* Input to ADD custom text */}
                                            <div style={{ display: 'flex', gap: '5px' }}>
                                                <input
                                                    type="text"
                                                    placeholder="Or type item..."
                                                    value={customInputs[inputKey] || ""} // Controlled input
                                                    onChange={(e) => handleInputChange(day, slot, e.target.value)}
                                                    onKeyPress={(e) => { if (e.key === 'Enter') handleAddCustomText(day, slot); }} // Add on Enter key
                                                    style={{ flexGrow: 1, padding: '4px' }}
                                                />
                                                <button
                                                    onClick={() => handleAddCustomText(day, slot)}
                                                    style={{ padding: '4px 8px' }}
                                                >
                                                    Add
                                                </button>
                                            </div>
                                        </div>
                                        {/* --- End Input section --- */}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                ))}
            </div>
        </div>
    );
}

export default PlannerPage;