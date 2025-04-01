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
        // Planner Grid - Restructured Layout
        <div className="grid grid-cols-7 gap-2 md:gap-3"> {/* Grid for the whole week */}

            {/* Row 1: Day Headers */}
             {daysOfWeek.map((day, index) => {
                const date = weekDates[index];
                const formattedDate = formatDate(date);
                return (
                    <div key={`header-${day}`} className="text-center mb-2 pb-1 border-b border-gray-200 bg-gray-50 p-2 rounded-t-lg">
                        <h3 className="text-base md:text-lg font-semibold text-gray-800">{day}</h3>
                        {formattedDate && <p className="text-xs text-gray-500">({formattedDate})</p>}
                    </div>
                );
            })}

            {/* Rows 2-N: Meal Slots - Iterate slots FIRST, then days */}
             {mealSlots.map(slot => (
                <React.Fragment key={slot}>
                    {daysOfWeek.map(day => {
                        const plannedItems = mealPlan?.[day]?.[slot] ?? [];
                        const cellKey = `${day}-${slot}`;

                        return (
                            // Cell for a specific Day & Slot
                             <div key={cellKey} className="bg-white p-3 border-t border-gray-100 first:border-t-0">
                                <strong className="text-xs md:text-sm font-medium text-indigo-700 block mb-1.5">
                                    {slot.charAt(0).toUpperCase() + slot.slice(1).replace(/([A-Z])/g, ' $1').trim()}:
                                </strong>

                                {/* List of planned items */}
                                <ul className="space-y-1 min-h-[2rem]"> {/* Ensure list has some min-height */}
                                    {plannedItems.length > 0 ? (
                                        plannedItems.map(item => (
                                            // Item styling (allowing wrapping)
                                            <li key={item.id} className="text-xs md:text-sm text-gray-700 p-0.5">
                                                <span className="break-words"> {/* Use break-words */}
                                                    {item.type === 'recipe' ? item.recipeName : item.text}
                                                </span>
                                            </li>
                                        ))
                                    ) : (
                                        <li className="text-xs text-gray-400 italic px-0.5">Empty</li>
                                    )}
                                </ul>
                                {/* NO ADD BUTTON HERE */}
                            </div> // End Cell
                        );
                    })}
                </React.Fragment>
            ))}
        </div> // End Planner Grid
    );
}

export default ReadOnlyPlannerView;