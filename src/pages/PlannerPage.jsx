// src/pages/PlannerPage.jsx
import React, { useState } from 'react'; // Import useState for input fields
import AddItemPopover from '../components/AddItemPopover'; // Import the popover

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
  // === State for Popover ===
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  const [popoverTarget, setPopoverTarget] = useState({ day: null, slot: null });
  const [referenceElement, setReferenceElement] = useState(null); // Store the button node
  // === End State for Popover ===

  // Helper functions remain the same
  const findRecipeById = (recipeId) => {
    if (recipeId === null || recipeId === undefined || recipeId === "") return null;
    return recipes.find(r => r.id === parseInt(recipeId, 10));
  };
  // --- End Helper Functions ---

  // === Popover Handlers ===
  const handleTogglePopover = (event, day, slot) => {
    const currentButton = event.currentTarget;
    // If clicking the same button that already has the popover open, close it.
    if (isPopoverOpen && referenceElement === currentButton) {
      setIsPopoverOpen(false);
      setReferenceElement(null);
      setPopoverTarget({ day: null, slot: null });
    } else {
      // Otherwise, open it (or move it) for the clicked button
      setReferenceElement(currentButton);
      setPopoverTarget({ day, slot });
      setIsPopoverOpen(true);
    }
  };

  const handleClosePopover = () => {
    setIsPopoverOpen(false);
    setReferenceElement(null); // Clear reference on close
    setPopoverTarget({ day: null, slot: null });
  };

  // This handler now receives day/slot directly from popover submit
  const handlePopoverSubmit = ({ type, data, day, slot }) => {
    // const { day, slot } = popoverTarget; // No longer need popoverTarget here
    if (!day || !slot) return;

    if (type === 'recipe' && data) {
      console.log(`Popover adding RECIPE ${data.name} to ${day} ${slot}`);
      onAddRecipeToMeal(day, slot, data);
    } else if (type === 'custom' && data) {
      console.log(`Popover adding CUSTOM TEXT "${data}" to ${day} ${slot}`);
      onAddCustomItemToMeal(day, slot, data);
    }
    // Popover closes itself via useDismiss/internal logic now
    // handleClosePopover(); // Don't need to call explicitly here
  };
  // === End Popover Handlers ===
  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 mb-4">Weekly Meal Planner</h2>

      {/* Navigation Controls (Keep as is) */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-6 pb-4 border-b border-gray-200">
        <div className="flex gap-2">
          <button
            onClick={onPreviousWeek}
            className="px-4 py-2 bg-white border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition ease-in-out duration-150"
          >
            Previous
          </button>
          <button
            onClick={onNextWeek}
            className="px-4 py-2 bg-white border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition ease-in-out duration-150"
          >
            Next
          </button>
        </div>

        <h3 className="text-lg font-semibold text-gray-800 text-center sm:text-left order-first sm:order-none">
          {formatWeekRange(currentWeekStartDate)}
        </h3>

        <button
          onClick={onGoToCurrent}
          className="px-4 py-2 bg-indigo-600 border border-transparent rounded-md shadow-sm text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition ease-in-out duration-150"
        >
          Current Week
        </button>
      </div>

      {/* Planner Grid - Using CSS Grid for Layout */}
      <div className="grid grid-cols-7 gap-2 md:gap-3"> {/* Use Grid, 7 columns, add gap */}
        {daysOfWeek.map((day, index) => {
          const date = weekDates[index];
          const formattedDate = formatDate(date);

          return (
            // Day Column
            <div key={day} className="bg-white rounded-lg shadow border border-gray-200 p-3"> {/* Reduced padding */}
              {/* Day Header */}
              <div className="text-center mb-2 pb-1 border-b border-gray-100"> {/* Reduced margin/padding */}
                <h3 className="text-base md:text-lg font-semibold text-gray-800">{day}</h3> {/* Responsive text size */}
                {formattedDate && <p className="text-xs text-gray-500">({formattedDate})</p>}
              </div>

              {/* Meal Slots Container */}
              <div className="space-y-3"> {/* Reduced space */}
                {mealSlots.map(slot => {
                  const plannedItems = Array.isArray(mealPlan[day]?.[slot]) ? mealPlan[day][slot] : [];
                  const inputKey = `${day}-${slot}`;

                  return (
                    // Slot Section
                    <div key={slot} className="border-t border-gray-100 pt-2"> {/* Reduced padding */}
                      {/* Slot Title */}
                      <strong className="text-xs md:text-sm font-medium text-indigo-700 block mb-1.5">{slot.charAt(0).toUpperCase() + slot.slice(1).replace(/([A-Z])/g, ' $1').trim()}:</strong>

                      {/* List of planned items */}
                      <ul className="space-y-1 mb-2"> {/* Reduced margin */}
                        {plannedItems.length > 0 ? (
                          plannedItems.map(item => (
                            // Item
                            <li key={item.id} className="group flex justify-between items-start text-xs md:text-sm text-gray-700 p-0.5 rounded hover:bg-gray-100"> {/* Changed to items-start */}
                              {/* Remove truncate, min-w-0, pr-0.5. Let text wrap naturally. */}
                              <span className="flex-grow"> {/* Allow span to grow, text will wrap */}
                                {item.type === 'recipe' ? item.recipeName : item.text}
                              </span>
                              {/* Keep button styling, but ensure it aligns well with potentially multiple lines */}
                              <button
                                onClick={() => onRemoveItemFromMeal(day, slot, item.id)}
                                className="opacity-0 group-hover:opacity-100 text-red-500 hover:text-red-700 focus:outline-none focus:text-red-700 transition-opacity duration-150 ease-in-out ml-1 pl-1 flex-shrink-0" // Adjusted margin/padding slightly
                                title={`Remove ${item.type === 'recipe' ? item.recipeName : item.text}`}
                              >
                                ✕
                              </button>
                            </li>

                          ))
                        ) : (
                          // Empty State
                          <li className="text-xs text-gray-400 italic px-0.5">Empty</li>
                        )}
                      </ul>

                      {/* Popover Trigger Button */}
                      <button
                        // Use handleTogglePopover, passing the event
                        onClick={(e) => handleTogglePopover(e, day, slot)}
                        // Check if this button is the current reference for styling (optional)
                        // aria-expanded={isPopoverOpen && referenceElement === event.currentTarget} // Needs ref instead of event
                        className={`w-full flex items-center justify-center px-2 py-1 border border-dashed rounded-md text-xs font-medium transition-colors ${isPopoverOpen && referenceElement?.getAttribute('data-trigger-key') === `${day}-${slot}` // Check if this button triggered the open popover
                          ? 'bg-indigo-50 border-indigo-300 text-indigo-700' // Active trigger style
                          : 'border-gray-300 text-gray-500 hover:text-gray-700 hover:border-gray-400' // Default style
                          } focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500`}
                        title="Add item to this slot"
                        data-trigger-key={`${day}-${slot}`} // Add data attribute to identify button
                      >
                        <svg className="h-4 w-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
                        </svg>
                        Add
                      </button>
                      {/* End Popover Trigger Button */}
                    </div> // End Slot Section
                  );
                })}
              </div> {/* End Meal Slots Container */}
            </div> // End Day Column
          );
        })}
      </div> {/* End Planner Grid */}
      {/* Render ONE Popover Instance - pass referenceElement */}
      {isPopoverOpen && referenceElement && ( // Only render if open AND reference exists
        <AddItemPopover
          isOpen={isPopoverOpen}
          onClose={handleClosePopover}
          onAddItem={handlePopoverSubmit}
          recipes={recipes}
          day={popoverTarget.day} // Pass target day/slot
          slot={popoverTarget.slot}
          // Floating UI props
          referenceElement={referenceElement} // Pass the button node
        />
      )}
    </div>
  );
}

export default PlannerPage;