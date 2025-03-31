// src/pages/PlannerPage.jsx
import React, { useState } from 'react'; // Import useState for input fields

// Helper to format date range for display (same as in HomePage)
const formatWeekRange = (startDate) => {
  const start = new Date(startDate);
  const end = new Date(start);
  end.setDate(start.getDate() + 6); // Add 6 days to get Sunday

  const startStr = start.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
  const endStr = end.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
  return `${startStr} - ${endStr}`;
};

// Helper to format individual dates (already existed)
const formatDate = (date) => {
  if (!date) return '';
  return date.toLocaleDateString(undefined, {
      month: 'short',   // e.g., 'Apr'
      day: 'numeric'    // e.g., '2'
  });
};

// --- Receive the new navigation props and start date ---
function PlannerPage({
  recipes,
  mealPlan,
  onAddRecipeToMeal,
  onAddCustomItemToMeal,
  onRemoveItemFromMeal,
  daysOfWeek,
  mealSlots,
  weekDates,
  // New props for navigation:
  onNextWeek,
  onPreviousWeek,
  onGoToCurrent,
  currentWeekStartDate
}) {

  // Local state for input fields remains the same
  const [customInputs, setCustomInputs] = useState({});

  // Helper functions remain the same
  const findRecipeById = (recipeId) => {
       if (recipeId === null || recipeId === undefined || recipeId === "") return null;
       return recipes.find(r => r.id === parseInt(recipeId, 10));
  };
  const handleInputChange = (day, slot, value) => {
      const key = `${day}-${slot}`;
      setCustomInputs(prev => ({ ...prev, [key]: value }));
  };
  const handleAddCustomText = (day, slot) => {
      const key = `${day}-${slot}`;
      const text = customInputs[key] || "";
      if (text.trim()) {
          onAddCustomItemToMeal(day, slot, text.trim());
          setCustomInputs(prev => ({ ...prev, [key]: '' }));
      }
  };
  // --- End Helper Functions ---


  return (
      <div>
          <h2>Weekly Meal Planner</h2>

          {/* --- Navigation Controls (Copied from HomePage structure) --- */}
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '15px', marginBottom: '1rem', borderBottom: '1px solid #eee', paddingBottom: '1rem' }}>
              <button onClick={onPreviousWeek}>Previous Week</button>
              <h3 style={{ margin: 0 }}>Week of: {formatWeekRange(currentWeekStartDate)}</h3>
              <button onClick={onNextWeek}>Next Week</button>
              <button onClick={onGoToCurrent}>Go to Current Week</button>
          </div>
          {/* --- End Navigation Controls --- */}


          {/* --- Planner Grid (Existing code) --- */}
          <div style={{ display: 'flex', gap: '10px', overflowX: 'auto', paddingBottom: '10px' }}>
              {daysOfWeek.map((day, index) => {
                  const date = weekDates[index]; // Use the dates for the selected week
                  const formattedDate = formatDate(date);

                  return (
                      <div key={day} style={{ border: '1px solid #ccc', padding: '10px', minWidth: '220px', flexShrink: 0 }}>
                          <h3>
                              {day}
                              {formattedDate && <div style={{ fontSize: '0.8em', fontWeight: 'normal', color: '#555' }}>({formattedDate})</div>}
                          </h3>

                          {mealSlots.map(slot => {
                              // Use the mealPlan for the selected week
                              const plannedItems = Array.isArray(mealPlan[day]?.[slot]) ? mealPlan[day][slot] : [];
                              const inputKey = `${day}-${slot}`;

                              return (
                                  <div key={slot} style={{ borderTop: '1px dashed #eee', marginTop: '10px', paddingTop: '10px', minHeight: '100px' }}>
                                      <strong>{slot.charAt(0).toUpperCase() + slot.slice(1).replace(/([A-Z])/g, ' $1').trim()}:</strong>
                                      <div>
                                          {/* List of planned items */}
                                          <ul style={{ listStyle: 'none', paddingLeft: '5px', margin: '5px 0' }}>
                                              {plannedItems.length > 0 ? (
                                                  plannedItems.map(item => (
                                                      <li key={item.id} style={{ marginBottom: '3px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                          <span>{item.type === 'recipe' ? item.recipeName : item.text}</span>
                                                          <button
                                                              onClick={() => onRemoveItemFromMeal(day, slot, item.id)} // Handler already uses correct week context from App.jsx
                                                              style={{ marginLeft: '10px', padding: '1px 5px', cursor: 'pointer', color: 'red', border: '1px solid red', background: 'none', fontSize: '0.8em' }}
                                                              title={`Remove ${item.type === 'recipe' ? item.recipeName : item.text}`}
                                                          > X </button>
                                                      </li>
                                                  ))
                                              ) : (
                                                  <li style={{ fontStyle: 'italic', color: '#777' }}>Empty</li>
                                              )}
                                          </ul>

                                          {/* Input section for adding */}
                                          <div style={{ marginTop: '10px' }}>
                                              <select
                                                  value="" // Keep dropdown visually reset
                                                  onChange={(e) => {
                                                      const recipe = findRecipeById(e.target.value);
                                                      if (recipe) { onAddRecipeToMeal(day, slot, recipe); } // Handler already uses correct week context
                                                      e.target.value = "";
                                                  }}
                                                  style={{ width: '100%', padding: '4px', marginBottom: '5px' }}
                                              >
                                                  <option value="">-- Add Recipe --</option>
                                                  {recipes.map(recipe => ( <option key={recipe.id} value={recipe.id}>{recipe.name}</option> ))}
                                              </select>

                                              <div style={{ display: 'flex', gap: '5px' }}>
                                                  <input
                                                      type="text"
                                                      placeholder="Or type item..."
                                                      value={customInputs[inputKey] || ""}
                                                      onChange={(e) => handleInputChange(day, slot, e.target.value)}
                                                      onKeyPress={(e) => { if (e.key === 'Enter') handleAddCustomText(day, slot); }} // Handler already uses correct week context
                                                      style={{ flexGrow: 1, padding: '4px' }}
                                                  />
                                                  <button
                                                      onClick={() => handleAddCustomText(day, slot)} // Handler already uses correct week context
                                                      style={{ padding: '4px 8px' }}
                                                  > Add </button>
                                              </div>
                                          </div>
                                          {/* End Input section */}
                                      </div>
                                  </div>
                              );
                          })}
                      </div>
                  );
              })}
          </div>
          {/* --- End Planner Grid --- */}
      </div>
  );
}

export default PlannerPage;