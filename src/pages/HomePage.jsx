// src/pages/HomePage.jsx (Example - Apply similar changes to PlannerPage.jsx)
import React from 'react';
import ReadOnlyPlannerView from '../components/ReadOnlyPlannerView';

// Helper to format date range for display
const formatWeekRange = (startDate) => {
  const start = new Date(startDate);
  const end = new Date(start);
  end.setDate(start.getDate() + 6); // Add 6 days to get Sunday

  const startStr = start.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
  const endStr = end.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
  return `${startStr} - ${endStr}`;
};


// Receive the new navigation props and start date
function HomePage({
  mealPlan,
  daysOfWeek,
  mealSlots,
  weekDates,
  onNextWeek,
  onPreviousWeek,
  onGoToCurrent,
  currentWeekStartDate
}) {
  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 mb-4">Weekly Plan</h2>

      {/* --- Navigation Controls with Tailwind --- */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-6 pb-4 border-b border-gray-200"> {/* Flex layout, gap, margin, padding, border */}
        {/* Button Group for Prev/Next */}
        <div className="flex gap-2">
          <button
            onClick={onPreviousWeek}
            className="px-4 py-2 bg-white border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition ease-in-out duration-150" // Tailwind button styles
          >
            Previous
          </button>
          <button
            onClick={onNextWeek}
            className="px-4 py-2 bg-white border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition ease-in-out duration-150" // Tailwind button styles
          >
            Next
          </button>
        </div>

        {/* Week Range Display */}
        <h3 className="text-lg font-semibold text-gray-800 text-center sm:text-left order-first sm:order-none"> {/* Styling for week text, responsive ordering */}
          {formatWeekRange(currentWeekStartDate)}
        </h3>

        {/* Go to Current Button (slightly different style maybe?) */}
        <button
          onClick={onGoToCurrent}
          className="px-4 py-2 bg-indigo-600 border border-transparent rounded-md shadow-sm text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition ease-in-out duration-150" // Primary button style
        >
          Current Week
        </button>
      </div>
      {/* --- End Navigation Controls --- */}


      <ReadOnlyPlannerView
        mealPlan={mealPlan}
        daysOfWeek={daysOfWeek}
        mealSlots={mealSlots}
        weekDates={weekDates} // Pass the dates for the *selected* week
      />
    </div>
  );
}

export default HomePage;