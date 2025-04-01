// src/components/ReadOnlyPlannerView.jsx
import React from 'react';

// Helper function to format dates (same as in PlannerPage)
const formatDate = (date) => {
    if (!date) return '';
    return date.toLocaleDateString(undefined, {
        month: 'short',   // e.g., 'Apr'
        day: 'numeric'    // e.g., '2'
    });
};

function ReadOnlyPlannerView({ mealPlan, daysOfWeek, mealSlots, weekDates }) {

    return (
        // Planner Grid - Using CSS Grid for Layout
        <div className="grid grid-cols-7 gap-2 md:gap-3">
            {daysOfWeek.map((day, index) => {
                const date = weekDates[index];
                const formattedDate = formatDate(date);

                return (
                    // Day Column
                    <div key={day} className="bg-white rounded-lg shadow border border-gray-200 p-3">
                        {/* Day Header */}
                        <div className="text-center mb-2 pb-1 border-b border-gray-100">
                            <h3 className="text-base md:text-lg font-semibold text-gray-800">{day}</h3>
                            {formattedDate && <p className="text-xs text-gray-500">({formattedDate})</p>}
                        </div>

                        {/* Meal Slots Container */}
                        <div className="space-y-3">
                            {mealSlots.map(slot => {
                                const plannedItems = mealPlan?.[day]?.[slot] ?? [];

                                return (
                                    // Slot Section
                                    <div key={slot} className="border-t border-gray-100 pt-2">
                                        {/* Slot Title */}
                                        <strong className="text-xs md:text-sm font-medium text-indigo-700 block mb-1.5">{slot.charAt(0).toUpperCase() + slot.slice(1).replace(/([A-Z])/g, ' $1').trim()}:</strong>

                                        {/* List of planned items */}
                                        <ul className="space-y-1">
                                            {plannedItems.length > 0 ? (
                                                plannedItems.map(item => (
                                                    // Item
                                                    <li key={item.id} className="text-xs md:text-sm text-gray-700 p-0.5">
                                                        {/* Remove truncate, min-w-0, block. Let text wrap naturally */}
                                                        <span>
                                                            {item.type === 'recipe' ? item.recipeName : item.text}
                                                        </span>
                                                    </li>
                                                ))
                                            ) : (
                                                // Empty State
                                                <li className="text-xs text-gray-400 italic px-0.5">Empty</li>
                                            )}
                                        </ul>
                                        {/* NO INPUT SECTION HERE */}
                                    </div> // End Slot Section
                                );
                            })}
                        </div> {/* End Meal Slots Container */}
                    </div> // End Day Column
                );
            })}
        </div> // End Planner Grid
    );
}

export default ReadOnlyPlannerView;