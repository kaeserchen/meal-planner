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
      {/* --- Navigation Controls --- */}
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '15px', marginBottom: '1rem' }}>
          <button onClick={onPreviousWeek}>Previous Week</button>
          <h3>Week of: {formatWeekRange(currentWeekStartDate)}</h3>
          <button onClick={onNextWeek}>Next Week</button>
          <button onClick={onGoToCurrent}>Go to Current Week</button>
      </div>
      {/* --- End Navigation Controls --- */}

      <h2>Dashboard / Weekly Plan</h2>
      <p>This is a read-only view of the selected week's meal plan.</p>

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